import json
import uuid
import os

from cryptography.hazmat.primitives import serialization
from data_processing import clean_fhir_data
from encryption import chain_data_verifier_transaction, create_keys_if_empty
from flask import Flask, request
from flask_cors import CORS, cross_origin
from node_operations import get_all_nodes, parse_node

app = Flask(__name__)
cors = CORS(app)

@app.route("/")
def hello_world():  # put application's code here
    return "Hello Healthchain!"


@app.route("/encode-patient-data", methods=["POST"])
@cross_origin()
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
    fhir_data = json.loads(fhir_data) if type(fhir_data) is str else fhir_data
    fhir_metadata, phi = clean_fhir_data(fhir_data[0])

    (
        signature_patient,
        signature_verifier,
        public_key_verified,
    ) = chain_data_verifier_transaction(fhir_data, fhir_metadata)

    t1_id = str(uuid.uuid4())
    t2_id = str(uuid.uuid4())

    print(os.getcwd())
    with open(f"./records/{t1_id}.json", "w+") as f:
        json.dump({"patient_signature": str(signature_patient)}, f)

    with open(f"./records/{t2_id}.json", "w+") as f:
        json.dump(
            {
                "verifier_signature": str(signature_verifier),
                "verifier_public_key": str(public_key_verified),
            },
            f,
        )

    payload = {"transaction 1": t1_id, "transaction 2": t2_id}

    return str(payload), 201, {}


@app.route("/pub-b", methods=["GET"])
def get_pub_b_customer():
    create_keys_if_empty()

    with open("business.pub", "rb") as file:
        key = serialization.load_pem_public_key(file.read())

    return str(
        key.public_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PublicFormat.SubjectPublicKeyInfo,
        )
    )


@app.route("/pub-b-return", methods=["GET"])
def get_pub_b_():
    return "", 501, {}


@app.route("/get-valid-patients", methods=["GET"])
def get_valid_patients():
    """
    Given criteria of patient_diseases, search and get the number of patients from the blockchain who match
    :return: list of uuid records of P
    """
    valid_conditions = []
    for condition in request.args.getlist("condition"):
        valid_conditions.append(condition)

    # Iterate through all valid nodes on blockchain, if it's a node with metadata try to read its metadata
    node_list = get_all_nodes()
    # return uuids of all nodes

    valid_patients = []
    for node_address in node_list:
        node_data = parse_node(node_address)
        if not node_data:
            continue
        metadata = node_data[1]
        for valid_condition in valid_conditions:
            if valid_condition in metadata.get("conditions", []):
                valid_patients.append(node_data)

    return {"num_patients": len(valid_patients) + 1}


@app.route("/decode-patient-data", methods=["POST"])
def decode_data():
    """
    Given Pointer TO PubA(Data) + metadata we execute the followin transactions

    1. Return PubB(PrivA) (logged as transaction on change)
    2. Use PrivB(1) --> PrivA
    3. Use PrivA(PubA(Data)) + metadata to get Data + metadata
    4. Return 1 (uuid logged on chain) and 3 (location calculations only visible to B)
    :return:
    """
    with open("../patient_1.json") as f:
        json_result = json.load(f)
    return json_result, 201, {}


if __name__ == "__main__":
    app.run()
