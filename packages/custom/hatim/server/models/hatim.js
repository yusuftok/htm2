'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CuzSchema =  new Schema({
    cuzId: {type:Number, required:'Cüz numarası boş olamaz!', min:1, max:30},
    readingUser: {  type: Schema.ObjectId, ref: 'User', required:false},
    completed:{type:Boolean, default: false, required:true}
});
/**
 * Hatim Schema
 */
var HatimSchema = new Schema({
    dateCreated: {
        type: Date,
        default: Date.now
    },

    dedicatedTo: {
        type: String,
        required: 'İthaf edilen alanı boş olamaz!',
        trim: true
    },

    organizingUser: {
        type: Schema.ObjectId,
        ref: 'User',
        required: true
    },

    cuzes: [CuzSchema],

    completed:{type:Boolean, default: false, required:true},

    dateCompleted: {
        type: Date
    }
});

/**
 * Validations
 */
//HatimSchema.path('cuzes.cuzId').validate(function (id1) {
//    return !!id1;
//}, 'İthaf edilen alanı boş olamaz!');


/**
 * Statics
 */
HatimSchema.statics.load = function (id, cb) {
    this.findOne({
        _id: id
    }).populate('dedicatedUser', 'name username').populate('organizingUser','name username').populate({
        path: 'cuzes.readingUser',
        model: 'User'
    }).exec(cb);



};

//HatimSchema.statics.loadCuz = function (id, cuzId, cb) {
//    this.findOne({
//        _id: id
//    }).exec(cb);
//
//};

mongoose.model('Cuz', CuzSchema);
mongoose.model('Hatim', HatimSchema);
