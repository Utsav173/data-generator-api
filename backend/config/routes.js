/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {
  'POST /api/generate/data': 'RandomDataController.generateRandomData',
  'POST /user/api-key': 'AuthController.getApiKey',
  'POST /user/forgot-api-key': 'AuthController.forgotKey',
  'GET /user/me': 'AuthController.me',
  'GET /admin/users': 'AdminController.getUser',
  'GET /admin/user/:id': 'AdminController.getUserData',
  'GET /admin/user/data/:id': 'AdminController.getSingleUserData',
  'GET /user/supportedTypes': 'RandomDataController.getSupportedTypes',
};
