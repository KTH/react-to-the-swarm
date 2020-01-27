import React from 'react';
import { Button, Alert } from 'react-bootstrap';

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
                Running replicas
            </div>
            <div className="service-details">
                <Alert variant={alertRunningVariant}>
                    {runningTasks.length} / {JSON.stringify(getReplicas())}
                </Alert>
            </div>
            <div className="service-subheader">
                <Alert variant={alertFailedVariant}>
                    Failed replicas: {failedTasks.length}
                </Alert>
            </div>
            <div className="service-subheader  service-bottom-spacing">
                Shut down replicas: {shutdownTasks.length}
            </div>
            <Button className="service-right-spacing" onClick={props.handleStatClick}>Stats</Button>
            <Button onClick={props.handleLogClick}>Logs</Button>
        </div>
    )
}

export default ServiceDetails;