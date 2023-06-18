import os

from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography.hazmat.primitives.asymmetric import padding
# from cryptography.hazmat.primitives import serialization
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

    signature = sign_message(pub_key.encrypt(data) + metadata, private_key)

    # private_key.sign(public_key.encrypt(data) + metadata)

def create_keys_if_empty():
    if not (os.path.exists('key.pem') and os.path.exists('key.pub')):
        create_private_key()

    if not (os.path.exists('verifier.pem') and os.path.exists('verifier.pub')):
        create_private_key('verifier')


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
    pass

def decrypt_message(message, private_key):
    pass

if __name__ == '__main__':
    # create_private_key()
    private_key = load_key(path='key.pem', private=True)
    public_key = load_key(path='key.pub')
    signature = sign_message(b'Test', private_key)
    message_status = verify_signed_message(signature, b'Test', public_key)
