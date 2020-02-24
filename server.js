const express = require('express');
const app = express();
const fs = require('fs');
const find = require('lodash').find;
const get = require('lodash').get;
const filter = require('lodash').filter;
const morgan = require('morgan');
const cors = require('cors');

app.use(morgan('tiny'));

const corsOptions = {
    origin: 'http://localhost:3000'
};

const areas = JSON.parse(fs.readFileSync('data/areas.json'));
const PORT = '8000';

const getFrequenciesForArea = (area, spectrum) => {
    return filter(spectrum, (coordinate) => {
        const frequencies = get(area, 'frequencies');
        return (
            coordinate.x >= frequencies[0] && coordinate.x <= frequencies[1]
        );
    });
};

app.get('/areas', cors(corsOptions), (req, res) => {
    res.json(areas);
});

app.get('/spectrum/:id', cors(corsOptions), (req, res) => {
    const {id} = req.params;
    const area = find(areas, (area) => area.id === parseInt(id));

    if (!area) return res.status('404').send('Invalid area requested!');

    const spectrum = JSON.parse(
        fs.readFileSync('data/spectrum.json')).spectrum;

    const results = getFrequenciesForArea(area, spectrum);
    res.json(results);
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
    app.listen(PORT, () => {
        console.log(`Listening on port ${PORT}...`);
    });
}

module.exports = app;
