import React, { useEffect, useState } from 'react';
import Spinner from './Spinner.js';

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

        getLogs();
        // clean up
        return (() => { 
            closeLogReader(logReader);
        });
    }, [props.service])

    if (isLoading) {
        return (
            <React.Fragment>
                <br />
                <Spinner />
            </React.Fragment>
        );
    }
    else {
        return (
            <React.Fragment>
                <br />
                <pre className="log-pre">
                    <code className="log-code">{logData}</code>
                </pre>
            </React.Fragment>
        );
    }

}
export default ServiceLogs;