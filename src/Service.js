import React, { useEffect, useState } from 'react';
import { Card, Col, Button } from 'react-bootstrap';

function Service(props) {

    const [tasks, setTasks] = useState([]);
    const [logData, setLogData] = useState('');
    const [statsData, setStatsData] = useState([]);
    const [showLogs, setShowLogs] = useState(false);
    const [showStats, setShowStats] = useState(false);

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
        const getStats = async() => {
            console.log('In getStats');
            let sd = await Promise.all(tasks.map(async t => {
                const id = t['ID'];
                var result = await fetch(`http://localhost:3001/tasks/${id}/stats`);
                var resultJson = await result.json();
                return {
                    'id': id, 
                    'mem': bytesToMb(resultJson['memory_stats']['usage'])
                }
            }));
            setStatsData(sd);
        }

        getTasks();
        if (showLogs) {
            getLogs();
        }
        else 
        {
            closeLogReader(logReader);
        }
        if (showStats) {
            getStats();
        }
        else 
        {
            setStatsData([]);
        }

        // clean up
        return (() => { 
            closeLogReader(logReader);
        });
    }, [props.service, showLogs, showStats]);

    var bytesToMb = (bytes) => {
        const asInt = parseInt(bytes);
        const MBs = asInt/(1024*1024);
        return `${MBs.toFixed(2)} Mb`;
    }

    var logReaderOpen = (logReader) => {
        return logReader !== null && logReader.closed;
    }

    var closeLogReader = (logReader) => {
        if (logReaderOpen(logReader)) logReader.cancel();
    }

    var logBlock = () => {
        if (showLogs) {
            return (
                <React.Fragment>
                    <br />
                    <pre>
                        <code style={{fontSize: '10px', whiteSpace: 'pre'}}>
                            {logData}
                        </code>
                    </pre>
                </React.Fragment>
            );
        }
        else {
            return <React.Fragment />;
        }
    }

    var statsBlock = () => {
        if (showStats) {
            return (
                statsData.map(d => {
                    return (
                        <React.Fragment>
                            <br />
                            <pre key={d.id}>
                                <code>{d.id.substring(0, 5)}.. : {d.mem}</code>
                            </pre>
                        </React.Fragment>
                    );
                })
            )
        }
        else 
        {
            return <React.Fragment />;
        }
    }

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
                    {statsBlock()}
                    {logBlock()}
                </Card.Body>
            </Card>
        </Col>
    )

}

export default Service;