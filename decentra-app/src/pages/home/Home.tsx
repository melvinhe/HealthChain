import { useState, ChangeEvent } from "react";
import { Link } from "react-router-dom";

export function Home(): JSX.Element {
  const [jsonData, setJsonData] = useState<object | null>(null);
  const [isInvalidJSON, setIsInvalidJSON] = useState<boolean>(false);

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
  };

  return (
    <div style={{ display: "flex" }}>
      {/* Sidebar */}
      <div
        style={{
          width: "160px",
          backgroundColor: "#f2f2f2",
          marginLeft: "20px",
          marginRight: "20px",
          padding: "10px",
          borderRadius: "10px",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        <ul style={{ margin: 0, padding: 0 }}>
          <li>
            <Link to="/" style={{ color: "black", fontSize: "18px" }}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/other" style={{ color: "black", fontSize: "18px" }}>
              Other Page
            </Link>
          </li>
          <li>
            <Link to="/page1" style={{ color: "black", fontSize: "18px" }}>
              Page 1
            </Link>
          </li>
          <li>
            <Link to="/page2" style={{ color: "black", fontSize: "18px" }}>
              Page 2
            </Link>
          </li>
          <li>
            <Link to="/page3" style={{ color: "black", fontSize: "18px" }}>
              Page 3
            </Link>
          </li>
          <li>
            <Link to="/page4" style={{ color: "black", fontSize: "18px" }}>
              Page 4
            </Link>
          </li>
          {/* Add more sidebar links here */}
        </ul>
      </div>
      {/* Main content */}
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
