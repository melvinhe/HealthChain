import os
import json

from cryptography.hazmat.primitives import hashes

from cryptography.hazmat.primitives.asymmetric import rsa, padding
from cryptography.hazmat.primitives import serialization


def chain_data_verifier_transaction(data, metadata):
    """
    a. create signature with private_keyA(pubkey(data)+metadata)) + pubkeyA(data)+metadata) pubkey(a) return privh(pubkey(data)+metadata))
    :return:
    """
    private_key = load_key(path='key.pem', private=True)
    pub_key = load_key(path='key.pub', private=False)

    private_key_verified = load_key(path='verifier.pem', private=True)
    public_key_verified = load_key(path='verifier.pub', private=False)

    data_encoded = json.dumps(data, indent=2).encode('utf-8')

    signature_patient = sign_message((str(encrypt_message(data_encoded, pub_key)) + str(metadata)).encode('utf-8'), private_key)

    # Eventually this code would be used to verify on the blockchain

    # valid_message = verify_signed_message(signature_patient, (str(encrypt_message(data_encoded, pub_key)) + str(metadata)).encode('utf-8'), pub_key)
    #
    # if not valid_message:
    #     raise ValueError("Patient data was not signed by patient")

    signature_verifier = sign_message((str(encrypt_message(data_encoded, pub_key)) + str(metadata)).encode('utf-8'), private_key_verified)

    return signature_patient, signature_verifier, public_key_verified


def create_keys_if_empty():
    if not (os.path.exists('key.pem') and os.path.exists('key.pub')):
        create_private_key()

    if not (os.path.exists('verifier.pem') and os.path.exists('verifier.pub')):
        create_private_key('verifier')

    if not (os.path.exists('business.pem') and os.path.exists('business.pub')):
        create_private_key('business')


def create_private_key(location='key'):
    """
    Writes private key to disk, returns public key string
    """
    private_key = rsa.generate_private_key(
        public_exponent=65537,
        key_size=2048
    )
    pem = private_key.private_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PrivateFormat.PKCS8,
        encryption_algorithm=serialization.NoEncryption(),
    )

    with open(f'{location}.pem', mode='wb') as f:
        f.write(pem)

    public_key = private_key.public_key()
    pub = public_key.public_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PublicFormat.SubjectPublicKeyInfo,
    )

    with open(f'{location}.pub', mode='wb') as f:
        f.write(pub)

    print(f"Created private key at {location}.pem and public key at {location}.pub")


def load_key(path: str, private=False):
    serialization_method = serialization.load_pem_private_key if private else serialization.load_pem_public_key
    with open(path, "rb") as file:
        if private:
            key = serialization_method(
                file.read(),
                password=None,
            )
        else:
            key = serialization_method(
                file.read()
            )
    return key


def sign_message(message, private_key):
    signature = private_key.sign(
        message,
        padding.PSS(
            mgf=padding.MGF1(hashes.SHA256()),
            salt_length=padding.PSS.MAX_LENGTH,
        ),
        hashes.SHA256(),
    )
    return signature


def verify_signed_message(signature, message, public_key):
    try:
        public_key.verify(
            signature,
            message,
            padding.PSS(
                mgf=padding.MGF1(hashes.SHA256()),
                salt_length=padding.PSS.MAX_LENGTH,
            ),
            hashes.SHA256(),
        )
        return True
    except:
        return False


def encrypt_message(message, public_key):
    encrypted_payload = {}

    for i in range(0, len(message), 100):
        encrypted_message_fraction = public_key.encrypt(
            message[i:i + 100],
            padding.OAEP(
                mgf=padding.MGF1(algorithm=hashes.SHA256()),
                algorithm=hashes.SHA256(),
                label=None
            )
        )
        encrypted_payload[i] = encrypted_message_fraction
    return encrypted_payload


def decrypt_message(encrypted_message: dict, private_key):
    # Decrypt the message with the private key
    keys = sorted([x for x in encrypted_message])
    decrypted_fractions = []
    for key in keys:
        decrypted_fraction = private_key.decrypt(
            encrypted_message[key],
            padding.OAEP(
                mgf=padding.MGF1(algorithm=hashes.SHA256()),
                algorithm=hashes.SHA256(),
                label=None
            )
        )
        decrypted_fractions.append(decrypted_fraction)
    return b''.join(decrypted_fractions)


if __name__ == '__main__':
    private_key = load_key(path='key.pem', private=True)
    public_key = load_key(path='key.pub')

    with open('../patient_data_single.json') as f:
        message = json.dumps(json.load(f), indent=2).encode('utf-8')

    encrypted_message = encrypt_message(message, public_key)
    decrypted_message = decrypt_message(encrypted_message, private_key)
    print(f"Original message {message} was encrypted and decrypted to {message}")
    assert message == decrypted_message, "Decrypted message didn't match original"

    document = message
    signature = sign_message(document, private_key)
    message_status = verify_signed_message(signature, document, public_key)
    print(f"Signature for {document} is determined to be {'valid' if message_status else 'invalid'}")
