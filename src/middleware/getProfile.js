
const getProfile = async (req, res, next) => {
    try {

        const profileId = Number(req.get('profile_id')) || 0;
        const { Profile } = req.app.get('models');

        const profile = await Profile.findOne({
            where: {
                id: profileId
            }
        });

        if (!profile) {

            return res.status(401).json({ success: false, message: 'profile_id is required' });
        }

        req.profile = profile;
        next();
    } catch (error) {

        console.error(error);
        res.status(500).end();
    }
};

module.exports = { getProfile }