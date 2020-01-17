import React, { useEffect, useState } from 'react';
import { Card, Col } from 'react-bootstrap';

function Service(props) {

    const [tasks, setTasks] = useState([]);
    const [logData, setLogData] = useState('');

    useEffect(() => {
        const getTasks = async () => {
            var result = await fetch(`http://localhost:3001/services/${props.service.Spec.Name}/tasks`);
            var resultJson = await result.json();
            setTasks(resultJson);
        };
        const getLogs = async() => {
            var result = await fetch(`http://localhost:3001/services/${props.service.Spec.Name}/logs`);
            var logReader = await result.body.getReader();
            logReader.read().then(
                function process({_, value}) {
                    setLogData(d => d + new TextDecoder("utf-8").decode(value));
                    return logReader.read().then(process); 
                }
            )
        }
        getTasks();
        getLogs();
    }, [props.service]);

    return (
        <Col key={props.service.ID} xs={12 / props.columns}>
            <Card className="text-dark">
                <Card.Header>
                    {JSON.stringify(props.service.Spec.Name).replace(/"/g, '')}
                </Card.Header>
                <Card.Body style={{maxHeight: '300px', overflowY: 'auto'}}>
                    <React.Fragment>
                        REPLICAS: {tasks.length} / {JSON.stringify(props.service.Spec.Mode.Replicated.Replicas)} <br />
                        LOGS: <br />
                    </React.Fragment>
                    <code style={{fontSize: '10px', whiteSpace: 'pre'}}>
                        {logData}
                    </code>
                </Card.Body>
            </Card>
        </Col>
    )

}

export default Service;