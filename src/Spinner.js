import React from 'react';
import GridLoader from "react-spinners/GridLoader";
import { Container, Row } from 'react-bootstrap';

function Spinner() {
    return (
        <Container style={{marginBottom: '10px'}}>
            <Row className="justify-content-md-center">
                <GridLoader></GridLoader>
            </Row>
        </Container>
    )
}

export default Spinner;