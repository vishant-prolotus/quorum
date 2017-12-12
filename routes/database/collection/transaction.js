var mongoose = require('mongoose');
var url=require('../../config').database;

var mongooseObj=mongoose.createConnection(url);
var schema=new mongoose.Schema({
    name:String,
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    type:String,
    address:String,
    Status:Boolean,
    Notes:String,
    telephone:String,
    account_no:String
});

var collection=mongooseObj.model('transaction',schema);



mongooseObj.on('open',function(){
    console.log('Mongo connected');
})
module.exports=mongooseObj.model('transaction',schema)
