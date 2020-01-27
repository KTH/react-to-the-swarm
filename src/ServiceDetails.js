import React from 'react';
import { Button, Alert } from 'react-bootstrap';

function ServiceDetails(props) {

    let alertVariant = 
        props.tasks.length.toString() === JSON.stringify(props.service.Spec.Mode.Replicated.Replicas) ?
        "success" : "danger";

    return (
        <div style={{marginBottom: '10px'}}>
        <div style={{fontSize: '16px', fontWeight: 'bold'}}>
            Image
        </div>
        <div style={{fontSize: '16px'}}>
            {props.service.Spec.TaskTemplate.ContainerSpec.Image.replace(/@.+/g, '')}
        </div>
        <div style={{fontSize: '16px', fontWeight: 'bold'}}>
            Replicas
        </div>
        <div style={{marginBottom: '10px', fontSize: '16px'}}>
            <Alert variant={alertVariant}>
                {props.tasks.length} / {JSON.stringify(props.service.Spec.Mode.Replicated.Replicas)}
            </Alert>
        </div>
        <Button style={{marginRight: '10px'}} onClick={props.handleStatClick}>Stats</Button>
        <Button onClick={props.handleLogClick}>Logs</Button>
        </div>
    )
}

export default ServiceDetails;