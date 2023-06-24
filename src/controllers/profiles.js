const { sequelize } = require('../model')

const Profile = sequelize.models.Profile;

/**
 * Add balance to a profile by updating the profile's balance field.
 *
 * @param {number} profileId - The ID of the profile.
 * @param {number} value - The amount to be added to the balance.
 * @throws {Error} If the profile is not found or if failed to add balance.
 */
const addBalance = async (profileId, value) => {

    try {
        const profile = await Profile.findByPk(profileId);
        if (!profile) {
            throw new Error(`Profile with ID ${profileId} not found`);
        }

        profile.balance += value;
        await profile.save();
    } catch (error) {
        console.error(error);
        throw new Error('Failed to add balance');
    }
};

/**
 * Remove balance from a profile by deducting the specified value from the profile's balance field.
 *
 * @param {number} profileId - The ID of the profile.
 * @param {number} value - The amount to be deducted from the balance.
 * @throws {Error} If the profile is not found, if the balance is insufficient, or if failed to remove balance.
 */
const removeBalance = async (profileId, value) => {

    try {
        const profile = await Profile.findByPk(profileId);
        if (!profile) {
            throw new Error(`Profile with ID ${profileId} not found`);
        }

        if (profile.balance < value) {
            throw new Error('Insufficient balance');
        }

        profile.balance -= value;
        await profile.save();
    } catch (error) {
        console.error(error);
        throw new Error('Failed to remove balance');
    }
};

/**
 * Check if a profile's balance is greater than or equal to a specified value.
 *
 * @param {number} profileId - The ID of the profile.
 * @param {number} value - The value to compare against the profile's balance.
 * @returns {boolean} True if the balance is greater than or equal to the value, false otherwise.
 * @throws {Error} If the profile is not found or if failed to check balance.
 */
const checkBalance = async (profileId, value) => {

    try {
        const profile = await Profile.findByPk(profileId);
        if (!profile) {
            throw new Error(`Profile with ID ${profileId} not found`);
        }

        return profile.balance >= value;

    } catch (error) {
        console.error(error);
        throw new Error('Failed to check balance');
    }
};

/**
 * Check if a deposit value is less than 25% of the balance.
 *
 * @param {number} profileId - The ID of the profile.
 * @param {number} value - The value to compare against the profile's balance.
 * @returns {boolean} True if the balance is less than 25% of the balance, false otherwise.
 * @throws {Error} If the profile is not found or if failed to check balance.
 */
const checkDepositAmount = async (profileId, amount) => {

    try {

        const profile = await Profile.findByPk(profileId);

        if (!profile) {
            throw new Error(`Profile with ID ${profileId} not found`);
        }

        const limit = profile.balance * 0.25;

        console.log(amount <= limit);

        return amount <= limit;


    } catch (error) {
        console.error(error);
        throw new Error('Failed to check balance');
    }
};

module.exports = {
    addBalance,
    removeBalance,
    checkBalance,
    checkDepositAmount,
};
