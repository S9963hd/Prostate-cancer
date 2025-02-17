import React, { useContext, useRef, useState, useEffect } from "react";
import axios from "axios";
import "./fileUpload.css";
import { ImageContext } from "./App";

function FileUpload() {
  const { file, setFile } = useContext(ImageContext);
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState("");
  const [image, setImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [classifier, setClassifier] = useState(null);
  const [classificationResults, setClassificationResults] = useState([]);

  useEffect(() => {
    const loadClassifier = async () => {
      if (window.ml5) {
        const modelURL = "https://teachablemachine.withgoogle.com/models/SMOlZXAmS/";
        const model = await window.ml5.imageClassifier(modelURL + "model.json");
        setClassifier(model);
      } else {
        console.error("ml5.js not loaded");
      }
    };
    loadClassifier();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setFileName(file.name);
      setFile(file);
      setImage(URL.createObjectURL(file));
      setProcessedImage(null);
      setClassificationResults([]);
    } else {
      alert("Please upload a valid image file.");
    }
  };

  const openFileDialog = () => {
    fileInputRef.current.click();
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setFileName(file.name);
      setFile(file);
      setImage(URL.createObjectURL(file));
      setProcessedImage(null);
      setClassificationResults([]);
    } else {
      alert("Please upload a valid image file.");
    }
  };

  const processImage = async () => {
    if (!file) {
      alert("Please upload an image first.");
      return;
    }

    setProcessing(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://localhost:5000/process", formData, {
        responseType: "blob",
      });

      setProcessedImage(URL.createObjectURL(response.data));
    } catch (error) {
      console.error("Error processing image:", error);
      alert("Failed to process image.");
    } finally {
      setProcessing(false);
    }
  };

  const classifyImage = async () => {
    if (!file || !classifier) {
      alert("Please upload an image and wait for the model to load.");
      return;
    }

    const imageElement = document.createElement("img");
    imageElement.src = URL.createObjectURL(file);
    imageElement.onload = async () => {
      try {
        const results = await classifier.classify(imageElement);
        setClassificationResults(results);
      } catch (err) {
        console.error("Classification error:", err);
        alert("Error during classification.");
      }
    };
  };

  const getConfidenceColor = (confidence) => {
    const percentage = confidence * 100;
    if (percentage > 80) return "#4CAF50"; // Green for high confidence
    if (percentage > 50) return "#FFC107"; // Yellow for medium confidence
    return "#F44336"; // Red for low confidence
  };

  return (
    <div className="modal">
      <div className="modal-header">
        <div className="modal-logo">
          <span className="logo-circle">📁</span>
        </div>
        <button className="btn-close">✖</button>
      </div>
      <div className="modal-body">
        <h2 className="modal-title">Upload a File</h2>
        <p className="modal-description">Attach the file below</p>

        {/* Display uploaded image */}
        {image ? <img src={image} alt="Uploaded Preview" /> : <h4>Load Image</h4>}

        {/* Display processed image */}
        {processedImage && <img src={processedImage} alt="Processed Preview" />}

        <div className="upload-area" onClick={openFileDialog} onDragOver={handleDragOver} onDrop={handleDrop}>
          <span className="upload-area-title">Drag file(s) here to upload.</span>
          <span className="upload-area-description">
            Alternatively, select a file by <strong>clicking here</strong>.
          </span>
        </div>

        <input ref={fileInputRef} type="file" style={{ display: "none" }} onChange={handleFileChange} accept="image/*" />
        {fileName && <p>Selected file: {fileName}</p>}
      </div>

      {/* Classification Table */}
      {classificationResults.length > 0 && (
        <div className="classification-table">
          <h3>Classification Results</h3>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Label</th>
                <th>Probability</th>
              </tr>
            </thead>
            <tbody>
              {classificationResults.map((result, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{result.label}</td>
                  <td style={{ backgroundColor: getConfidenceColor(result.confidence), color: "#fff" }}>
                    {(result.confidence * 100).toFixed(2)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="modal-footer" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button
          className="btn-secondary"
          type="reset"
          onClick={() => {
            setFileName("");
            setFile(null);
            setImage(null);
            setProcessedImage(null);
            setClassificationResults([]);
          }}
        >
          Clear
        </button>
        <button className="btn-secondary" onClick={() => alert("Cancelled")}>
          Cancel
        </button>
        <button className="btn-primary" onClick={openFileDialog}>
          Upload File
        </button>
        <button className="btn-primary" onClick={processImage} disabled={!file || processing}>
          {processing ? "Processing..." : "Process Image"}
        </button>
        <button className="btn-primary" onClick={classifyImage} disabled={!file}>
          Classify Image
        </button>
      </div>
    </div>
  );
}

export default FileUpload;
