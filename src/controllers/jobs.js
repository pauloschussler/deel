const { Op } = require("sequelize");

const { checkBalance, addBalance, removeBalance } = require('./profiles');
/**
 * @returns unpaid jobs for a specific profile
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const getUnpaidJobs = async (req, res) => {

    const profileId = Number(req.get('profile_id'));
    const { Job } = req.app.get('models');
    const { Contract } = req.app.get('models');

    try {
        const jobs = await Job.findAll({
            where: {
                paid: null,
            },
            include: [
                {
                    model: Contract,
                    where: {
                        status: 'in_progress',
                        [Op.or]: [{ ClientId: profileId }, { ContractorId: profileId }],
                    },
                }
            ],
        });

        if (!jobs || jobs.length === 0) {
            return res.status(404).json({ success: false, total: 0, message: 'No record found' });
        }

        res.json({ success: true, total: jobs.length, data: jobs });
    } catch (error) {

        console.error(error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
};

/**
 * Process payment for a job, deducting the job value from the contractor's balance
 * and adding it to the client's balance.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const payJob = async (req, res) => {

    const { Contract, Job } = req.app.get('models');

    const { job_id } = req.params;
    console.log('test')


    try {

        const job = await Job.findByPk(job_id);

        if (!job) {

            return res.status(404).json({ success: false, message: 'Record not found' });
        }

        if (job.paid === true) {

            return res.status(404).json({ success: false, message: 'Job is already paid' });
        }

        const contract = await Contract.findByPk(job.ContractId);

        if (! await checkBalance(contract.ClientId, job.price)) {

            return res.status(404).json({ success: false, message: 'Insufficient balance' });
        }

        await removeBalance(contract.ClientId, job.price);
        await addBalance(contract.ContractorId, job.price);
        await confirmPayment(job);

        res.json({ success: true, message: 'Job payment successful' });
    } catch (error) {

        console.error(error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
};

/**
 * Confirm the payment of a job by setting the paid flag to true
 * @param {Object} job - The job to confirm payment for
 */
const confirmPayment = async (job) => {
    job.paid = true;
    job.paymentDate = new Date().toISOString().slice(0, 19).replace('T', ' ');

    await job.save();
};

module.exports = {
    getUnpaidJobs, payJob
};
