const logger = require('../modules/Logger.js');

module.exports = async (client, error) => {
    if (error.name === 'HTTPError') {
        process.exit(0);
    }
    logger.log(`${JSON.stringify(error)}`, 'error');
};
