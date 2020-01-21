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

    var handleLogClick = () => {
        setShowLogs(!showLogs);
    }

    var handleStatClick = () => {
        setShowStats(!showStats);
    }

    return (
        <Col key={props.service.ID} xs={12 / props.columns}>
            <Card className="text-dark">
                <Card.Header>
                    {JSON.stringify(props.service.Spec.Name).replace(/"/g, '')}
                </Card.Header>
                <Card.Body style={{maxHeight: '300px', overflowY: 'auto'}}>
                    <React.Fragment>
                        REPLICAS <br />{tasks.length} / {JSON.stringify(props.service.Spec.Mode.Replicated.Replicas)}
                        <br /><br />
                        <Button style={{marginRight: '10px'}} onClick={handleStatClick}>STATS</Button>
                        <Button onClick={handleLogClick}>LOGS</Button>
                        <br />
                    </React.Fragment>
                    <ServiceStats showStats={showStats} tasks={tasks}/>
                    <ServiceLogs showLogs={showLogs} service={props.service}/>
                </Card.Body>
            </Card>
        </Col>
    )

}

export default Service;