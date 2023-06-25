const { checkDepositAmount, addBalance } = require('./profiles');

/**
 * Process of depositing an amount in the balance
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const depositAmount = async (req, res) => {

    const { userId } = req.params;
    const depositAmount = Number(req.get('deposit_amount'));

    try {

        if (!depositAmount) {

            return res.status(404).json({ success: true, message: 'Deposit amount is required' });
        }

        if (! await checkDepositAmount(userId, depositAmount)) {

            return res.status(404).json({ success: true, message: 'Deposit amount exceeds allowed limit' });
        }

        await addBalance(userId, depositAmount)

        res.json({ success: true, message: 'Deposit successful' });
    } catch (error) {

        console.error(error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
};

module.exports = {
    depositAmount,
};
