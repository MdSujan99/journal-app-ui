import React from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import api from "../api/axiosConfig";

const Journal = ({
  title,
  description,
  createdAt,
  updatedAt,
  id,
  journalEntryMap,
  onDelete,
}) => {
  const handleDeleteClick = async () => {
    try {
      // Assuming you have a unique identifier for the journal, replace 'journalId' with the actual identifier
      // Make a delete API call
      await api.delete(`/journal/${id}`);

      // If the delete is successful, call the onDelete callback with true
      onDelete(true);
    } catch (error) {
      // If there's an error during delete, you can handle it here
      console.error("Error deleting journal:", error);

      // Call the onDelete callback with false to indicate failure
      onDelete(false);
    }
  };

  return (
    <Card className="mt-2">
      <Card.Body style={{ height: "16rem", width: "10rem" }}>
        <Card.Subtitle>{createdAt}</Card.Subtitle>
        <Card.Title as={"h2"}>{title}</Card.Title>
        <Card.Text>{description}</Card.Text>
      </Card.Body>
      <Card.Footer>
        <Card.Text>Updated At: {updatedAt}</Card.Text>
        <Button variant="danger" onClick={handleDeleteClick}>
          Delete
        </Button>
      </Card.Footer>
    </Card>
  );
};

export default Journal;
