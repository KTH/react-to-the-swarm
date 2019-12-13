import express from 'express';
import Docker from 'node-docker-api';

const docker = new Docker.Docker({ socketPath: '/var/run/docker.sock' });
const app = express()
const port = 3001

app.get('/containers', async (req, res, next) => {
    try {
        let containers = await docker.container.list();
        res.send(containers[0]);
    } catch (e) {
        res.send('Error: ' + e);
    }

});


app.listen(port, () => console.log(`Docker API running on port ${port}!`))