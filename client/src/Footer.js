import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const Footer = () => {
  return (
    <footer className="bg-dark text-light mt-auto">
      {" "}
      {/* Added 'mt-auto' for margin-top: auto */}
      <Container fluid>
        <Row className="justify-content-center">
          <Col xs={12} className="text-center">
            <p>&copy; 2024 Your Company Name. All rights reserved.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
