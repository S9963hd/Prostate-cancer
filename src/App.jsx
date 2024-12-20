import logo from './logo.svg';
import './App.css';
import FileUpload from './fileUpload';
import model from './Model/model.json';
import { createContext, useEffect, useState } from 'react';
import Card from './Card';
import './Table.css';
export const ImageContext = createContext();

function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState([]);

  useEffect(() => {
    if (file) {
      console.log(file);
    } else {
      console.log("Nothing is Uploaded");
    }
  }, [file]);

  return (
    <div className="App">
      <div className="heading">
        <h1>Prostate Cancer Detection &copy;</h1>
        <ImageContext.Provider value={{ file, setFile, setResult }}>
          <FileUpload setFile={setFile} />
        </ImageContext.Provider>
      </div>

      {result.length > 0 ? (
  <div>
  <div className="table-title">
    <h3>Prostate Cancer Detection</h3>
  </div>
  <table className="table-fill">
    <thead>
      <tr>
        <th className="text-left">Label</th>
        <th className="text-left">Confidence</th>
      </tr>
    </thead>
    <tbody className="table-hover">
      {result.map(e => (
        <tr style={{cursor:"pointer",color:(e.confidence*100<50)?"green":(e.confidence*100<70)?"yellow":"red"}}>
          <td className="text-left">{e.label}</td>
          <td className="text-left">{e.confidence*100}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
) : (
  <p>No results yet. Upload a file to start detection!</p>
)}
    </div>
  );
}

export default App;
