import express from 'express';
import Docker from 'dockerode';
import cors from 'cors';

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

app.get('/services', async (req, res, next) => {
    try {
        let services = await docker.listServices();
        res.json(services);
    } catch (e) {
        res.send('Error: ' + e);
    }
});

app.listen(port, () => console.log(`Docker API running on port ${port}!`))