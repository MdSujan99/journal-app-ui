import React, { useState } from "react";
import api from "../api/axiosConfig";
import { Form, Button } from "react-bootstrap";
import axios from "axios";

const FormCreateNewJournal = ({ onJournalCreated }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleCreateJournal = async () => {
    try {
      const response = await api.post("/journal", {
        title: title,
        description: description,
      });

      // Call the callback function with the new journal data
      onJournalCreated(true);

      // Reset the form fields after successful creation
      setTitle("");
      setDescription("");
    } catch (error) {
      // Handle errors
      console.error("Error creating journal:", error);
    }
  };

  return (
    <Form>
      <Form.Group controlId="formTitle">
        <Form.Label>Title</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter title"
          value={title}
          onChange={handleTitleChange}
        />
      </Form.Group>

      <Form.Group controlId="formDescription">
        <Form.Label>Description</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          placeholder="Enter description"
          value={description}
          onChange={handleDescriptionChange}
        />
      </Form.Group>

      <Button
      className="mt-3"
       variant="primary" onClick={handleCreateJournal}>
        Create Journal
      </Button>
    </Form>
  );
};

export default FormCreateNewJournal;
