import React, { useEffect, useState } from 'react';
import { Card, Col, Button } from 'react-bootstrap';

function Service(props) {

    const [tasks, setTasks] = useState([]);
    const [logData, setLogData] = useState('');
    const [showLogs, setShowLogs] = useState(false);

    useEffect(() => {
        let logReader = null;
        const getTasks = async () => {
            var result = await fetch(`http://localhost:3001/services/${props.service.Spec.Name}/tasks`);
            var resultJson = await result.json();
            setTasks(resultJson);
        };
        const getLogs = async() => {
            var result = await fetch(`http://localhost:3001/services/${props.service.Spec.Name}/logs`);
            logReader = await result.body.getReader();
            logReader.read().then(
                function process({done, value}) {
                    if (done) return;
                    // Append to top
                    setLogData(d => new TextDecoder("utf-8").decode(value) + d);
                    return logReader.read().then(process); 
                }
            )
        }
        getTasks();
        if (showLogs) {
            getLogs();
        }
        else {
            closeLogReader(logReader);
        }

        // clean up
        return (() => { 
            closeLogReader(logReader);
        });
    }, [props.service, showLogs]);

    var logReaderOpen = (logReader) => {
        return logReader !== null && logReader.closed;
    }

    var closeLogReader = (logReader) => {
        if (logReaderOpen(logReader)) logReader.cancel();
    }

    var logBlock = () => {
        if (showLogs) {
            return (
                <pre>
                    <code style={{fontSize: '10px', whiteSpace: 'pre'}}>
                        {logData}
                    </code>
                </pre>
            );
        }
        else {
            return <React.Fragment />;
        }
    }

    var handleLogClick = () => {
        setShowLogs(!showLogs);
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
                        <Button onClick={handleLogClick}>LOGS</Button>
                        <br />
                    </React.Fragment>
                    {logBlock()}
                </Card.Body>
            </Card>
        </Col>
    )

}

export default Service;