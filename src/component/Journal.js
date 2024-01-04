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
    <Card.Body style={{ height: "20rem", width: "10rem" }}>
      <Card.Subtitle>{createdAt}</Card.Subtitle>
      <Card.Title as={"h2"}>{title}</Card.Title>
      <Card.Text>{description}</Card.Text>
    </Card.Body>
    <Card.Footer>
      <Card.Text>Updated At: {updatedAt}</Card.Text>
    </Card.Footer>
  </Card>
);

export default Journal;
