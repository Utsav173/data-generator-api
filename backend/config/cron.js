module.exports.cron = {
  firstJob: {
    // schedule: '*/5 * * * * *',
    schedule: '0 0 1 * *', // Run at early midnight on first day of the month
    onTick: async function () {
      await sails.helpers.resetlimit();
    },
  },
  secondJob:{
    // run after every 13 minutes
    schedule: '*/13 * * * *',
    onTick: function () {
      // get current date and time and ip address
      const dateTime = new Date().toLocaleTimeString();
      const dateDay = new Date().toLocaleDateString();
      console.log(`Date: ${dateDay} Time: ${dateTime}`);
    }
  }
};
