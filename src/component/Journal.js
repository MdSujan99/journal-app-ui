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
  <Card>
    <Card.Body style={{ height: "20rem" }}>
      <Card.Subtitle>{createdAt}</Card.Subtitle>
      <Card.Title as={"h2"}>{title}</Card.Title>
      <Card.Text>{description}</Card.Text>
      {/* <Card.Text>{entries}</Card.Text> */}

      {/* {journalEntryMap && (
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
      )} */}
    </Card.Body>
    <Card.Footer>
      <Card.Text>Updated At: {updatedAt}</Card.Text>
    </Card.Footer>
  </Card>
);

export default Journal;
