// HomePage.js

import api from "../../api/axiosConfig";
import { useEffect, useState } from "react";
import Journal from "../Journal";
import { Row, Col, Container } from "react-bootstrap";
import FormCreateNewJournal from "../FormCreateNewJournal";

function HomePage() {
  const [journals, setJournals] = useState([]);

  const getJournals = async () => {
    try {
      const response = await api.get("/journal");
      setJournals(response.data);
    } catch (err) {
      console.log(err);
    }
  };
  const handleJournalDeleted = (success) => {
    // If deletion was successful, fetch all journals again
    if (success) {
      console.log("a journal was deleted - reloading");
      getJournals();
    }
  };
  const handleJournalCreated = (success) => {
    // If creation was successful, fetch all journals again
    if (success) {
      getJournals();
    }
  };

  useEffect(() => {
    getJournals();
  }, []);

  return (
    <Container className="App">
      <Row>
        <h1>All Journals</h1>
        {journals.map((journal, index) => (
          <Col key={index} xs={12} sm={6} md={4} lg={3}>
            <Journal {...journal} onDelete={handleJournalDeleted} />
          </Col>
        ))}
        <FormCreateNewJournal onJournalCreated={handleJournalCreated} />
      </Row>
    </Container>
  );
}

export default HomePage;
