import React from 'react';
import { Button, Alert } from 'react-bootstrap';

function ServiceDetails(props) {

    let alertVariant = 
        props.tasks.length.toString() === JSON.stringify(props.service.Spec.Mode.Replicated.Replicas) ?
        "success" : "danger";

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
            <div className="service-details service-bottom-spacing">
                <Alert variant={alertVariant}>
                    {props.tasks.length} / {JSON.stringify(props.service.Spec.Mode.Replicated.Replicas)}
                </Alert>
            </div>
            <Button className="service-right-spacing" onClick={props.handleStatClick}>Stats</Button>
            <Button onClick={props.handleLogClick}>Logs</Button>
        </div>
    )
}

export default ServiceDetails;