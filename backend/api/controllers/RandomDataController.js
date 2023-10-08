/**
 * RandomDataController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const { generateRandomDataForStructure } = require('../utils');
const { ObjectId } = require('mongodb');

module.exports = {
  /**
   * Generates random data based on the given structure and array length.
   *
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Promise} A promise that resolves to the generated random data.
   */
  generateRandomData: async (req, res) => {
    // Extract the structure and array length from the request body
    const { structure, arrayLength } = req.body;

    // Check if the required parameters are present
    if (!structure || !arrayLength) {
      return res.badRequest('Structure and arrayLength are required');
    }

    try {
      // Generate random data for each element in the array
      const randomData = await Promise.all(
        Array.from({ length: parseInt(arrayLength) }, () =>
          generateRandomDataForStructure(structure)
        )
      );

      // Store the generated data in the database
      await GeneratedData.create({
        data: JSON.stringify(randomData),
        user: req.id,
      });

      // Update the total count for the user in the user collection
      const userCollection = sails.getDatastore().manager.collection('user');
      await userCollection.updateOne(
        { _id: new ObjectId(req.id) },
        { $inc: { total: -1 } }
      );

      // Return the generated random data
      return res.json(randomData);
    } catch (error) {
      console.error(error);

      // Handle any errors that occur during the generation process
      return res.serverError({
        message: error.message,
      });
    }
  },
  getSupportedTypes: async (req, res) => {
    try {
      const types = [
        'string',
        'number',
        'arrayOfArray',
        'arrayOfString',
        'arrayOfNumber',
        'boolean',
        'uuid',
        'date',
        'email',
        'address',
        'name',
        'fullName',
        'slug',
        'longText',
        'website',
        'ip',
        'contact',
      ];

      return res.ok(types);
    } catch (error) {
      console.error(error);
      return res.serverError({
        message: error.message,
      });
    }
  },
};
