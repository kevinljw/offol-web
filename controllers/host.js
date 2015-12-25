var secrets = require('../config/secrets');



/**
 * GET /people
 * People form page.
 */
exports.getHost = function(req, res) {
  // get all the users
  // console.log("getPeople");
  
    res.render('host', {
      title: 'Start a project',
      
    });
  
  
};