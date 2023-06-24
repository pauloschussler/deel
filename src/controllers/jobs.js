const { Op } = require("sequelize");

/**
 * @returns unpaid jobs for a specific profile
 */
const getUnpaidJobs = async (req, res) => {

    const { Job } = req.app.get('models');
    const { Contract } = req.app.get('models');

    const profileId = Number(req.get('profile_id'));

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
            return res.status(404).json({ success: true, total: 0, message: 'No record found' });
        }

        res.json({ success: true, total: jobs.length, data: jobs });
    } catch (error) {

        console.error(error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
};

const payJob = async (req, res) => {

    const { Job } = req.app.get('models');
    const { Contract } = req.app.get('models');
    const { Profile } = req.app.get('models');

    const { job_id } = req.params;

    try {
        // Find the job by its ID
        const job = await Job.findByPk(job_id);

        if (!job) {

            return res.status(404).json({ success: true, message: 'Record not found' });
        }

        const contract = await Contract.findByPk(job.ContractId);
        const contractor = await Profile.findByPk(contract.ContractorId);
        const client = await Profile.findByPk(contract.ClientId);

        if (!checkBalance(job, contractor)) {

            return res.status(404).json({ success: true, message: 'Insufficient balance' });
        }

        contractor.balance -= job.price;
        client.balance += job.price;

        await Promise.all([contractor.save(), client.save()]);

        job.paid = true;
        await job.save();

        res.json({ success: true, message: 'Job payment successful' });
    } catch (error) {

        console.error(error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
};

const checkBalance = (job, contractor) => {

    return contractor.balance >= job.price;
}

module.exports = {
    getUnpaidJobs, payJob
};
