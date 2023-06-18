import { useState, ChangeEvent, useEffect } from "react";
import { GearApi, IMessageSendOptions, getProgramMetadata } from '@gear-js/api';
import { u128 } from "@polkadot/types";

export function Home(): JSX.Element {
  type SignedJson = {
    id: number,
    json_string: string,
    address: string
  }

  type Requests = {
    id: number,
    company: string,
    walletAddress: string,
    value: u128
  }
  const [requests, setRequests] = useState<Requests[]>([]);
  const [signedPatients, setSignedPatients] = useState<SignedJson[]>([]);
  const [jsonData, setJsonData] = useState<object[]>([{}]);
  const [isInvalidJSON, setIsInvalidJSON] = useState<boolean>(false);
  const [gearApi, setGearApi] = useState<GearApi | null>(null);

  useEffect(() => {
    GearApi.create().then(setGearApi);
  }, [])

  const handleAccept = (id: number) => {
    // Handle accept action for the request with the given ID
    setRequests(requests.filter((item) => item.id !== id))
    const message: IMessageSendOptions = {
      destination: "0xbb26ebb3ff72ebd67c01b3086e9cd197dd52eb2c718318ca292682497f6fb9c4",
      payload: { "Sell": { } },
      value: requests[0].value,
      gasLimit: 100_000_000_000
    }

    const metadataHex = "00000100000000010a0000000000000000010d000000b5154c000c186170705f696f2c6275795f7265717565737418416374696f6e000110184372656174650400040130437265617465436f6e6669670000001053656c6c0001001843616e63656c0002001852657761726400030000040c186170705f696f2c6275795f7265717565737430437265617465436f6e666967000010011873656c6c657208011c4163746f724964000120746f6b656e5f6964140110553235360001147072696365200110753132380001206475726174696f6e2401204475726174696f6e00000810106773746418636f6d6d6f6e287072696d6974697665731c4163746f724964000004000c01205b75383b2033325d00000c00000320000000100010000005030014083c7072696d69746976655f74797065731055323536000004001801205b7536343b20345d000018000003040000001c001c0000050600200000050700240c186170705f696f2c6275795f72657175657374204475726174696f6e00000c0114686f7572731c010c75363400011c6d696e757465731c010c75363400011c7365636f6e64731c010c7536340000280418526573756c74080454012c044501300108084f6b04002c000000000c45727204003000000100002c0c186170705f696f2c6275795f72657175657374144576656e740001104442757952657175657374437265617465640c0114627579657208011c4163746f72496400011873656c6c657208011c4163746f72496400011470726963652001107531323800000018426f75676874040114707269636520011075313238000100205265776172646564040114707269636520011075313238000200285465726d696e61746564080114627579657208011c4163746f72496400011873656c6c657208011c4163746f72496400030000300c186170705f696f2c6275795f72657175657374144572726f720001346450726576696f757354784d7573744265436f6d706c657465640000003053656e64696e674572726f720001002c4e6f7452657761726465640002002857726f6e675265706c790003004052657761726453656e644661696c656400040038416c726561647952756e6e696e6700050038416c726561647953746f7070656400060044496e73756666696369656e744d6f6e65790007001c457870697265640008002857726f6e67537461746500090044496e636f72726563745265776172646572000a00385472616e736665724661696c6564000b00204e6f744275796572000c0000340c186170705f696f2c6275795f726571756573743842757952657175657374496e666f0000240120746f6b656e5f69641401105532353600011873656c6c657208011c4163746f724964000114627579657208011c4163746f72496400011470726963652001107531323800012474696d655f6c6566741c010c753634000128657870697265735f61741c010c7536340001187374617475733801185374617475730001307472616e73616374696f6e733c019842547265654d61703c4163746f7249642c205472616e73616374696f6e3c416374696f6e3e3e00012c63757272656e745f7469641c010c7536340000380c186170705f696f2c6275795f7265717565737418537461747573000114104e6f6e65000000184163746976650001002450757263686173656404011470726963652001107531323800020020526577617264656404011470726963652001107531323800030020496e616374697665000400003c042042547265654d617008044b01080456014000040044000000400c186170705f696f2c6275795f726571756573742c5472616e73616374696f6e04045401000008010869641c01345472616e73616374696f6e4964000118616374696f6e0001045400004400000248004800000408084000";
    const metadata = getProgramMetadata(`0x${metadataHex}`);
    gearApi?.message.send(message, metadata)
    console.log(`Accepted request with ID: ${id}`);
  };

  async function handlePostRequest(url_: string, json_ob: object, ): Promise<string> {
    try {
      const url = url_;
      const requestData = json_ob

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log("POST request successful:", responseData);
        return responseData
        // Do something with the response data
      } else {
        console.log("POST request failed:", response.status);
        return "";
        // Handle the error case
      }
    } catch (error) {
      console.log("Error:", error);
      return ""
      // Handle any errors during the request
    }
  };


  const handleReject = (id: number) => {
    // Handle reject action for the request with the given ID
    setRequests(requests.filter((item) => item.id !== id))
    console.log(`Rejected request with ID: ${id}`);
  };

  const handleAcceptData = (hash_json: string) => {
    signedPatients.push({ id: 0, json_string: hash_json, address: "0x5EARpNkdPyj1myCfwXyqtF6PtDXexKYWgJxE38G9Kor4sHrd" } as SignedJson)
    setJsonData(jsonData.filter((item) => JSON.stringify(item) !== hash_json));
    console.log(`Accepted request with JSON: ${hash_json}`);
  }

  const buyInfo = (id: number) => {
    requests.push({ id: 1, company: "United Health", walletAddress: "0x5EARpNkdPyj1myCfwXyqtF6PtDXexKYWgJxE38G9Kor4sHrd" } as Requests)
    requests.push({ id: 2, company: "Sam Bankman-Fried", walletAddress: "0xsAM3ankmm4n5r13d" } as Requests)
    setSignedPatients(signedPatients.filter((item) => item.id !== id))
  }

  const rejectInfo = (id: number) => {
    setSignedPatients(signedPatients.filter((item) => item.id !== id))
  }

  const handleRejectData = (hash_json: string) => {
    setJsonData(jsonData.filter((item) => JSON.stringify(item) !== hash_json));
    console.log(`Rejected request with JSON: ${hash_json}`);
  }


  const postData = async (url_endpoint: string, data: string) => {
    try {
      const response = await fetch(url_endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        console.log("POST request successful!");
        // Handle successful response
      } else {
        console.log("POST request failed!");
        // Handle error response
      }
    } catch (error) {
      console.error("Error:", error);
      // Handle network error
    }
  };

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const json = JSON.parse(e.target?.result as string);
          setJsonData([json]);
          setIsInvalidJSON(false);
        } catch (error) {
          setIsInvalidJSON(true);
        }
      };

      reader.readAsText(file);
    }
    postData("http://localhost:3000", JSON.stringify(jsonData));
  };

  const [showPatient, setShowPatient] = useState(false);
  const [showHome, setShowHome] = useState(true);
  const [showBuyer, setShowBuyer] = useState(false);
  const [showHospital, setShowHospital] = useState(false);
  const [showValidJsons, setShowValidJsons] = useState(false)

  const hideComponent = (componentName: string): void => {
    switch (componentName) {
      case "patient":
        setShowPatient(false);
        break;
      case "home":
        setShowHome(false);
        break;
      case "buyer":
        setShowBuyer(false);
        break;
      case "hospital":
        setShowHospital(false);
        break;
      default:
    }
  };

  const showComponent = (componentName: string): void => {
    switch (componentName) {
      case "patient":
        setShowPatient(true);
        hideComponent("home");
        hideComponent("buyer");
        hideComponent("hospital");
        break;
      case "home":
        setShowHome(true);
        hideComponent("buyer");
        hideComponent("hospital");
        hideComponent("patient");
        break;
      case "buyer":
        setShowBuyer(true);
        hideComponent("patient");
        hideComponent("home");
        hideComponent("hospital");
        break;
      case "hospital":
        setShowHospital(true);
        hideComponent("buyer");
        hideComponent("home");
        hideComponent("patient");
        break;
      default:
    }
  };

  return (
    <div style={{ display: "flex" }}>
      {/* Sidebar */}
      <div
        style={{
          width: "160px",
          marginRight: "20px",
          padding: "10px",
          borderRadius: "10px",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          marginTop: "40px",
          marginBottom: "0px",
          height: "calc(100vh - 40px)",
        }}
      >
        <ul style={{ margin: 0, padding: 0 }}>
          <li style={{ marginTop: "20px", marginBottom: "40px" }}>
            <button
              type="button"
              onClick={() => showComponent("home")}
              style={{
                color: "black",
                fontSize: "18px",
                border: "none",
                background: "none",
                cursor: "pointer",
                padding: 0,
                textAlign: "left",
                width: "100%",
              }}
            >
              Home
            </button>
          </li>
          <li style={{ marginBottom: "40px" }}>
            <button
              type="button"
              onClick={() => showComponent("patient")}
              style={{
                color: "black",
                fontSize: "18px",
                border: "none",
                background: "none",
                cursor: "pointer",
                padding: 0,
                textAlign: "left",
                width: "100%",
              }}
            >
              Patient Portal
            </button>
          </li>
          <li style={{ marginBottom: "40px" }}>
            <button
              type="button"
              onClick={() => showComponent("buyer")}
              style={{
                color: "black",
                fontSize: "18px",
                border: "none",
                background: "none",
                cursor: "pointer",
                padding: 0,
                textAlign: "left",
                width: "100%",
              }}
            >
              Researcher Portal
            </button>
          </li>
          <li style={{ marginBottom: "40px" }}>
            <button
              type="button"
              onClick={() => showComponent("hospital")}
              style={{
                color: "black",
                fontSize: "18px",
                border: "none",
                background: "none",
                cursor: "pointer",
                padding: 0,
                textAlign: "left",
                width: "100%",
              }}
            >
              Hospital Portal
            </button>
          </li>
        </ul>
      </div>
      {/* Main content */}

      {showPatient && (
        <div style={{ flex: 1, marginLeft: "20px", marginBottom: "20px" }}>
          <h3 style={{ color: "black" }}>
            Put Your Health Data Back in Your Control: Embrace HealthChain,
            Securing Your EHR with Blockchain.
          </h3>
          <div
            style={{
              border: "2px dashed black",
              borderRadius: "10px",
              padding: "20px",
              marginTop: "20px",
              marginBottom: "20px",
              backgroundColor: "#f2f2f2",
            }}
          >
            {/* Drag and drop block */}
            <div style={{ display: "flex" }}>
              <p style={{ marginRight: "10px", color: "black" }}>
                Drag and drop a JSON file here or click to browse:
              </p>
              <label
                htmlFor="file-upload"
                style={{ cursor: "pointer", color: "black" }}
              >
                Choose File
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  style={{ display: "none" }}
                  id="file-upload"
                />
              </label>
            </div>
            {isInvalidJSON && <p style={{ color: "red" }}>Invalid JSON file</p>}
            {jsonData && (
              <div>
                <h2 style={{ color: "black" }}>Uploaded JSON Data:</h2>
                <pre style={{ color: "black" }}>
                  {JSON.stringify(jsonData, null, 2)}
                </pre>
              </div>
            )}
          </div>
          {/* List of company requests */}
          {requests.map((request) => (
            <div
              key={request.id}
              style={{
                display: "flex",
                alignItems: "center",
                border: "1px solid #ccc",
                padding: "10px",
                marginBottom: "10px",
              }}
            >
              <div style={{ flex: "1" }}>
                <h2
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                    color: "black",
                  }}
                >
                  {request.company}
                </h2>
                <p style={{ color: "#666" }}>{request.walletAddress}</p>
              </div>
              <div>
                <button
                  type="button"
                  onClick={() => handleAccept(request.id)}
                  style={{
                    backgroundColor: "green",
                    color: "white",
                    padding: "8px 16px",
                    marginRight: "8px",
                    cursor: "pointer",
                  }}
                >
                  Accept
                </button>
                <button
                  type="button"
                  onClick={() => handleReject(request.id)}
                  style={{
                    backgroundColor: "red",
                    color: "white",
                    padding: "8px 16px",
                    cursor: "pointer",
                  }}
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}


      {showHome && (
        <div
          style={{
            flex: 1,
            textAlign: "center",
            backgroundColor: "#E6F2F8",
            padding: "20px",
          }}
        >
          <h1 style={{ color: "#195FBF" }}>Welcome to HealthChain!</h1>
          <p style={{ color: "#333333" }}>
            HealthChain provides a secure platform for users to upload their
            electronic health record (EHR) data. By leveraging blockchain
            technology, the app ensures the privacy and integrity of the data
            throughout the process. Here&apos;s how it works:
          </p>
          <h3 style={{ color: "#195FBF" }}>Upload and Encryption</h3>
          <p style={{ color: "#333333" }}>
            Users can upload their EHR data in the form of a JSON object. The
            app performs local encryption on the data before it leaves the
            user&apos;s computer. This encryption step ensures that only
            authorized parties can access and decipher the sensitive health
            information.
          </p>
          <h3 style={{ color: "#195FBF" }}>Secure Data Vault</h3>
          <p style={{ color: "#333333" }}>
            The encrypted EHR data is securely transmitted to our dedicated data
            vault. The vault is designed to store and protect the data with
            robust security measures, including encryption at rest and access
            controls.
          </p>
          <h3 style={{ color: "#195FBF" }}>Metadata Extraction</h3>
          <p style={{ color: "#333333" }}>
            Once the EHR data is securely stored, the app extracts high-level
            diagnoses and relevant metadata from the records. This metadata
            serves as a summary of the patient&apos;s health conditions and
            medical history.
          </p>
          <h3 style={{ color: "#195FBF" }}>HealthChain Integration</h3>
          <p style={{ color: "#333333" }}>
            The extracted metadata is then added to the HealthChain, a
            blockchain-based patient database. The HealthChain provides a
            decentralized and immutable ledger for storing health-related
            metadata securely. Researchers can utilize this database to query
            patients based on specific criteria, such as &quot;diabetes and
            heart failure, not cancer,&quot; to identify eligible individuals
            for their studies.
          </p>
          <p style={{ color: "#333333" }}>
            The HealthChain app aims to empower individuals by giving them
            control over their health data while facilitating research by
            providing researchers with a privacy-preserving platform for patient
            data discovery.
          </p>
        </div>
      )}

      {showBuyer && (
        <div style={{
          flex: 1,
          backgroundColor: "#E6F2F8",
          padding: "10px",
        }}>
          <h1 style={{ color: "#195FBF" }}>
            Build a Cohort of Study Participants
          </h1>
          <p style={{ color: "#333333" }}>
            Inclusion criteria: Enter names of conditions that should be present
            in participants&apos; medical histories
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: "5px",
              marginTop: "-10px",
            }}
          >
            <input type="text" />
          </div>
          <p style={{ color: "#333333" }}>
            Exclusion criteria: Enter names of conditions that should preclude
            patients from being included in your cohort present in
            participants&apos; medical histories
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: "5px",
              marginTop: "-10px",
            }}
          >
            <input type="text" />
          </div>
          <p style={{ color: "#333333" }}>
            We found X people on HealthChain that meet your eligibility
            criteria. To submit a request for data, fill out the rest of the
            form. We will review the information you submit, and if approved,
            share it with the patients in the cohort defined above.
          </p>
          <p style={{ color: "#333333" }}>
            Study Title: Enter a brief title that describes what you&apos;re
            doing (e.g., &quot;screening patients for eligibility for a clinical
            trial on a lung cancer drug&quot;, &quot;retrospective comparative
            effectiveness study on diabetes drugs&quot;)
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: "5px",
              marginTop: "-10px",
            }}
          >
            <input type="text" />
          </div>
          <p style={{ color: "#333333" }}>
            Do you require patient contact information? If yes, patients may be
            less inclined to opt into your research study. However, contact
            information may be necessary for following up with patients,
            notifying them about a clinical trial that they&apos;re eligible
            for, or sharing your research findings. If no, you will receive HRs
            with contact information redacted.
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: "5px",
              marginTop: "-10px",
            }}
          >
            <button type="button" style={{ marginRight: "10px" }}>
              Yes
            </button>
            <button type="button">No</button>
          </div>
          <p style={{ color: "#333333" }}>
            Minimum number of participants needed to conduct your study: Not all
            eligible people on HealthChain will consent. Enter the minimum
            cohort size to run your study.
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: "5px",
              marginTop: "-10px",
            }}
          >
            <input type="number" style={{ width: "150px" }} />
          </div>
          <p style={{ color: "#333333" }}>
            Enter the last date by which patients need to decide when you want
            to receive the data: If your minimum cohort size is not met, we will
            notify you on this date. You will still be able to submit another
            request for data.
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: "5px",
              marginTop: "-10px",
            }}
          >
            <input type="date" style={{ width: "150px" }} />
          </div>
          <p style={{ color: "#333333" }}>
            How much will you compensate each patient who opts in? This will
            incentivize people to share their data - especially patients who are
            not particularly ill or have a lot to gain from health
            recommendations.
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: "5px",
              marginTop: "-10px",
            }}
          >
            <input type="number" style={{ width: "150px" }} />
          </div>
          <p style={{ color: "#333333" }}>
            Upload your research protocol: Download this template. We will
            review it and (1) accept it (and send out the request for data to
            patients), (2) request revisions, or (3) reject.
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: "5px",
              marginTop: "-10px",
            }}
          >
            <input type="file" style={{ width: "150px" }} />
          </div>
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <button type="button" onClick={() => setShowValidJsons(true)}>
              Submit
            </button>
          </div>
          {showValidJsons && signedPatients.map((patient) => (
            <div
              key={patient.id}
              style={{
                display: "flex",
                alignItems: "center",
                border: "1px solid #ccc",
                padding: "10px",
                marginBottom: "10px",
              }}
            >
              <div style={{ flex: "1" }}>
                <h2
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                    color: "black",
                  }}
                >
                  {patient.address}
                </h2>
                <p style={{ color: "#666" }}>{patient.address}</p>
              </div>
              <div>
                <button
                  type="button"
                  onClick={() => buyInfo(patient.id)}
                  style={{
                    backgroundColor: "green",
                    color: "white",
                    padding: "8px 16px",
                    marginRight: "8px",
                    cursor: "pointer",
                  }}
                >
                  Accept
                </button>
                <button
                  type="button"
                  onClick={() => rejectInfo(patient.id)}
                  style={{
                    backgroundColor: "red",
                    color: "white",
                    padding: "8px 16px",
                    cursor: "pointer",
                  }}
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showHospital && (jsonData.map((single_data) => (
        <div
          key={0}
          style={{
            display: "flex",
            alignItems: "center",
            border: "1px solid #ccc",
            padding: "10px",
            marginBottom: "10px",
          }}
        >
          <div style={{ flex: "1" }}>
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                color: "black",
              }}
            >
              Patient: 0x5EARpNkdPyj1myCfwXyqtF6PtDXexKYWgJxE38G9Kor4sHrd
            </h2>
            <p style={{ color: "#666" }}>
              {JSON.stringify(single_data)}
            </p>

          </div>
          <div>
            <button
              type="button"
              onClick={() => handleAcceptData(JSON.stringify(single_data))}
              style={{
                backgroundColor: "green",
                color: "white",
                padding: "8px 16px",
                marginRight: "8px",
                cursor: "pointer",
              }}
            >
              Sign
            </button>
            <button
              type="button"
              onClick={() => handleRejectData(JSON.stringify(single_data))}
              style={{
                backgroundColor: "red",
                color: "white",
                padding: "8px 16px",
                cursor: "pointer",
              }}
            >
              Reject
            </button>
          </div>
        </div>))

      )}
    </div>
  );
}