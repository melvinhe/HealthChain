# HealthChain

Welcome to the React app repository! This README file will guide you through the installation, setup, and functionality of the app.

## About 

The HealthChain app provides a secure platform for users to upload their electronic health record (EHR) data. By leveraging blockchain technology, the app ensures the privacy and integrity of the data throughout the process. Here's how it works:

**Upload and Encryption:** Users can upload their EHR data in the form of a JSON object. The app performs local encryption on the data before it leaves the user's computer. This encryption step ensures that only authorized parties can access and decipher the sensitive health information.

**Secure Data Vault:** The encrypted EHR data is securely transmitted to our dedicated data vault. The vault is designed to store and protect the data with robust security measures, including encryption at rest and access controls.

**Metadata Extraction:** Once the EHR data is securely stored, the app extracts high-level diagnoses and relevant metadata from the records. This metadata serves as a summary of the patient's health conditions and medical history.

**HealthChain Integration:** The extracted metadata is then added to the HealthChain, a blockchain-based patient database. The HealthChain provides a decentralized and immutable ledger for storing health-related metadata securely. Researchers can utilize this database to query patients based on specific criteria, such as "diabetes and heart failure, not cancer," to identify eligible individuals for their studies.

The HealthChain app aims to empower individuals by giving them control over their health data while facilitating research by providing researchers with a privacy-preserving platform for patient data discovery. 

## Installation

To get started, make sure you have [Node.js](https://nodejs.org) installed on your computer. The app is built using React, so you'll need npm (Node Package Manager) as well. 

1. Clone this repository to your local machine.

2. Open a terminal or command prompt and navigate to the project's `decentra-app` directory.

3. Run the following command to install the necessary dependencies:

`npm install`

## Running the App

Once you have completed the installation steps, you can now run the React app locally.

1. In the terminal or command prompt, navigate to the project's root directory if you haven't done so already.

2. Use the following command to start the development server:

`npm start`

3. After running the command, the app should open automatically in your default web browser. If it doesn't, you can access it by visiting [http://localhost:3000](http://localhost:3000) in your browser.

4. You should now see the app running and be able to interact with it.

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
