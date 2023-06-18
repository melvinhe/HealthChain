import { useState, ChangeEvent } from "react";

function Home(): JSX.Element {
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
    <div>
      <h1 style={{ color: "black" }}>Welcome to HealthChain</h1>
      <p style={{ color: "black" }}>This is the home page of HealthChain.</p>
      <div
        style={{
          border: "2px dashed black",
          borderRadius: "10px",
          padding: "20px",
          marginTop: "20px",
          backgroundColor: "#f2f2f2",
        }}
      >
        <p>Drag and drop a JSON file here or click to browse:</p>
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
        {isInvalidJSON && <p style={{ color: "red" }}>Invalid JSON file</p>}
        {jsonData && (
          <div>
            <h2>Uploaded JSON Data:</h2>
            <pre>{JSON.stringify(jsonData, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
}

export { Home };
