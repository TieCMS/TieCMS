const express = require('express');
const EventEmitter = require('events');
const Plugins = require('./plugins')

class App extends EventEmitter {
    constructor() {
        super();

        this.plugins = new Plugins(this);

        this.server = express();
        this.server.use(express.json());
    }

    start() {
        this.server.get('/', (req, res) => {
            res.send('Hello World!');
        });

        this.server.listen(8080, () => {
            console.log('Server started on port 3000')
            this.emit('start');
        });
    }

    stop() {
        if (this.stopped) return;
        console.log('Server stopped');
        this.emit('stop');
        this.stopped = true;
        process.exit();
    }
}

const app = new App();
app.start();

["exit", "SIGINT", "SIGUSR1", "SIGUSR2", "SIGTERM", "uncaughtException"].forEach(event => {
    process.on(event, () => app.stop());
});