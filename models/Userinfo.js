var mongoose = require('mongoose');
var Schema = mongoose.Schema;
if (mongoose.connection.readyState === 0) {
  mongoose.connect(require('./connection-string'));
}


var newSchema = new Schema({
  'contactPerson': { type: String },
  'companyName': { type: String },
  'city': { type: String },
  'email': { type: String },
  'mobile': { type: String },
  'trialDays': { type: String },
  'packageStatus': { type: String, default: "pending" },
  'isTrial': { type: Boolean, default: true },
  'subscription_Start': { type: Date },
  'subscription_End': { type: Date },
  "DayLeft": {type:Number},
  'subscription': { type: String, default: "pending" },
  'createdAt': { type: Date, default: Date.now },
  'updatedAt': { type: Date, default: Date.now }
});

newSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

newSchema.pre('update', function () {
  this.update({}, { $set: { updatedAt: Date.now() } });
});

newSchema.pre('findOneAndUpdate', function () {
  this.update({}, { $set: { updatedAt: Date.now() } });
});



module.exports = mongoose.model('Userinfo', newSchema);
