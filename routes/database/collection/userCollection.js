var mongoose = require('mongoose');
//mongoose.Promise = require('bluebird');
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

var collection=mongooseObj.model('users',schema);

// var newUser = collection({
//     name: 'Peter Quill',
//     username: 'starlord55',
//     password: 'password',
//     email:"testststs@gmail.com",
//     type: 'bank'
//   });
//   console.log(newUser);
//   // save the user
//   newUser.save(function(err,result) {
//       console.log('success');
//     if (err){
//         console.log('in error');
//         console.log(err);
//     }else{
//         console.log('In result');
//         console.log(result);
//         console.log('User created!');
//     }
  
    
//   });
// console.log('4222');
// console.log(collection);
// collection.find({}, function(err, users) {
//     if (err) throw err;
  
//     // object of all the users
//     console.log(users);
//   });

// collection.findById("5a16b1c2945c4e60db2076a9", function (err, tank) {
// console.log(tank);
//   });

mongooseObj.on('open',function(){
    console.log('Mongo connected');
})
//module.exports=collection
module.exports=mongooseObj.model('users',schema)
