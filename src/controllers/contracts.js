const { Op } = require("sequelize");

/**
 * @returns contract by id for a specific profile
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const getContractById = async (req, res) => {

    const { Contract } = req.app.get('models');
    const { id } = req.params;
    const profileId = Number(req.get('profile_id'));

    try {
        const contracts = await Contract.findOne({
            where: {
                id,
                [Op.or]: [{ ClientId: profileId }, { ContractorId: profileId }],
            },
        });

        if (!contracts || contracts.length === 0) {
            return res.status(404).json({ success: true, total: 0, message: 'No record found' });
        }

        res.json({ success: true, total: 1, data: contracts });
    } catch (error) {

        console.error(error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
};

/**
 * @returns contracts for a specific profile
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const getContracts = async (req, res) => {

    const { Contract } = req.app.get('models');
    const profileId = Number(req.get('profile_id'));

    try {
        const contracts = await Contract.findAll({
            where: {
                status: { [Op.not]: 'terminated' },
                [Op.or]: [{ ClientId: profileId }, { ContractorId: profileId }],
            },
        });

        if (!contracts || contracts.length === 0) {
            return res.status(404).json({ success: true, total: 0, message: 'No record found' });
        }

        res.json({ success: true, total: contracts.length, data: contracts });
    } catch (error) {

        console.error(error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
};

module.exports = {
    getContractById,
    getContracts,
};
