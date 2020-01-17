import express from 'express';
import Docker from 'dockerode';
import cors from 'cors';
import stream from 'stream';

const docker = new Docker({ socketPath: '/var/run/docker.sock' });
const app = express()
const port = 3001
app.use(cors());

app.get('/services/:service_name/tasks', async (req, res, next) => {
    try {
        let tasks = await docker.listTasks({
            "filters": `{\"service\": [\"${req.params.service_name}\"]}`
        });
        res.json(tasks);
    } catch (e) {
        res.send('Error: ' + e);
    }
});

app.get('/services/:service_name/logs', async (req, res, next) => {
    try {
        let services = await docker.listServices({
            "filters": `{\"name\": [\"${req.params.service_name}\"]}`
        });
        if (services.length > 0) {
            let service = await docker.getService(services[0]["ID"]);
            let logStream = await service.logs({
                "follow": true,
                "stdout": true,
                "stderr": true,
            });
            let trimStream = new stream.Writable({
                write: function(chunk, _, next) {
                    res.write(chunk.toString().substring(8));
                    next();
                }
            });
            res.setHeader('Content-Type', 'text/plain;charset=UTF-8');
            logStream.pipe(trimStream);
        }
    } catch (e) {
        res.send('Error: ' + e);
    }
});

app.get('/tasks/:taskid/stats', async (req, res, next) => {
    try {
        let theTask = await docker.getTask(req.params.taskid);
        const taskDetails = await theTask.inspect();
        const containerId = taskDetails['Status']['ContainerStatus']['ContainerID'];
        const container = await docker.getContainer(containerId);
        const containerStats = await container.stats({'stream': false});
        res.json(containerStats);
    } catch (e) {
        res.send('Error: ' + e);
    }
});

app.get('/services', async (req, res, next) => {
    try {
        let services = await docker.listServices();
        res.json(services);
    } catch (e) {
        res.send('Error: ' + e);
    }
});

app.listen(port, () => console.log(`Docker API running on port ${port}!`))