import React from 'react';
import { Button, Alert, Container, Col, Row } from 'react-bootstrap';

function ServiceDetails(props) {

    const getReplicas = () => {
        return props.service.Spec.Mode.Replicated.Replicas;
    }

    let shutdownTasks = props.tasks.filter(t => t.Status.State === 'shutdown');
    let runningTasks = props.tasks.filter(t => t.Status.State === 'running');
    let failedTasks = props.tasks.filter(t => t.Status.State === 'failed');

    let alertRunningVariant = 
        runningTasks.length.toString() === JSON.stringify(getReplicas()) ?
        "success" : "danger";

    let alertFailedVariant = failedTasks.length > 0 ? "danger" : "success";

    return (
        <div className="service-bottom-spacing">
            <div className="service-subheader">
                Image
            </div>
            <div className="service-details">
                {props.service.Spec.TaskTemplate.ContainerSpec.Image.replace(/@.+/g, '')}
            </div>
            <div className="service-subheader">
                Replicas
            </div>
            <Container>
                <div className="service-details">
                        <Row>
                            <Col className="detail-property">Running</Col>
                            <Col>
                                <Alert variant={alertRunningVariant}>
                                    {runningTasks.length} / {JSON.stringify(getReplicas())}
                                </Alert>
                            </Col>
                        </Row>
                </div>
                <div className="service-details">
                    <Row>
                        <Col className="detail-property">Failed</Col>
                        <Col>
                            <Alert variant={alertFailedVariant}>
                                {failedTasks.length}
                            </Alert>
                        </Col>
                    </Row>
                </div>
                <div className="service-details service-bottom-spacing">
                    <Row>   
                        <Col style={{textAlign: 'right'}}>Shut down</Col>
                        <Col>
                            {shutdownTasks.length}
                        </Col>
                    </Row>
                </div>
            </Container>
            <Button className="service-right-spacing" onClick={props.handleStatClick}>Stats</Button>
            <Button onClick={props.handleLogClick}>Logs</Button>
        </div>
    )
}

export default ServiceDetails;