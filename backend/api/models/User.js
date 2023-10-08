/**
 * User.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    apiKey: {
      type: 'string',
      unique: true,
    },
    email: {
      type: 'string',
      unique: true,
      isEmail: true
    },
    total: {
      type: 'number',
      defaultsTo: 1000
    }
  },

};

