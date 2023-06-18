from flask import Flask
from flask import request

app = Flask(__name__)


@app.route('/')
def hello_world():  # put application's code here
    return 'Hello Healthchain'


@app.route('/encode-patient-data', methods=["POST"])
def encode_data():  # put application's code here
    return request.get_json()


if __name__ == '__main__':
    app.run()
