import React, { useEffect, useState } from 'react';
import { Card, Col } from 'react-bootstrap';

function Service(props) {

    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        const getTasks = async () => {
            var result = await fetch(`http://localhost:3001/services/${props.service.Spec.Name}/tasks`);
            var resultJson = await result.json();
            setTasks(resultJson);
        };
        getTasks();
    }, [props.service]);

    return (
        <Col key={props.service.ID} xs={12 / props.columns}>
            <Card className="text-dark">
                <Card.Header>
                    {JSON.stringify(props.service.Spec.Name).replace(/"/g, '')}
                </Card.Header>
                <Card.Body>
                    Target replicas: {JSON.stringify(props.service.Spec.Mode.Replicated.Replicas)} <br />
                    Tasks: {tasks.length}
                </Card.Body>
            </Card>
        </Col>
    )

}

export default Service;