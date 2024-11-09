import React, { useState } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
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
  const [showModal, setShowModal] = useState(false);

  const handleDeleteClick = async () => {
    setShowModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await api.delete(`/journal/${id}`);
      onDelete(true);
      setShowModal(false);
    } catch (error) {
      console.error("Error deleting journal:", error);
      onDelete(false);
      setShowModal(false);
    }
  };

  const handleCancelDelete = () => {
    setShowModal(false);
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

        {/* Confirmation Modal */}
        <Modal show={showModal} onHide={handleCancelDelete}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Deletion</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to delete the journal "{title}"?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCancelDelete}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      </Card.Footer>
    </Card>
  );
};

export default Journal;
