import uuid

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
    payload = {"transaction 1": t1_id, "transaction 2": t2_id}

    return str(payload), 201, {}


if __name__ == '__main__':
    app.run()
