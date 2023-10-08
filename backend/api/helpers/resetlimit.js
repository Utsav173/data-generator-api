module.exports = {
  friendlyName: 'Resetlimit',

  description: 'this helpers helps to reset user data generator limit to 1000',

  inputs: {},

  exits: {
    success: {
      description: 'All done.',
    },
  },

  fn: async function () {
    try {
      const userCollection = sails.getDatastore().manager.collection('user');
      await userCollection.updateMany(
        { apiKey: { $exists: true, $ne: null } },
        { $set: { total: 1000 } }
      );
      console.log('\x1b[32m%s\x1b[0m', '--> Limit reset successfully <--');
    } catch (error) {
      console.log(error);
    }
  },
};
