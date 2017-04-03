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
        type: Number,
        required: true,
        default: 0
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
    type: Number,
      required: true,
      default: 0
  },
  name: {
      type: String,
      default: '',
      required: true
  },
    subIndustries: {
      type: Array,
        default: [],
        required: true
    },
    logoUrl: {
      type: String,
        default: '',
        required: true
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

var Employee = mongoose.model('Employee', EmployeeSchema);
var Industries = mongoose.model('Industries', IndustriesSchema);

StoreSchema.plugin(autoIncrement.plugin, {
  model: 'Store',
    field: 'id',
    startAt: 1,
    incrementBy: 1
});

IndustriesSchema.plugin(autoIncrement.plugin, {
    model: 'Industries',
    field: 'id',
    startAt: 1,
    incrementBy: 1
});

var Store = mongoose.model('Stores', StoreSchema);
