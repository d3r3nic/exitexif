import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import './App.css';

function App() {
    return (
        <Container className="mt-5">
            <Row className="justify-content-md-center text-center">
                <Col md="8">
                    <h1 className="header mb-4">Welcome To ExitExif</h1>
                    <p className="lead">
                        Privacy matters. In an age of advanced AI and machine learning, protecting your personal data is more important than ever.
                    </p>
                    <p className="lead">
                        ExitExif helps you protect your privacy by removing potentially sensitive metadata from your images.
                    </p>
                    <Button variant="primary" href="https://github.com/username/exitexif" target="_blank" rel="noopener noreferrer">
                        Learn More
                    </Button>
                </Col>
            </Row>
        </Container>
    );
}

export default App;
