import json
import uuid

from cryptography.hazmat.primitives import serialization
from flask import Flask
from flask import request

from data_processing import clean_fhir_data
from encryption import create_keys_if_empty, chain_data_verifier_transaction

app = Flask(__name__)


@app.route('/')
def hello_world():  # put application's code here
    return 'Hello Healthchain!'


@app.route('/encode-patient-data', methods=["POST"])
def encode_data():
    """
    1. If not wallet private key, create private key
    2. Run data extraction algorithm to get
        a. all raw data alone
        b. metadata
    3. If private key and public key
        a. create signature with private_keyA(pubkey(data)+metadata)) + pubkeyA(data)+metadata) pubkey(a) return privh(pubkey(data)+metadata))
    :return:
    """
    create_keys_if_empty()

    # TODO: validate formatting using FHIR validators
    fhir_data = request.get_json()
    fhir_metadata, phi = clean_fhir_data(fhir_data)

    signature_patient, signature_verifier, public_key_verified = chain_data_verifier_transaction(fhir_data,
                                                                                                 fhir_metadata)

    t1_id = str(uuid.uuid4())
    t2_id = str(uuid.uuid4())

    with open(f'records/{t1_id}.json', "w") as f:
        json.dump({"patient_signature": str(signature_patient)}, f)

    with open(f'records/{t2_id}.json', "w") as f:
        json.dump({"verifier_signature": str(signature_verifier), "verifier_public_key": str(public_key_verified)}, f)

    payload = {"transaction 1": t1_id, "transaction 2": t2_id}

    return str(payload), 201, {}


@app.route('/pub-b', methods=["GET"])
def get_pub_b_customer():
    create_keys_if_empty()

    with open('business.pub', 'rb') as file:
        key = serialization.load_pem_public_key(
            file.read()
        )

    return str(key.public_bytes(encoding=serialization.Encoding.PEM,
                                format=serialization.PublicFormat.SubjectPublicKeyInfo))

@app.route('/pub-b-return', methods=["GET"])
def get_pub_b_():
    return "", 501, {}

@app.route('/get-valid-patients', methods=["GET"])
def get_valid_patients():
    pass

@app.route('/decode-patient-data', methods=["POST"])
def decode_data():
    """
    Given POINTEr TO PubA(Data) + metadata we execute the followin transactions

    1. Return PubB(PrivA) (logged as transaction on change)
    2. Use PrivB(1) --> PrivA
    3. Use PrivA(PubA(Data)) + metadata to get Data + metadata
    4. Return 1 (uuid logged on chain) and 3 (location calculations only visible to B)
    :return:
    """
    with open("patient_1.json") as f:
        json_result = json.load(f)
    return json_result, 201, {}

if __name__ == '__main__':
    app.run()
