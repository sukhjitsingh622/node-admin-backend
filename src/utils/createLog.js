const Log = require('../models/Log');

const createLog = async ({ user, action, description, ip }) => {
    try {
        await Log.create({
            user,
            action,
            description,
            ipAddress: ip
        });
    } catch (error) {
        console.log('Log error:', error.message);
    }
};

module.exports = createLog;