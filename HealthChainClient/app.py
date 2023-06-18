from flask import Flask
from flask import request

from encryption import create_keys_if_empty

app = Flask(__name__)


@app.route('/')
def hello_world():  # put application's code here
    return 'Hello Healthchain'


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


    return request.get_json()


if __name__ == '__main__':
    app.run()
