import { useState, ChangeEvent } from "react";
import { Link } from "react-router-dom";

export function Home(): JSX.Element {
  const [jsonData, setJsonData] = useState<object>({});
  const [isInvalidJSON, setIsInvalidJSON] = useState<boolean>(false);

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
          setJsonData(json);
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
          marginLeft: "20px",
          marginRight: "20px",
          padding: "10px",
          borderRadius: "10px",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          marginTop: "40px",
          marginBottom: "0px",
        }}
      >
        <ul style={{ margin: 0, padding: 0 }}>
          <li style={{ marginTop: "20px", marginBottom: "40px" }}>
            <button
              type="button"
              onClick={() => {
                showComponent("home");
              }}
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
              onClick={() => {
                showComponent("patients");
              }}
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
              onClick={() => {
                showComponent("buyer");
              }}
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
              onClick={() => {
                showComponent("Hospital");
              }}
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
          {/* Add more sidebar links here */}
        </ul>
      </div>
      {/* Main content */}
      {showPatient && <div> </div>}
      <div style={{ flex: 1, marginLeft: "20px" }}>
        <h3 style={{ color: "black" }}>
          Put Your Health Data Back in Your Control: Embrace HealthChain, Securing Your EHR with Blockchain.
        </h3>
        <div
          style={{
            border: "2px dashed black",
            borderRadius: "10px",
            padding: "20px",
            marginTop: "20px",
            backgroundColor: "#f2f2f2",
          }}
        >
          <div style={{ display: "flex" }}>
            <p style={{ marginRight: "10px" }}>Drag and drop a JSON file here or click to browse:</p>
            <label htmlFor="file-upload" style={{ cursor: "pointer" }}>
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
              <h2>Uploaded JSON Data:</h2>
              <pre>{JSON.stringify(jsonData, null, 2)}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}