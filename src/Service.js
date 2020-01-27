import React, { useEffect, useState } from 'react';
import { Card, Col, Button } from 'react-bootstrap';
import ServiceLogs from './ServiceLogs.js';
import ServiceStats from './ServiceStats.js';

function Service(props) {

    let [tasks, setTasks] = useState([]);
    let [showLogs, setShowLogs] = useState(false);
    let [showStats, setShowStats] = useState(false);

    useEffect(() => {
        const getTasks = async () => {
            var result = await fetch(`http://localhost:3001/services/${props.service.Spec.Name}/tasks`);
            var resultJson = await result.json();
            setTasks(resultJson);
        };
        getTasks();
    }, [props.service]);

    const handleLogClick = () => {
        setShowLogs(!showLogs);
    }

    const handleStatClick = () => {
        setShowStats(!showStats);
    }

    return (
        <Col key={props.service.ID} xs={12 / props.columns}>
            <Card className="text-dark">
                <Card.Header>
                    {JSON.stringify(props.service.Spec.Name).replace(/"/g, '')}
                </Card.Header>
                <Card.Body style={{maxHeight: '500px', overflowY: 'auto'}}>
                    <div style={{marginBottom: '10px'}}>
                        <div style={{marginBottom: '10px', fontSize: '16px'}}>
                            Replicas <br />{tasks.length} / {JSON.stringify(props.service.Spec.Mode.Replicated.Replicas)}
                        </div>
                        <Button style={{marginRight: '10px'}} onClick={handleStatClick}>Stats</Button>
                        <Button onClick={handleLogClick}>Logs</Button>
                    </div>
                    <ServiceStats showStats={showStats} tasks={tasks}/>
                    <ServiceLogs showLogs={showLogs} service={props.service}/>
                </Card.Body>
            </Card>
        </Col>
    )

}

export default Service;