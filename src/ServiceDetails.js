import React from 'react';
import { Button, Alert } from 'react-bootstrap';

function ServiceDetails(props) {

    const filterRunning = (task) => {
        return task.Status.State === 'running';
    }

    const filterShutdown = (task) => {
        return task.Status.State === 'shutdown';
    }

    const filterFailed = (task) => {
        return task.Status.State === 'failed';
    }

    let shutdownTasks = props.tasks.filter(filterShutdown);
    let runningTasks = props.tasks.filter(filterRunning);
    let failedTasks = props.tasks.filter(filterFailed);

    let alertRunningVariant = 
        runningTasks.length.toString() === JSON.stringify(props.service.Spec.Mode.Replicated.Replicas) ?
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
                    {runningTasks.length} / {JSON.stringify(props.service.Spec.Mode.Replicated.Replicas)}
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