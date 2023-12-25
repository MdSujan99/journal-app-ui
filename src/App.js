import "./App.css";
import api from "./api/axiosConfig";
import { useEffect, useState } from "react";
import Journal from "./component/Journal";

function App() {
  const [journals, setJournals] = useState([]);

  const getJournals = async () => {
    try {
      const response = await api.get("/journal");
      setJournals(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getJournals();
  }, []);

  return (
    <div className="App">
      <h1>All Journals</h1>
      {journals.map((journal, index) => (
        <div key={index} className="journal-container">
          <Journal key={index} {...journal} />
        </div>
      ))}
    </div>
  );
}

export default App;
