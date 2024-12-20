import React, { useContext, useRef, useState, useEffect } from 'react';
import './fileUpload.css';
import { ImageContext } from './App';
function FileUpload() {
  const { file,setFile, setResult } = useContext(ImageContext);
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState('');
  const [classifier, setClassifier] = useState(null);
  const [loading, setLoading] = useState(false);
  const [image,setImage]=useState(null);
  // Initialize the ml5 classifier once
  useEffect(() => {
    const loadClassifier = async () => {
        let modelURL="https://teachablemachine.withgoogle.com/models/SMOlZXAmS/"
      const model = await ml5.imageClassifier(modelURL+"model.json",()=>console.log("Model Loaded"));
      setClassifier(model);
    };
    loadClassifier();
  }, []);
  // Handle file selection (triggered by file input or drop)
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setFileName(file.name);
      setFile(file);
    } else {
      alert('Please upload a valid image file.');
    }
  };

  // Open file dialog
  const openFileDialog = () => {
    fileInputRef.current.click();
  };

  // Handle drag-and-drop functionality
  const handleDragOver = (e) => e.preventDefault();
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setFileName(file.name);
      setFile(file);
    } else {
      alert('Please upload a valid image file.');
    }
  };

  // Classify the uploaded image
  const classify = async () => {
    if (!fileName || !classifier) {
      alert('Please upload an image and wait for the model to load.');
      return;
    }

    setLoading(true);
    const image = document.createElement('img');
    image.src = URL.createObjectURL(fileInputRef.current.files[0]);
    setImage(URL.createObjectURL(fileInputRef.current.files[0]));
    image.onload = async () => {
      try {
        const results = await classifier.classify(image);
        let max=0;
        await results.map(e=> max=Math.max(max,(e.confidence*100)));
        setResult(results);
        alert(`Cancer Probability is :${max}`);
      } catch (err) {
        console.error(err);
        alert('Error during classification.');
      } finally {
        setLoading(false);
      }
    };
  };

  return (
    <div className="modal">
      <div className="modal-header">
        <div className="modal-logo">
          <span className="logo-circle">
            {/* icons-1 */}
                <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="512" height="419.116" viewBox="0 0 512 419.116">
                            <defs>
                                <clipPath id="clip-folder-new">
                                    <rect width="512" height="419.116" />
                                </clipPath>
                            </defs>
                            <g id="folder-new" clipPath="url(#clip-folder-new)">
                                <path id="Union_1" data-name="Union 1" d="M16.991,419.116A16.989,16.989,0,0,1,0,402.125V16.991A16.989,16.989,0,0,1,16.991,0H146.124a17,17,0,0,1,10.342,3.513L227.217,57.77H437.805A16.989,16.989,0,0,1,454.8,74.761v53.244h40.213A16.992,16.992,0,0,1,511.6,148.657L454.966,405.222a17,17,0,0,1-16.6,13.332H410.053v.562ZM63.06,384.573H424.722L473.86,161.988H112.2Z" fill="var(--c-action-primary)" stroke="" strokeWidth="1" />
                            </g>
                </svg>
            </span>
        </div>
        <button className="btn-close">✖</button>
      </div>

      <div className="modal-body">
        <h2 className="modal-title">Upload a File</h2>
        <p className="modal-description">Attach the file below</p>
        {(file!=null)?<img src={URL.createObjectURL(document.getElementById('images').files[0])} />:<h4>Load Image</h4>}
        <div
          className="upload-area"
          onClick={openFileDialog}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          style={{cursor:"pointer"}}
        >
          <span className="upload-area-icon">
            {/* icons 2 */}
                <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="340.531" height="419.116" viewBox="0 0 340.531 419.116">
                                    <g id="files-new" clipPath="url(#clip-files-new)">
                                        <path id="Union_2" data-name="Union 2" d="M-2904.708-8.885A39.292,39.292,0,0,1-2944-48.177V-388.708A39.292,39.292,0,0,1-2904.708-428h209.558a13.1,13.1,0,0,1,9.3,3.8l78.584,78.584a13.1,13.1,0,0,1,3.8,9.3V-48.177a39.292,39.292,0,0,1-39.292,39.292Zm-13.1-379.823V-48.177a13.1,13.1,0,0,0,13.1,13.1h261.947a13.1,13.1,0,0,0,13.1-13.1V-323.221h-52.39a26.2,26.2,0,0,1-26.194-26.195v-52.39h-196.46A13.1,13.1,0,0,0-2917.805-388.708Zm146.5,241.621a14.269,14.269,0,0,1-7.883-12.758v-19.113h-68.841c-7.869,0-7.87-47.619,0-47.619h68.842v-18.8a14.271,14.271,0,0,1,7.882-12.758,14.239,14.239,0,0,1,14.925,1.354l57.019,42.764c.242.185.328.485.555.671a13.9,13.9,0,0,1,2.751,3.292,14.57,14.57,0,0,1,.984,1.454,14.114,14.114,0,0,1,1.411,5.987,14.006,14.006,0,0,1-1.411,5.973,14.653,14.653,0,0,1-.984,1.468,13.9,13.9,0,0,1-2.751,3.293c-.228.2-.313.485-.555.671l-57.019,42.764a14.26,14.26,0,0,1-8.558,2.847A14.326,14.326,0,0,1-2771.3-147.087Z" transform="translate(2944 428)" fill="var(--c-action-primary)" />
                                    </g>
                    </svg>
          </span>
          <span className="upload-area-title">Drag file(s) here to upload.</span>
          <span className="upload-area-description">
            Alternatively, select a file by <strong>clicking here</strong>.
          </span>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          style={{ display: 'none' }}
          onChange={handleFileChange}
          accept="image/*"
          id="images"
        />
        {fileName && <p>Selected file: {fileName}</p>}
      </div>

      <div className="modal-footer" style={{ display: 'flex', justifyContent: 'space-evenly' }}>
        <button className="btn-secondary" type="reset" onClick={() =>{setFileName('');setFile(null)}}>
          Clear
        </button>
        <div>
          <button className="btn-secondary" onClick={() => alert('Cancelled')}>
            Cancel
          </button>
          <button className="btn-primary" onClick={openFileDialog}>
            Upload File
          </button>
          <button className="btn-primary" onClick={classify} disabled={loading}>
            {loading ? 'Processing...' : 'Submit File'}
          </button>
        </div>
      </div>
    </div>
  );
}
export default FileUpload;
