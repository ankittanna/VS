'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
	  mongoose = require('mongoose'),
	  Industries = mongoose.model('Industries'),
      Products = mongoose.model('Products'),
	  http = require('http'),
	  Employee = mongoose.model('Employee');
  //errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));
  
/**
 * Login
 */

exports.loginUser = function (req, res) {

   Employee.find({'emailid': req.body.emailid}).exec(function (err, employees) {
  	if (err) {     
	       return res.status(400).send({
          message: "Internal Error"
      });
    } else {
    	if(employees.length > 0) {
    		 if(req.body.password === 'password'){
    		 	res.json(employees);
    		 }
    		 else{
    		 	 return res.status(400).send({
          		   message: "Wrong Password"
  	    		  });
  	    	 }
    	}
    	else {
    		 Vendor.find({'emailid': req.body.emailid}).exec(function (err, vendors) {
			  	if (err) {     
				       return res.status(400).send({
			          message: "Internal Error"
			      });
			    } else {
			    	if(vendors.length > 0) {
			    		 if(req.body.password === 'password'){
			    		 	 res.json(vendors);
			    		 }
			    		 else{
			    		 	return res.status(400).send({
			          		   message: "Wrong Password"
			  	    		});
			    		 }
			    	}
			    	else {
			    		return res.status(400).send({
			          		   message: "User does not Exist"
			  	    	 });
			    	}
			
			    }
			  });
 
    	}

    }
  });
};




  
/**
 * Add New Vendor
 */
exports.addVendor = function (req, res) {
  
  Vendor.find({'emailid': req.body.emailid}).exec(function (err, vendors) {
  	if (err) {     
	       return res.status(400).send({
          message: "Internal Error"
      });
    } else {
    	if(vendors.length > 0) {
    		 res.send("Vendor Already Exist");
    	}
    	else {
    		 var vendor = new Vendor(req.body);
			  vendor.save(function (err) {
			    if (err) {
			      return res.status(400).send({
			        message: "Internal Error"
			      });
			    } else {
			      res.json(vendor);
			    }
			  });
    	}

    }
  });
  
};



/**
 * List Vendors
 */
exports.listVendors = function (req, res) {
    industries.find().exec(function (err, vendors) {
        if (err) {
            return res.status(400).send({
                message: "Internal Error"
            });
        } else {
            res.json(vendors);
        }
    });
    
    /*Vendor.find().sort('-created').exec(function (err, vendors) {
    if (err) {
      return res.status(400).send({
        message: "Internal Error"
      });
    } else {
      res.json(vendors);
    }
  });*/
};

exports.deleteVendors = function (req, res) {  
  Vendor.remove({role:'Vendor'}).exec();
};

  /**
 * Add New Employee
 */
exports.addEmployee = function (req, res) {
	
  Employee.find({'emailid': req.body.emailid}).exec(function (err, employees) {
  	if (err) {     
	       return res.status(400).send({
          message: "Internal Error"
      });
    } else {
    	if(employees.length > 0) {
    		 res.send("User Already Exist");
    	}
    	else {
    		 var employee = new Employee(req.body);
			  employee.save(function (err) {
			    if (err) {
			      return res.status(400).send({
			        message: "Internal Error"
			      });
			    } else {
			      res.json(employee);
			    }
			  });
    	}

    }
  });
};


exports.listEmployee = function (req, res) {
  Employee.find().sort('-created').exec(function (err, employees) {
    if (err) {
      return res.status(400).send({
        message: "Internal Error"
      });
    } else {
      res.json(employees);
    }
  });
};

exports.deleteEmployee= function (req, res) {
 /* var employee = req.employee;

  employee.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: "Internal Error"
      });
    } else {
      res.json(employee);
    }
  });*/
  
  Employee.remove({role:'Employee'}).exec();
};


