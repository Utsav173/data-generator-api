/**
 * AdminController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  /**
   * Retrieves all users and returns them in descending order of creation date.
   *
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   */
  getUser: async (req, res) => {
    try {
      // Retrieve all users and sort them by creation date in descending order
      const userData = await User.find().sort('createdAt DESC');
      return res.ok(userData);
    } catch (error) {
      // Log the error to the console
      console.log(error);
      return res.badRequest(error);
    }
  },
  /**
   * Retrieves user data based on the provided ID.
   *
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Object} The user data.
   */
  getUserData: async (req, res) => {
    try {
      // Check if the ID is provided
      if (!req.params.id) {
        return res.badRequest('id is required');
      }

      // Retrieve user data based on the ID
      const userData = await GeneratedData.find({ user: req.params.id }).sort(
        'createdAt DESC'
      );

      // Return the user data
      return res.ok(userData);
    } catch (error) {
      // Log and return the error
      console.log(error);
      return res.badRequest(error);
    }
  },
  /**
   * Retrieves a single user's data by their ID.
   *
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Object} - The response object with the single user data.
   */
  getSingleUserData: async (req, res) => {
    try {
      // Get the user ID from the request parameters
      const id = req.params.id;

      // Find the generated data by the ID
      let GenerationData = await GeneratedData.findOne({ id });

      // If no data is found, return a 404 response
      if (!GenerationData) {
        return res.status(404).json({
          message: 'Data not found',
        });
      }

      // Parse the generated data from JSON string to object
      GenerationData.data = JSON.parse(GenerationData.data);

      // Return the generated data in the response
      return res.ok(GenerationData);
    } catch (error) {
      console.log(error);

      // Return a bad request response with the error message
      return res.badRequest(error);
    }
  },
};
