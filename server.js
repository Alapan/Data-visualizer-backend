const express = require('express');
const app = express();
const fs = require('fs');
const find = require('lodash').find;

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, authorization'
    );
    res.header(
        'Access-Control-Allow-Methods',
        'GET, POST, OPTIONS, PUT, DELETE'
    );
    next();
});

const areas = JSON.parse(fs.readFileSync('data/areas.json'));

app.get('/areas', (req, res) => {
    res.json(areas);
});

app.get('/spectrum/:id', (req, res) => {
    const {id} = req.params;
    const area = find(areas, (area) => area.id === parseInt(id));
    const frequencies = area ? area.frequencies : [];

    if (!area) return res.json([]);

    const spectrum = JSON.parse(
        fs.readFileSync('data/spectrum.json')).spectrum;

    const result = spectrum.filter((coordinate) => {
        return (
            coordinate.x >= frequencies[0] && coordinate.x <= frequencies[1]
        );
    });
    res.json(result);
});

app.use((err, req, res, next) => {
    const {statusCode, message} = err;
    res.status(statusCode).json({
        status: 'error',
        statusCode,
        message
    });
});

if (!module.parent) {
    app.listen('8000', () => {
        console.log('Listening on port 8000...');
    });
}

module.exports = app;
