# HealthChain

## About 

The HealthChain solution provides a secure platform for users to upload their electronic health record (EHR) data. By leveraging blockchain technology, the solution ensures the privacy and integrity of the data throughout the process. Here's how it works:

## Technical Description

HealthChain revolutionizes patient privacy by offering a groundbreaking solution that empowers individuals to control the sharing of their personal information with researchers. Our React frontend serves as the central hub for patients, researchers, and hospitals, facilitating seamless sign-in and authentication. With our robust public/private key encryption scheme, patients can encrypt their data, granting exclusive access to authorized researchers. By requesting the hospital's signature and publishing the transaction on the chain, patients ensure data integrity. Researchers can then access patients' non-encrypted public meta-data, allowing them to submit a request for data to individuals found to be eligible. Patients retain full control over these requests, with the ability to accept or deny research proposals in exchange for DOT tokens. Our stack incorporates a smart contract developed using the Gear framework and deployed on the Vara network. This smart contract governs the encryption/decryption logic and transaction handling. Leveraging React, SCSS, and TypeScript, our HealthChain frontend seamlessly communicates with a Flask backend framework. This backend framework manages the intricate public/private key encryption and decryption processes. We have diligently curated and preprocessed synthetic EHR data in FHIR format to ensure the reliability of our platform.

The project was made possible thanks to the Gear platform. Powered by Rust, Gear enabled our team to build a safe, production quality smart contract within the limited timespan. Despite most of our members never having worked with Web3 technology prior to the hackathon, Gear's intuitive architecture combined with the beginner friendly Web3 content on EasyA meant all of us were well prepared to advance Web3 within a few hours.

Furthermore, the gtest library made unit testing a breeze, helping our team practice test driven development, as we were able to individually test all possible actions on the smart contract locally.

**Upload and Encryption:** Users can upload their EHR data in the form of a JSON object. The app performs local encryption on the data before it leaves the user's computer. This encryption step ensures that only authorized parties can access and decipher the sensitive health information.

**Secure Data Vault:** The encrypted EHR data is securely transmitted to our dedicated data vault. The vault is designed to store and protect the data with robust security measures, including encryption at rest and access controls.

**Metadata Extraction:** Once the EHR data is securely stored, the app extracts high-level diagnoses and relevant metadata from the records. This metadata serves as a summary of the patient's health conditions and medical history.

**HealthChain Integration:** The extracted metadata is then added to the HealthChain, a blockchain-based patient database. The HealthChain provides a decentralized and immutable ledger for storing health-related metadata securely. Researchers can utilize this database to query patients based on specific criteria, such as "diabetes and heart failure, not cancer," to identify eligible individuals for their studies.

The HealthChain app aims to empower individuals by giving them control over their health data while facilitating research by providing researchers with a privacy-preserving platform for patient data discovery. 

## Installation
The repo contains two projects, each with their own installation process
### decentra-app
To get started, make sure you have [Node.js](https://nodejs.org) installed on your computer. The app is built using React, so you'll need npm (Node Package Manager) as well. 

1. Clone this repository to your local machine.\

2. Open a terminal or command prompt and navigate to the project's `decentra-app` directory.

3. Run the following command to install the necessary dependencies:

`npm install`

### HealthChainClient
Make sure you have python installed on your computer.

1. Clone this repository to your local machine.

2. Open a terminal or command prompt and navigate to the project's `HealthChainCLient` directory.

3. Run the following command to install the necessary dependencies:

`pip install -r requirements.txt`

## Running the App

Once you have completed the installation steps, you can now run the app locally.

1. In the terminal or command prompt, navigate to `decentra-app` root directory

2. Use the following command to start front-end server:

`npm start`

3. After running the command, the app should open automatically in your default web browser. If it doesn't, you can access it by visiting [http://localhost:3000](http://localhost:3000) in your browser.

4. Change directories to `HealthChainClient`

5. Use the following command to start the back-end server:

`python app.py`

6. Start Gear Node with the command `./gear`. The setup instructions are [here](https://wiki.gear-tech.io/docs/node/setting-up)

## Building for Production

To build the app for production, you can use the following command:

`npm run build`

This command will create an optimized production-ready build of the app in the `build` directory. You can then deploy this build to a web server or hosting platform of your choice.

## Additional Scripts

In addition to the `npm start` and `npm run build` scripts, there are a few more useful commands available:

- `npm test`: Launches the test runner in the interactive watch mode, allowing you to run and monitor tests.
- `npm run eject`: Removes the single build dependency and configuration, giving you full control over the configuration files and build tools. Use this command with caution, as it's a one-way operation.

## Contributing

If you would like to contribute to this project, please follow the guidelines outlined in [CONTRIBUTING.md](CONTRIBUTING.md). We appreciate any feedback, bug reports, or pull requests.

## License

This project is licensed under the [MIT License](LICENSE). Feel free to modify and distribute it as per the terms of the license.

## Acknowledgments

We would like to express our gratitude to the open-source community and the creators of the tools and libraries used in this project.

If you have any questions or need further assistance, please don't hesitate to reach out. Happy coding!
