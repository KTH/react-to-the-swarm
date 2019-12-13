const args = ['run start'];
var env = Object.create( process.env );
env.NODE_ENV = 'development';
const opts = { 
    stdio: 'inherit',
    cwd: 'server',
    shell: true, 
    env: env
};
require('child_process').spawn('yarn', args, opts);