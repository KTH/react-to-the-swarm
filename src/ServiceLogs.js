import React, { useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';

function ServiceLogs(props) {

    const [logData, setLogData] = useState('');
    let [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        let logReader = null;

        var logReaderOpen = (logReader) => {
            return logReader !== null && logReader.closed;
        }
    
        var closeLogReader = (logReader) => {
            if (logReaderOpen(logReader)) logReader.cancel();
        }

        const getLogs = async() => {
            setIsLoading(true);
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
            setIsLoading(false);
        }

        props.showLogs ? getLogs() : closeLogReader(logReader);
        // clean up
        return (() => { 
            closeLogReader(logReader);
        });
    }, [props.showLogs, props.service])

    if (isLoading) {
        return (
            <React.Fragment>
                <br />
                <Spinner animation="border" role="status" />
            </React.Fragment>
        );
    }
    else if (props.showLogs) {
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
export default ServiceLogs;