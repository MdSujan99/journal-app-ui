import React from "react";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";

const Journal = ({
  title,
  description,
  createdAt,
  updatedAt,
  journalEntryMap,
}) => (
  <Card className="journal-container">
    <Card.Body>
      <Card.Title>{title}</Card.Title>
      <Card.Text>Description: {description}</Card.Text>
      <Card.Text>Created At: {createdAt}</Card.Text>
      <Card.Text>Updated At: {updatedAt}</Card.Text>

      {journalEntryMap && (
        <div>
          <Card.Title>Journal Entries</Card.Title>
          <ListGroup>
            {Object.entries(journalEntryMap).map(([entryKey, entry]) => (
              <ListGroup.Item key={entryKey}>
                <Card.Text>Entry Date: {entryKey}</Card.Text>
                <Card.Text>Text Content: {entry.textContent}</Card.Text>
                <Card.Text>Date Created: {entry.dateCreated}</Card.Text>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </div>
      )}
    </Card.Body>
  </Card>
);

export default Journal;
