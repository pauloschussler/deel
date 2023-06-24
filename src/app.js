const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { sequelize } = require('./model')

const contracts = require('./routes/contracts')

app.use(bodyParser.json());
app.set('sequelize', sequelize)
app.set('models', sequelize.models)

app.use('/contracts', contracts)

module.exports = app;
