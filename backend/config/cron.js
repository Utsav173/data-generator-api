module.exports.cron = {
  firstJob: {
    // schedule: '*/5 * * * * *',
    schedule: '0 0 1 * *', // Run at early midnight on first day of the month
    onTick: async function () {
      await sails.helpers.resetlimit();
    },
  },
};
