'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
    autoIncrement = require('mongoose-auto-increment');
  
function sequenceGenerator(name){
  var SequenceSchema, Sequence;

  SequenceSchema = new mongoose.Schema({
    nextSeqNumber: { type: Number, default: 1 }
  });

  Sequence = mongoose.model(name + 'Seq', SequenceSchema);

  return {
    next: function(callback){
      Sequence.find(function(err, data){
        if(err){ throw(err); }

        if(data.length < 1){
          // create if doesn't exist create and return first
          Sequence.create({}, function(err, seq){
            if(err) { throw(err); }
            callback(seq.nextSeqNumber);
          });
        } else {
          // update sequence and return next
          Sequence.findByIdAndUpdate(data[0]._id, { $inc: { nextSeqNumber: 1 } }, function(err, seq){
            if(err) { throw(err); }
            callback(seq.nextSeqNumber);
          });
        }
      });
    }
  };
}

var sequence = sequenceGenerator('todo');

  
var EmployeeSchema = new Schema({
  name: {
    type: String,
    default: ''
  },
  phonenumber: Number,
  emailid: String, 
  role: {
  	 type: String,
     default: 'Employee'
  },
  location:{
  	type: String,
    default: 'PDC1'
  },
   deviceid: {
    type: String,
    default: ''
  }
});

var IndustriesSchema = new Schema({
    id: {
        type: Number
    },
    name: {
        type: String,
        default: ''
    },
    subIndustries: {
        type: Array,
        default: []
    },
    logoUrl: {
        type: String,
        default: ''
    },
    themeUrl: {
        type: String,
        default: ''
    },
    description: {
        type: String,
        default: ''
    },
    level: {
        type: String,
        default: '1'
    },
    isActive: {
        type: Boolean,
        default: true
    }
});

var StoreSchema = new Schema({
  id: {
    type: Number
  },
  name: {
      type: String,
      default: ''
  },
    subIndustries: {
      type: Array,
        default: []
    },
    logoUrl: {
      type: String,
        default: ''
    },
    themeUrl: {
      type: String,
        default: ''
    },
    description: {
      type: String,
        default: ''
    },
    level: {
      type: String,
        default: '1'
    },
    isActive: {
      type: Boolean,
        default: true
    }
});

var MenuItemSchema = new Schema({
 itemname: String,
 category: String,
 rate: Number,
 quantity: {
  	 type: Number,
     default: 0
  }
});


var VendorSchema = new Schema({
  name: {
    type: String,
    default: ''
  },
  phonenumber: Number,
  emailid: String, 
  role: {
  	 type: String,
     default: 'Vendor'
  },
  location:{
  	type: String,
    default: 'PDC1'
  },
  imgname: String,  
  deviceid: {
    type: String,
    default: ''
  }, 
  menu: [MenuItemSchema]
});


var OrderSchema = new Schema({
  ordernumber: {type: Number},
  orderto: String,
  orderby: String,
  ordertoname: String,
  orderbyname: String,
  ordertophoneno: Number,
  orderbyphoneno: Number,
  totalCost: Number,
  ordertime: { type: Date, default: Date.now },
  ordereditems: [MenuItemSchema],
  status: {
  	type: String,
  	default: 'Order in Queue'
  }
  
});

OrderSchema.pre('save', function(next) {
    var doc = this;
       sequence.next(function(nextSeq){
       doc.ordernumber = nextSeq;
    next();
  });
});

var Employee = mongoose.model('Employee', EmployeeSchema);
var Vendor  = mongoose.model('Vendor', VendorSchema);
var Order = mongoose.model('Order', OrderSchema);
var Industries = mongoose.model('Industries', IndustriesSchema);

StoreSchema.plugin(autoIncrement.plugin, {
  model: 'Store',
    field: 'id',
    incrementBy: 1
});
var Store = mongoose.model('Stores', StoreSchema);
