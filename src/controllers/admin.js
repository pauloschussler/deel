const { Op } = require('sequelize');

/**
 * @returns Retuns best payed professions 
 * if the variables star and end were valid dates,
 * it will apply filters, if not, it will search without period restriction
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const bestProfession = async (req, res) => {
    const { start, end } = req.query;
    const sequelize = req.app.get('sequelize');

    try {

        const whereCondition = {};

        if (isValidDate(start)) {

            whereCondition.createdAt = {
                [Op.gte]: start,
            };
        }

        if (isValidDate(end)) {
            whereCondition['$Jobs.paymentDate$'] = {
                [Op.lte]: end,
            };
        }

        const { Job, Contract, Profile } = req.app.get('models');

        const result = await Contract.findAll({
            attributes: [
                [sequelize.literal('Contractor.profession'), 'profession'],
                [sequelize.fn('SUM', sequelize.col('Jobs.price')), 'amountPaid'],
            ],
            include: [
                {
                    model: Job,
                    attributes: [],
                    required: true,
                    where: {
                        'paid': 1,
                    },
                }, {
                    model: Profile,
                    as: 'Contractor',
                    attributes: [],
                    required: true,
                },
            ],
            group: ['Contractor.profession'],
            order: [[sequelize.literal('amountPaid'), 'DESC']],
            where: whereCondition,
        });

        /**
           * Aparently Sequelize does not support limit using belongsToMany relations.
           * I decided to limit the return of the result array in this case, but probably
           * the best pratice would be use a SQL query.
           */
        res.json({ success: true, total: result.slice(0, 1).length, data: result.slice(0, 1) });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
};

/**
 * @returns Retuns best payed professions 
 * if the variables star and end were valid dates,
 * it will apply filters, if not, it will search without period restriction
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const bestClients = async (req, res) => {
    const { start, end, limit } = req.query;
    const sequelize = req.app.get('sequelize');

    const { Job, Contract, Profile } = req.app.get('models');

    try {

        const whereCondition = {};

        if (isValidDate(start)) {

            whereCondition.createdAt = {
                [Op.gte]: start,
            };
        }

        if (isValidDate(end)) {
            whereCondition['$Jobs.paymentDate$'] = {
                [Op.lte]: end,
            };
        }

        const result = await Contract.findAll({
            attributes: [
                'id',
                [sequelize.literal('Client.firstName || " " || Client.lastName'), 'name'],
                [sequelize.fn('SUM', sequelize.col('Jobs.price')), 'amountPaid']
            ],
            include: [
                {
                    model: Profile,
                    attributes: [],
                    as: 'Client',
                },
                {
                    model: Job,
                    attributes: [],
                    where: {
                        paid: 1
                    },
                }
            ],
            order: [['amountPaid', 'DESC']],
            group: ['Contract.ClientId'],
            where: whereCondition,
        });

        /**
         * Aparently Sequelize does not support limit using belongsToMany relations.
         * I decided to limit the return of the result array in this case, but probably
         * the best pratice would be use a SQL query.
         */
        res.json({ success: true, total: result.slice(0, limit ? limit : 2).length, data: result.slice(0, limit ? limit : 2) });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
};

/**
 * Check if a string is a valid date.
 *
 * @param {string} date - The date string to validate.
 * @returns {boolean} True if the string is a valid date, false otherwise.
 */
function isValidDate(value) {

    const datetimeRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

    const isValidDatetime = datetimeRegex.test(value) && !isNaN(Date.parse(value));
    const isValidDate = dateRegex.test(value) && !isNaN(Date.parse(value));

    return isValidDatetime || isValidDate;
}

module.exports = {
    bestProfession,
    bestClients,
};
