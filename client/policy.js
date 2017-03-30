'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Articles Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/vendors',
      permissions: '*'
    },{
      resources: '/api/employee',
      permissions: '*'
    },{
      resources: '/api/order',
      permissions: '*'
    },{
      resources: '/api/loginEmployee',
      permissions: '*'
    },{
      resources: '/api/loginVendor',
      permissions: '*'
    }
    ,{
      resources: '/api/login',
      permissions: '*'
    },{
      resources: '/api/vendors/getorders',
      permissions: '*'
    }
    ,{
      resources: '/api/employee/getorders',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/vendors',
      permissions: '*'
    },{
      resources: '/api/employee',
      permissions: '*'
    },{
      resources: '/api/order',
      permissions: '*'
    },{
      resources: '/api/loginEmployee',
      permissions: '*'
    },{
      resources: '/api/loginVendor',
      permissions: '*'
    },{
      resources: '/api/login',
      permissions: '*'
    },{
      resources: '/api/vendors/getorders',
      permissions: '*'
    }
    ,{
      resources: '/api/employee/getorders',
      permissions: '*'
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/vendors',
      permissions: '*'
    },{
      resources: '/api/employee',
      permissions: '*'
    },{
      resources: '/api/order',
      permissions: '*'
    },{
      resources: '/api/loginEmployee',
      permissions: '*'
    },{
      resources: '/api/loginVendor',
      permissions: '*'
    },{
      resources: '/api/login',
      permissions: '*'
    },{
      resources: '/api/vendors/getorders',
      permissions: '*'
    }
    ,{
      resources: '/api/employee/getorders',
      permissions: '*'
    }]
  }]);
};

/**
 * Check If Articles Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an article is being processed and the current user created it then allow any manipulation
  if (req.vendor && req.user && req.vendor.user && req.vendor.user.id === req.user.id) {
    return next();
  }

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next();
      } else {
        /*return res.status(403).json({
          message: 'User is not authorized'
        });*/
       return next();
      }
    }
  });
};
