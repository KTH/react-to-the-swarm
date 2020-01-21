import React, { useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';

function ServiceStats(props) {

    let [statsData, setStatsData] = useState([]);
    let [isLoading, setIsLoading] = useState(false);
    let updateTimer = null;

    useEffect(() => {
        const getStats = async(showSpinner) => {
            if (showSpinner) setIsLoading(true);
            let statData = await Promise.all(props.tasks.map(async task => {
                const id = task['ID'];
                var result = await fetch(`http://localhost:3001/tasks/${id}/stats`);
                var resultJson = await result.json();
                return {
                    'id': id, 
                    'mem': bytesToMb(resultJson['memory_stats']['usage']),
                    'usage': usageAndLimitToPercent(resultJson['memory_stats']['usage'], 
                        resultJson['memory_stats']['limit']) 
                }
            }));
            setStatsData(statData);
            if (showSpinner) setIsLoading(false);
        }

        if (props.showStats) {
            getStats(true);
            setInterval(() => {getStats(false);}, 3000);
        }
        else {
            setStatsData([]);
            if (updateTimer !== null) {
                clearInterval(updateTimer);
                updateTimer = null;
            }
        }
    }, [props.showStats, props.tasks])
 
    var bytesToMb = (bytes) => {
        const asInt = parseInt(bytes);
        const MBs = asInt/(1024*1024);
        return `${MBs.toFixed(2)} Mb`;
    }

    var usageAndLimitToPercent = (usage, limit) => {
        const usageAsInt = parseInt(usage);
        const limitAsInt = parseInt(limit);
        return `${((usageAsInt/limitAsInt) * 100).toFixed(2)} %`;
    }

    if (isLoading) {
        return (
            <React.Fragment>
                <br />
                <Spinner animation="border" role="status" />
            </React.Fragment>
        );
    }
    else if (props.showStats) {
        return (
            statsData.map(d => {
                return (
                    <React.Fragment key={d.id}>
                        <br />
                        <pre key={d.id}>
                            <code style={{fontSize: '16px'}}>
                                {d.id.substring(0, 5)}.. : {d.mem} ({d.usage})
                            </code>
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
export default ServiceStats;