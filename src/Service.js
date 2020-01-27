import React, { useEffect, useState } from 'react';
import { Card, Col } from 'react-bootstrap';
import { useObserver } from 'mobx-react';
import ServiceLogs from './ServiceLogs.js';
import ServiceStats from './ServiceStats.js';
import ServiceDetails from './ServiceDetails.js';
//import ctx from './AppContext.js';

function Service(props) {

    let [tasks, setTasks] = useState([]);
    let [showLogs, setShowLogs] = useState(false);
    let [showStats, setShowStats] = useState(false);
    //const store = React.useContext(ctx);

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

    const serviceStats = () => {
        if (showStats) {
            return (
                <ServiceStats tasks={tasks}/>
            );
        }
    }

    const serviceLogs = () => {
        if (showLogs) {
            return (
                <ServiceLogs service={props.service}/>
            );
        }
    }

    return useObserver(() => (
        <Col key={props.service.ID} xs={12 / props.columns}>
            <Card className="text-dark">
                <Card.Header style={{fontWeight: 'bold'}}>
                    {JSON.stringify(props.service.Spec.Name).replace(/"/g, '')}
                </Card.Header>
                <Card.Body style={{maxHeight: '500px', overflowY: 'auto'}}>
                    <ServiceDetails 
                        tasks={tasks}
                        service={props.service}
                        handleLogClick={handleLogClick}
                        handleStatClick={handleStatClick} />
                    {serviceStats()}
                    {serviceLogs()}
                </Card.Body>
            </Card>
        </Col>
    ));

}

export default Service;