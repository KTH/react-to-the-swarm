import React, { useEffect, useState } from 'react';
import Spinner from './Spinner.js';

function ServiceStats(props) {

    let [statsData, setStatsData] = useState([]);
    let [isLoading, setIsLoading] = useState(false);
    let [updateTimer, setUpdateTimer] = useState(null);

    useEffect(() => {
        const getStats = async(showSpinner) => {
            if (showSpinner) setIsLoading(true);
            let statData = await Promise.all(props.tasks.map(async task => {
                const id = task['ID'];
                var result = await fetch(`http://localhost:3001/tasks/${id}/stats`);
                var resultJson = await result.json();
                return {
                    'id': id, 
                    'memUsage': bytesToMb(resultJson['memory_stats']['usage']),
                    'memPercent': usageAndLimitToPercent(resultJson['memory_stats']['usage'], 
                        resultJson['memory_stats']['limit']),
                    'cpuPercent': cpuUsage(resultJson['cpu_stats'], resultJson['precpu_stats'])
                }
            }));
            setStatsData(statData);
            if (showSpinner) setIsLoading(false);
        }

        const stopUpdate = () => {
            setStatsData([]);
            if (updateTimer !== null) {
                clearInterval(updateTimer);
                setUpdateTimer(null);
            }
        }

        if (props.showStats && updateTimer === null) {
            getStats(true);
            setUpdateTimer(setInterval(() => {getStats(false);}, 3000));
        }
        return stopUpdate;
    }, [props.showStats, props.tasks, updateTimer])

    const cpuUsage = (cpu_stats, precpu_stats) => {
        const totalUsageTotal = parseInt(cpu_stats.cpu_usage.total_usage);
        const preTotalUsageTotal = parseInt(precpu_stats.cpu_usage.total_usage);
        var totalDelta = totalUsageTotal - preTotalUsageTotal;
        const systemCpuUsage = parseInt(cpu_stats.system_cpu_usage);
        const systemPreCupUsage = parseInt(precpu_stats.system_cpu_usage);
        var systemDelta = systemCpuUsage - systemPreCupUsage;  
        return `${((totalDelta/systemDelta) * 100).toFixed(2)}%`;
    }
 
    const bytesToMb = (bytes) => {
        const asInt = parseInt(bytes);
        const MBs = asInt/(1024*1024);
        return `${MBs.toFixed(2)} Mb`;
    }

    const usageAndLimitToPercent = (usage, limit) => {
        const usageAsInt = parseInt(usage);
        const limitAsInt = parseInt(limit);
        return `${((usageAsInt/limitAsInt) * 100).toFixed(2)}%`;
    }

    if (isLoading) {
        return (
            <React.Fragment>
                <br />
                <Spinner />
            </React.Fragment>
        );
    }
    else if (props.showStats) {
        return (
            statsData.map(d => {
                return (
                    <React.Fragment key={d.id}>
                        <pre key={d.id} style={{lineHeight: '12px', marginBottom: '0px'}}>
                            <code style={{fontSize: '12px'}}>
                                {d.id.substring(0, 5)}.. mem: {d.memUsage} ({d.memPercent}), cpu: {d.cpuPercent}
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