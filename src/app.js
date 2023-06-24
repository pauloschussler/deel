const express = require('express');
const bodyParser = require('body-parser');
const { sequelize } = require('./model')
const { getProfile } = require('./middleware/getProfile')
const { Op } = require("sequelize")
const app = express();
app.use(bodyParser.json());
app.set('sequelize', sequelize)
app.set('models', sequelize.models)

/**
 * FIX ME!
 * @returns contract by id
 */
app.get('/contracts/:id', getProfile, async (req, res) => {

    const { Contract } = req.app.get('models')
    const { id } = req.params
    const profileId = Number(req.get('profile_id'))

    const contract = await Contract.findOne({
        where: {
            id: id,
            [Op.or]: [{ ClientId: profileId }, { ContractorId: profileId }],
        }
    })

    if (!contract) return res.status(404).end()
    res.json(contract)
})

app.get('/contracts/', getProfile, async (req, res) => {

    const { Contract } = req.app.get('models')
    const { id } = req.params
    const profileId = Number(req.get('profile_id'))

    const contract = await Contract.findAll({
        where: {
            status: { [Op.not]: 'terminated' },
            [Op.or]: [{ ClientId: profileId }, { ContractorId: profileId }],
        }
    })

    if (!contract) return res.status(404).end()
    res.json(contract)
})

module.exports = app;