/*exports.orderListForEmp = function (req, res) {
  Order.find(req.query).sort('-created').exec(function (err, orders) {
    if (err) {
      return res.status(400).send({
        message: "Internal Error"
      });
    } else {
      res.json(orders);
    }
  });
};

exports.listOrder = function (req, res) {
 Order.find().sort('-created').exec(function (err, orders) {
    if (err) {
      return res.status(400).send({
        message: "Internal Error"
      });
    } else {
      res.json(orders);
    }
  });

};

exports.orderListForVendor = function (req, res) {
  Order.find(req.query).sort('-created').exec(function (err, orders) {
    if (err) {
      return res.status(400).send({
        message: "Internal Error"
      });
    } else {
      res.json(orders);
    }
  });
};


exports.placeOrder = function (req, res) {
   var order = new Order(req.body);
  //vendor.user = req.user;

  order.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: "Internal Error"
      });
    } else {
      res.json(order);
      
       var employeeSmsMsg = "Your order has been placed to " + order.ordertoname + ". Your order number is " + order.ordernumber;       
      var sParameter = encodeURIComponent(employeeSmsMsg.trim());
      var smspath  = "/?auth=363AC9E2AA6F6CE158EB73674BB22&to=" + order.orderbyphoneno + "&msg=" + sParameter;
           
      var options = {
        host: 'smsapi.mybluemix.net',
        port: 80,
        path: smspath,
        };

        http.request(options, function(res) {
            console.log('STATUS: ' + res.statusCode);
            console.log('HEADERS: ' + JSON.stringify(res.headers));
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                console.log('BODY: ' + chunk);
            });
        }).end();
        
            //Send a Push notification to Vendor         
        Vendor.find({'emailid': order.orderto}).exec(function (err, vendors) {
		    if (err) {
		     console.log("could not fetch device Id");
		    } else {
		    	
		    	var deviceid = vendors[0].deviceid;
		    	var pushpath  = "/push.php?deviceId=" + deviceid + "&message=" + sParameter + "&auth=YG2O80B1Q99s6tQaMlR4RA2f0o3q5LnO";  
		    	
		    	console.log(deviceid  + "-------->>>" + pushpath);
		        var pushOptions = {
		        host: 'smsapi.mybluemix.net',
		        port: 80,
		        path: pushpath,
		        };        
		
		        http.request(pushOptions, function(res) {
		            console.log('STATUS: ' + res.statusCode);
		            console.log('HEADERS: ' + JSON.stringify(res.headers));
		            res.setEncoding('utf8');
		            res.on('data', function (chunk) {
		                console.log('BODY: ' + chunk);
		            });
		        }).end();
		    }
		});
        
        
    }
  });
};

exports.updateOrder = function (req, res) {
   Order.update({ "_id": req.body.id }, { $set: { "status": req.body.status}}, function (err, order) {
    if (err) {
      return res.status(400).send({
        message: "Internal Error"
      });
    } else {
      res.json(order);
    }
  });
};


exports.deleteOrder= function (req, res) {
 Order.remove().exec();
};*/

exports.getIndustries = function (req, res) {
    console.log('********** GET INDUSTRIES ********** ' + typeof req.query.activeOnly);
    if(typeof req.query.activeOnly !== undefined && req.query.activeOnly === 'true')
    {
        Industries.find({isActive: true}).exec(function (err, industries) {
            if (err) {
                return res.status(400).send({
                    message: "Internal Error"
                });
            } else {
                console.log("Number of industries: " + industries.length);
                res.json(industries);
            }
        });
    } else if(req.query.activeOnly === 'false' || !req.query.activeOnly) {
        Industries.find().exec(function (err, industries) {
            if (err) {
                return res.status(400).send({
                    message: "Internal Error"
                });
            } else {
                console.log("Number of industries: " + industries.length);
                res.json(industries);
            }
        });
    }
};

exports.activateIndustry = function (req, res) {
    if (req.query.id !== '') {
        Industries.update({ name: req.query.store.toString() }, { $set: { isActive: true}}, function (err, industry) {
            if (err) {
                return res.status(400).send({
                    message: "Internal Error"
                });
            } else {
                res.json(industry);
            }
        });
    } else {
        return res.status(404).send({
            message: "Store not found"
        });
    }
};

exports.deactivateIndustry = function (req, res) {
    if (req.query.id !== '') {
        Industries.update({ name: req.query.store.toString() }, { $set: { isActive: false}}, function (err, industry) {
            if (err) {
                return res.status(400).send({
                    message: "Internal Error"
                });
            } else {
                res.json(industry);
            }
        });
    } else {
        return res.status(404).send({
            message: "Store not found"
        });
    }
};

exports.addIndustry = function (req, res) {
    Industries.find({ name: req.body.name}).exec(function (err, industries) {
        if (err) {
            return res.status(400).send({
                message: "Internal Error"
            });
        } else {
            if (industries.length > 0) {
                res.send("Store already exist");
            } else {
                var store = new Industries(req.body);
                console.log(req.body);
                if (!req.body.name) {
                    res.send("Store must have a name");
                } else if (!req.body.logoUrl) {
                    res.send("Store must have a logo");
                } else if (!req.body.themeUrl) {
                    res.send("Store must have a theme");
                } else {
                    store.save(function (err) {
                        if(err) {
                            return res.status(400).send({
                                message: "Internal Error"
                            });
                        } else {
                            res.json(store);
                        }
                    });
                }
            }
        }
    });
};

exports.getProducts = function (req, res) {
    console.log('********** GET PRODUCTS ********** ' + req.params.storeId);
    if (!!req.params.storeId) {
        Products.find().exec(function (err, products) {
            var filteredProducts = [], productsResponse;
            products.forEach(function (val) {
                if (val.stores.indexOf(req.params.storeId) !== -1) {
                    filteredProducts.push(val)
                }
            });

            productsResponse = {
                products: products
            };
            res.json(productsResponse);
        });
    } else {
        return res.status(500).send({
            message: "Cannot find the industry"
        });
    }
};
