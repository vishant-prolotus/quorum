var express = require('express');
var router = express.Router();
const config = require('./config.js');
var moment = require('moment');
var Web3 = require('web3-quorum');
var md5 = require('md5');
var randomstring = require("randomstring");
var nodemailer = require('nodemailer');
var abi = [{"constant":false,"inputs":[{"name":"_transactionID","type":"uint256"},{"name":"_sendindBankID","type":"uint256"},{"name":"_sendindBankAcc","type":"uint256"},{"name":"_sendindBankAHID","type":"uint256"},{"name":"_receivindBankID","type":"uint256"},{"name":"_receivindBankAcc","type":"uint256"},{"name":"_txnType","type":"string"},{"name":"_txnAmount","type":"uint256"},{"name":"_txnDate","type":"string"},{"name":"_userID","type":"uint256"}],"name":"sendValue","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"_contractAddress","type":"address"}],"name":"setTransactionListAddress","outputs":[],"type":"function"},{"constant":true,"inputs":[],"name":"isRegulatorNode","outputs":[{"name":"","type":"bool"}],"type":"function"},{"constant":true,"inputs":[],"name":"TransactionListAddress","outputs":[{"name":"","type":"address"}],"type":"function"},{"constant":true,"inputs":[],"name":"thisBankContract","outputs":[{"name":"","type":"address"}],"type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"bankTransactions","outputs":[{"name":"transactionID","type":"uint256"},{"name":"sendindBankID","type":"uint256"},{"name":"sendindBankAcc","type":"uint256"},{"name":"sendindBankAHID","type":"uint256"},{"name":"receivindBankID","type":"uint256"},{"name":"receivindBankAcc","type":"uint256"},{"name":"txnType","type":"string"},{"name":"txnAmount","type":"uint256"},{"name":"txnDate","type":"string"},{"name":"txnStatus","type":"string"},{"name":"senderContract","type":"address"},{"name":"userID","type":"uint256"}],"type":"function"},{"constant":false,"inputs":[{"name":"_thisBankContract","type":"address"}],"name":"setThisBankContract","outputs":[],"type":"function"},{"constant":false,"inputs":[],"name":"setRegulatorNode","outputs":[],"type":"function"},{"constant":true,"inputs":[],"name":"totalTransactions","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"transactionIDs","outputs":[{"name":"","type":"bytes32"}],"type":"function"},{"constant":true,"inputs":[],"name":"regulator","outputs":[{"name":"","type":"address"}],"type":"function"},{"inputs":[],"type":"constructor"}]
var abitr = [{"constant":true,"inputs":[{"name":"_transactionID","type":"bytes32"}],"name":"getTransactionExistance","outputs":[{"name":"","type":"bool"}],"type":"function"},{"constant":false,"inputs":[{"name":"_suspiciousAmount","type":"uint256"}],"name":"setSuspiciousLimit","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"_name","type":"string"},{"name":"_contract","type":"address"},{"name":"_sender","type":"address"}],"name":"addBank","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"_contract","type":"address"}],"name":"blockBank","outputs":[],"type":"function"},{"constant":true,"inputs":[{"name":"_contract","type":"address"}],"name":"getBankExistance","outputs":[{"name":"","type":"bool"}],"type":"function"},{"constant":true,"inputs":[{"name":"_transactionID","type":"bytes32"}],"name":"getTransactionTimestamp","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[{"name":"_contract","type":"address"}],"name":"getBankSender","outputs":[{"name":"","type":"address"}],"type":"function"},{"constant":true,"inputs":[],"name":"getSuspiciousLimit","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"transactions","outputs":[{"name":"exists","type":"bool"},{"name":"timestamp","type":"uint256"},{"name":"blocked","type":"bool"}],"type":"function"},{"constant":false,"inputs":[{"name":"_contract","type":"address"}],"name":"authorizeBank","outputs":[],"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"banks","outputs":[{"name":"name","type":"string"},{"name":"authorized","type":"bool"},{"name":"exists","type":"bool"},{"name":"authorizedSender","type":"address"}],"type":"function"},{"constant":true,"inputs":[{"name":"_contract","type":"address"}],"name":"getBankState","outputs":[{"name":"","type":"bool"}],"type":"function"},{"constant":true,"inputs":[{"name":"_accountNumber","type":"uint256"}],"name":"isSuspiciousAccount","outputs":[{"name":"","type":"bool"}],"type":"function"},{"constant":false,"inputs":[{"name":"_transactionID","type":"bytes32"}],"name":"addTransaction","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"_accountNumber","type":"uint256"}],"name":"addSuspiciousAccounts","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"_transactionID","type":"bytes32"}],"name":"unblockTransaction","outputs":[],"type":"function"},{"constant":true,"inputs":[],"name":"suspiciousLimit","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[{"name":"_transactionID","type":"bytes32"}],"name":"getTransactionState","outputs":[{"name":"","type":"bool"}],"type":"function"},{"constant":true,"inputs":[],"name":"regulator","outputs":[{"name":"","type":"address"}],"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"suspiciousAccounts","outputs":[{"name":"","type":"bool"}],"type":"function"},{"constant":false,"inputs":[{"name":"_transactionID","type":"bytes32"}],"name":"blockTransaction","outputs":[],"type":"function"},{"constant":true,"inputs":[],"name":"getRegulator","outputs":[{"name":"","type":"address"}],"type":"function"},{"inputs":[],"type":"constructor"}]

var blackListAccount=['0xc8f717ba9593dc9d45c4518cf444d2cbd08af24d'];
/* File upload*/

/* Dom manipulation */

const cheerio = require('cheerio');

var totalReadLines=0;
var totalDocumentLines=0;
var linesRead = 0;
var blockChainIds=[];
var Multer = require('multer');
var Parse = require('csv-parse');
var fs = require('fs');

/* end file upload */


var userCollection = require('./database/collection/userCollection');
//Web3Obj=new Web3();
//console.log(Web3Obj);
/***  ***/
// *** database ***/
// Mongo db
var db;
const MongoClient = require('mongodb').MongoClient
var databaseUrl = config.database;
MongoClient.connect(databaseUrl, (err, database) => {
    if (err) {
        console.log(err);
    } else if (database) {
        db = database;
        console.log("Database connected");
    }
})

router.get('/', function (req, res, next) {
    res.render("signIn.ejs");
});
router.get('/signIn', function (req, res, next) {
    res.redirect("/");
});

router.post('/signIn', function (req, res, next) {
    req.assert('email', 'Email is required').notEmpty();
    req.assert('email', 'A valid email is required').isEmail();
    req.assert('password', 'Password is required').notEmpty();
    var errors = req.validationErrors();
    if (errors) {
        console.log(errors);
        res.render("signIn.ejs", {
            errors: errors
        });
    } else {
        var query = { email: req.body.email, password: md5(req.body.password) };
        db.collection("users").find(query).toArray(function (err, result) {
            if (err) {
            } else if (result.length > 0) {
                console.log(result[0])
                req.session.user = result[0];
                if (req.session.user.type == 'admin') {
                    res.redirect('/dashboard');
                }else if(req.session.user.type=='regulator'){
                    res.redirect('/dashboard');
                } else {
                    res.redirect('/dashboard');
                }
            } else {
                req.flash('error', 'Invalid Credentials');
                res.render("signIn.ejs", {
                    error: req.flash('error')
                });
            }
        });
    }


});
router.get('/signUp', function (req, res, next) {
    res.render("signUp.ejs", {})
});
router.post('/signUp', function (req, res, next) {
    req.assert('email', 'Email is required').notEmpty();
    req.assert('email', 'A valid email is required').isEmail();
    req.assert('name', 'Name is required').notEmpty();
    req.assert('password', 'Password is required').notEmpty();
    var errors = req.validationErrors();
    if (errors) {
        console.log(errors);
        res.render("signUp.ejs", {
            errors: errors
        });
    } else {
        var data = req.body;
        var user = {};
        user.name = data.name;
        user.email = data.email;
        user.password = md5(data.password);
        user.address = "";
        user.status = 0;
        user.type = '';
        user.notes = '';
        user.telephone = '';


        db.collection("users").insertOne(user, function (err, res) {
            if (err) {
                console.log(err);
            } else if (res) {
                //console.log(res);
                console.log("User has been inserted");
            }
        });
        res.redirect("/")
    }
});

router.get('/forgot-password', function (req, res, next) {
    res.render("forgot-password.ejs", { output: {} })
});
router.get('/logout', function (req, res, next) {
    req.session.destroy();
    res.render("logout.ejs", { output: {} })
});

router.use(function(req,res,next){
    if(!req.session.user){
        res.redirect("/");
    }else{
        next();
    }
})

router.get('/dashboard', function (req, res, next) {
    var redError=0;
    var greenError=0;
    console.log(Math.floor(Date.now() / 1000));
    if (!req.session.user) {
        res.redirect("/")
    } else {
        var data = {};
        data.name = req.session.user.name;
        data.userType = req.session.user.type;
        data.address = req.session.user.address;
        graphValue={};
        graphValue.labels=[];
        graphValue.dataSet=[];
        data.graphValue
        var web3 = new Web3(new Web3.providers.HttpProvider(getHttp(data.name)));
        var Contract = web3.eth.contract(abi).at(data.address);
        if(req.session.user.type=='bank'){
            data.totalTransactions=Contract.totalTransactions().c[0];
        }else{
            data.totalTransactions="";
        }
        if(req.session.user.type=='regulator' || req.session.user.type=='admin') {
            db.collection("transactions").find({}).sort({$natural:-1}).toArray(function (err, result) {
                if (err) {
                    console.log(err);
                } else {
                    data.transactions = result;
                    data.transactionsList = result;
                    result.forEach(function(i,j){
                    if(i.status=='RED'){
                      redError++  
                    }else if(i.status=='GREEN'){
                      greenError++;
                    }
                    })
                 
                    data.redError=redError;
                    data.greenError=greenError;

                    db.collection("transactions").aggregate(
                        [
                           
                            {
                                $group : {
                                   _id : "$transaction_date" ,
                                   count: { $sum: 1 }
                                }
                              }
                        ]
                      ).toArray(function(errm,resultm){
                          if(errm){
                              console.log(errm);
                          }else{
                                resultm.forEach(function(i,j){
                                    graphValue.labels.push(new Date(i._id).getDate().toString());
                                    graphValue.dataSet.push(i.count);
        
                                });
                                  graphValue.labels=graphValue.labels;
                                  data.graphValue=graphValue;
                              res.render("dashboard.ejs", { output: data })
                          }
                      })

                }
            });
        }else{
            db.collection("transactions").find({ $or: [ {"sending_bank_name": req.session.user.name}, {"receiving_bank_name":req.session.user.name}]}).sort({$natural:-1}).toArray(function (err, result) {
                if (err) {
                    console.log(err);
                } else {
                    data.transactions = result;
                    data.transactionsList = result;
                    result.forEach(function(i,j){
                        if(i.status=='RED'){
                          redError++  
                        }else if(i.status=='GREEN'){
                          greenError++;
                        }
                        })
                        data.redError=redError;
                        data.greenError=greenError;

                        db.collection("transactions").aggregate(
                            [
                                { $match : { $or: [ {"sending_bank_name": req.session.user.name}, {"receiving_bank_name":req.session.user.name}]}},
                                {
                                    $group : {
                                       _id : "$transaction_date" ,
                                       count: { $sum: 1 }
                                    }
                                  }
                            ]
                          ).toArray(function(errm,resultm){
                              if(errm){
                                  console.log(errm);
                              }else{
                                    resultm.forEach(function(i,j){
                                        graphValue.labels.push(new Date(i._id).getDate().toString());
                                        graphValue.dataSet.push(i.count);
                                    });
                                      graphValue.labels=graphValue.labels;
                                      data.graphValue=graphValue;
                                  res.render("dashboard.ejs", { output: data })
                              }
                          })
                }
            });
        }
    }
});


router.get('/admin', function (req, res, next) {
    if (!req.session.user) {
        res.redirect("/")
    } else {
        var data = {};
        var query = { "type": "bank" };
        db.collection("users").find(query).toArray(function (err, result) {
            if (err) {
                console.log(err);
            } else {
                //console.log(result);
                data.name = req.session.user.name;
                data.userType = req.session.user.type;

                result.forEach(function (i, j) {
                    //result[j].encodeId=window.atob(result[j]._id);
                })
                data.bankList = result;
                console.log(data);
                db.collection("transactions").find({}).sort({$natural:-1}).toArray(function (err, result) {
                    if (err) {
                        console.log(err);
                    } else {
                        data.transactions = result;
                        res.render("admin.ejs", { output: data });
                    }
                });
            }
        });
    }
});
router.get('/regulator', function (req, res, next) {
    if (!req.session.user) {
        res.redirect("/")
    } else {
        var data = {};
        var query = { "type": "bank" };
        db.collection("users").find(query).toArray(function (err, result) {
            if (err) {
                console.log(err);
            } else {
                //console.log(result);
                data.name = req.session.user.name;
                data.userType = req.session.user.type;

                result.forEach(function (i, j) {
                    //result[j].encodeId=window.atob(result[j]._id);
                })
                data.bankList = result;
                res.render("regulator_dashboard.ejs", { output: data })
            }
        });
    }
});

router.get('/addBank', function (req, res, next) {
    if (!req.session.user || req.session.user.type != 'admin') {
        res.redirect("/")
    } else {
        var data = {};
        data.name = req.session.user.name;
        data.userType = req.session.user.type;
        res.render("addBank.ejs", { output: data })
    }

});

router.post('/addBank', function (req, res, next) {
    req.assert('name', 'Name is required').notEmpty();
    req.assert('email', 'Email is required').notEmpty();
    req.assert('email', 'A valid email is required').isEmail();
    //req.assert('address', 'Address is required').notEmpty();
    req.assert('telephone', 'Telephone is required').notEmpty();
    //console.log(req.body);
    var errors = req.validationErrors();
    if (errors) {
        console.log(errors);
        res.render("addBank.ejs", {
            errors: errors
        });
    } else {
        var user = {};
        user.name = req.body.name;
        user.email = req.body.email;
        user.address = req.body.address;
        user.status = req.body.status;
        user.type = req.body.type;
        user.notes = req.body.notes;
        user.telephone = req.body.telephone;
        var password = req.body.password;
        user.account_no = req.body.account_no;
        user.password = md5(password);
        user.bank_id=Math.floor(Date.now() / 1000);
        db.collection("users").insertOne(user, function (err, result) {
            if (err) {
                console.log(err);
            } else if (result) {

                req.flash('success_msg', 'Bank has been added');
                res.redirect("/banks");
                // res.render("addBank.ejs", {
                //     success_msg: "Bank has been added"
                // });
            }
        });

    }

});

router.get('/transfer', function (req, res, next) {

    if (!req.session.user || req.session.user.type != 'bank') {
        res.redirect("/")
    } else {
        var date = new Date();
        var transactionId = date.getTime();

        var sessionObject = req.session.user;

        var query = { id: sessionObject._id };
        db.collection("users").find(query).toArray(function (err, result) {
            if (err) {
                console.log(err);
            } else {
                var bankListQr = { type: "bank" };
                db.collection("users").find(bankListQr).toArray(function (errB, resultB) {
                    if (errB) {
                        console.log(errB);
                    } else {
                        resultB.forEach(function (i, j) {
                            if (resultB[j]._id == sessionObject._id) {
                                resultB.splice(j, 1);
                            }
                        })
                        db.collection("transactions").count(function (errC, resultC) {
                            if (errC) {
                                console.log(errC);
                            } else {
                                var data = {};
                                data.name = req.session.user.name;
                                data.address = req.session.user.address;
                                data.userType = req.session.user.type;
                                data.bankId = req.session.user.unique_id;
                                data.unique_id=req.session.user.unique_id;
                                data.transactionId = resultC + 5032489;
                                data.bankList = resultB;
                                //console.log(data);
                                data.currentDate = moment().format("DD-MM-YYYY  HH:mm");  
                                data.now=moment().format("YYYY-MM-DD");
                                data.Tomorrow=moment().add(1, 'days').format("YYYY-MM-DD");
                                data.In2Days=moment().add(2, 'days').format("YYYY-MM-DD");
                                data.NextWeek=moment().add(7, 'days').format("YYYY-MM-DD");
                                res.render("transfer.ejs", { output: data })
                            }
                        })

                    }
                });

            }

        });


    }

});


router.post('/transfer', function (req, res, next) {
    console.log("/transfer 316");
    if (!req.session.user) {
        res.redirect("/")
    } else {

        req.assert('transaction_type', 'Transaction type is required').notEmpty();
        req.assert('sending_bank_acc_no', 'Sending Bank Account Number is required').notEmpty();
        req.assert('receiving_bank_name', 'Receiving Bank Name is required').notEmpty();
        req.assert('receiving_bank_acc_no', 'Receiving Bank Account Number is required').notEmpty();
        req.assert('transaction_amt', 'Transaction Amount is required').notEmpty();
        req.assert('transaction_id', 'Sending Bank id is required').notEmpty();
        req.assert('sending_bank_id', "Sending bank id is required")
        var errors = req.validationErrors();
        if (errors) {
            req.flash('errors', errors);
            res.redirect('/transfer');
        } else {
            // TransferMoney
            //TransferMoney(req.body.sending_bank_name, req.body.sending_bank_acc_no, req.body.receiving_bank_acc_no, req.body.transaction_amt,req.body).then(function (response, error) {
            TransferMoney(req.body).then(function (response, error) {
                if (error) {
                    console.log('errors');
                    console.log(error);
                    req.flash('errors', error);
                    res.redirect('/transfer');
                } else {
                    var sessionObject = req.session.user;
                    var postData = req.body;
                    var transactionData = {};
                    transactionData.nature_of_transaction=req.body.nature_of_transaction;
                    transactionData.sending_bank_name=req.body.sending_bank_name
                    transactionData.sending_bank_acc_no = postData.sending_bank_acc_no;
                    transactionData.receiving_bank_name = postData.receiving_bank_name;
                    transactionData.receiving_bank_acc_no = postData.receiving_bank_acc_no;
                    transactionData.amount = postData.transaction_amt;
                    transactionData.transaction_type = postData.transaction_type;
                    transactionData.transaction_date = postData.transaction_date;
                    transactionData.notes = postData.notes;
                    transactionData.transaction_id = postData.transaction_id;
                    transactionData.sending_bank_id = sessionObject._id;
                    transactionData.blockchain_tx_id=response.blockchain_tx_id;
                    transactionData.blockchain_tx_id_hash=response.blockchain_tx_id_hash;
                    transactionData.status=response.status;
                
                    transactionData.send_value = response.one;
                    transactionData.add_transaction = response.two;
                    transactionData.cnfrm_transaction = response.three;
                    transactionData.balance = response.four;

                    db.collection("transactions").insertOne(transactionData, function (err, result) {
                        if (err) {
                            console.log(err);
                        } else {
                           // console.log("Transaction has been done");
                            //req.flash('success_msg', 'Transaction has been done');
                            //res.redirect('/transactions');
                            
                            req.flash('transactionsList',transactionData);
                            console.log('3688')
                            console.log(req.flash('transactionsList'));
                            req.flash('success_msg', 'Transaction has been done');
                            res.redirect('/confirm_transactions?id='+transactionData.blockchain_tx_id);
                        }
                    });
                }
            })
        }
    }
});


router.post('/getBankAccount', function (req, res, next) {
    var query = { name: req.body.name };
    db.collection("users").find(query).toArray(function (err, result) {
        if (err) {
            console.log(err);
        } else {
            if (result.length > 0) {
                var data={};
                data.address=result[0].address;
                data.id=result[0].unique_id;
                res.send(data);
            } else {
                res.send('');
            }
        }
    });
});

router.get('/banks', function (req, res, next) {
    if (!req.session.user || req.session.user.type == 'bank') {
        res.redirect('/');
    } else {
        var data = {};
        if(req.session.user.type=='admin'){
            var query = {};
        }else{
            var query = { "type": "bank" };
        }
        
        db.collection("users").find(query).toArray(function (err, result) {
            if (err) {
                console.log(err);
            } else {
                data.name = req.session.user.name;
                data.userType = req.session.user.type;

                result.forEach(function (i, j) {
                    if(result[j].type=='admin'){
                        result.splice(j, 1);
                    }
                })
                data.bankList = result;
                //console.log(data);
                res.render("banks.ejs", { output: data })
            }
        });
    }
});
  

router.post('/suspiciouslimit', function (req, res, next) {
    console.log(req.body.limit);
    if (!req.session.user) {
        res.redirect("/")
    } else {
        var web3 = new Web3(new Web3.providers.HttpProvider(getHttp('observer')));
        var Contractor = web3.eth.contract(abitr).at("0x4df0f115551f6f36d753dc0ecf6832715bdd7001");
        var value = parseInt(req.body.limit);
        console.log(value+'value');
        setTimeout(function(){
            Contractor.setSuspiciousLimit(value,{from:web3.eth.coinbase, gas: 500000 },function(err,response) {
                if(err) {
                    console.log(err);
                }else{
                    res.redirect('/dashboard');
                }
            });
        },4000);
    }
});

router.get('/suspiciouslimit', function (req, res, next) {
    if (!req.session.user) {
        res.redirect('/');
    } else {
    var data = {};
    var query = { "type": "bank" };
    db.collection("users").find(query).toArray(function (err, result) {
        if (err) {
            console.log(err);
        } else {
            //console.log(result);
            data.name = req.session.user.name;
            data.userType = req.session.user.type;

            result.forEach(function (i, j) {
                //result[j].encodeId=window.atob(result[j]._id);
            })
            data.bankList = result;
            console.log(data);
            db.collection("transactions").find({}).sort({$natural:-1}).toArray(function (err, result) {
                if (err) {
                    console.log(err);
                } else {
                    data.transactions = result;
                    res.render("suspiciouslimit.ejs", { output: data });
                }
            });
        }
    });
}
});

router.get('/suspiciousaccount', function (req, res, next) {
    if (!req.session.user) {
        res.redirect('/');
    } else {
    var data = {};
    var query = { "type": "bank" };
    db.collection("users").find(query).toArray(function (err, result) {
        if (err) {
            console.log(err);
        } else {
            //console.log(result);
            data.name = req.session.user.name;
            data.userType = req.session.user.type;

            result.forEach(function (i, j) {
                //result[j].encodeId=window.atob(result[j]._id);
            })
            data.bankList = result;
            console.log(data);
            db.collection("transactions").find({}).sort({$natural:-1}).toArray(function (err, result) {
                if (err) {
                    console.log(err);
                } else {
                    data.transactions = result;
                    res.render("suspiciousAccount.ejs", { output: data });
                }
            });
        }
    });
}
});

router.post('/suspiciousaccount', function (req, res, next) {
    console.log(req.body.account_no);
    if (!req.session.user) {
        res.redirect("/")
    } else {
        var web3 = new Web3(new Web3.providers.HttpProvider(getHttp('observer')));
        var Contractor = web3.eth.contract(abitr).at("0x4df0f115551f6f36d753dc0ecf6832715bdd7001");
        var value = parseInt(req.body.account_no);
        setTimeout(function(){
            Contractor.addSuspiciousAccounts(value,{from:web3.eth.coinbase, gas: 500000 },function(err,response) {
                if(err) {
                    console.log(err);
                }else{
                    res.redirect('/dashboard');
                }
            });
        },4000);
    }
});

router.get('/editBank', function (req, res, next) {
    if (!req.session.user) {
        res.redirect("/")
    } else {
        var data = {};
        var bankDetail = {};
        data.name = req.session.user.name;
        data.userType = req.session.user.type;
        //console.log(data);
        var query = { name: req.query.name };
        db.collection("users").find(query).toArray(function (err, result) {
            if (err) {
                console.log(err);
            } else if (result.length > 0) {
                data.bankDetail = result[0];
            }
            res.render("editBank.ejs", { output: data, bankDetail: result[0] })

        });
    }
})

router.post('/editBank', function (req, res, next) {
    req.assert('name', 'Name is required').notEmpty();
    req.assert('email', 'Email is required').notEmpty();
    req.assert('email', 'A valid email is required').isEmail();
   // req.assert('address', 'Address is required').notEmpty();
    req.assert('telephone', 'Telephone is required').notEmpty();
    //console.log(req.body);
    var errors = req.validationErrors();
    if (errors) {
        console.log(errors);
        // res.render("editBank.ejs", {
        // errors: errors
        // });
    } else {
        //console.log(req.body);
        var user = {};
        var query = { name: req.body.name };
        user.name = req.body.name;
        user.email = req.body.email;
        user.address = req.body.address;
        user.status = req.body.status;
        user.type = req.body.type;
        user.notes = req.body.notes;
        user.telephone = req.body.telephone;
        user.account_no = req.body.account_no;

        userCollection.findByIdAndUpdate({ '_id': req.body._id }, { $set: user }, function (err, result) {
            if (err) {
                console.log(err);
            } else {
                req.flash('success_msg', 'Bank has been updated');
                res.redirect("/banks");
            }
        });

    }

});

router.get('/transactions', function (req, res, next) {
    if (!req.session.user) {
        res.redirect('/');
    } else {
        var data = {};
        
        if(req.session.user.type=='admin' || req.session.user.type=='regulator'){
            if (req.query.filter != undefined) {
                var query = {"receiving_bank_name": req.query.filter };
            }else{
                var query={};
            }
        }else{
            if (req.query.filter != undefined) {
                var query = { "sending_bank_id": req.session.user._id, "receiving_bank_name": req.query.filter };
            } else {
                    var query = { "sending_bank_id": req.session.user._id };
                
            }
        }
        db.collection("transactions").find(query).sort({$natural:-1}).toArray(function (err, result) {
            if (err) {
                console.log(err);
            } else {
                data.name = req.session.user.name;
                data.userType = req.session.user.type;
                data.transactionsList = result;
                var bankListQr = { type: "bank" };
                db.collection("users").find(bankListQr).toArray(function (errB, resultB) {
                    if (errB) {
                        console.log(errB);
                    } else {
                        resultB.forEach(function (i, j) {
                            if (resultB[j]._id == req.session.user._id) {
                                resultB.splice(j, 1);
                            }
                      
                        })

                        //console.log(resultB);

                        data.bankList = resultB;
                        res.render("transactions.ejs", { output: data })
                    }

                });
            }
        });
    }

});

router.post("/transaction_success",function(req,res,next){
var data={};
data.name = req.session.user.name;
data.userType = req.session.user.type;
res.render("transaction_complete.ejs",{output:data});
});

router.get('/web3/:id/:address',function(req,res,next){
    var web3 = require('web3-quorum');
    //console.log(web3);    
    var data={};
    data.address=req.params.id;
    data.address_account=getHttp(req.params.id);
    //console.log(web3.isConnected());
//web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));
var web3 = new Web3(new Web3.providers.HttpProvider(getHttp(req.params.id)));

console.log("balance="+web3.eth.balance);
data.amount=web3.eth.balance;
var Contract = web3.eth.contract(abi).at(req.params.address);

Contract.balance(function (err3, res3) {
    if (err3) {
        console.log(err3);
        
    } else {
        data.balance = res3.c[0];
        data.id=req.params.id;    
        Contract.totalTransactions(function(err,result){
            if(err){
                console.log(err);
            }else{
                data.total=result;
                res.send(data);
            }  
          });
    }



});
});

router.get('/web/:id/:address',function(req,res,next){
   // var web3 = require('web3');
   // var web3 = new Web3(new Web3.providers.HttpProvider(getHttp(req.params.id)));
    //console.log(web3);
    var web3=require('web3');
    // console.log(web3.modules);
    // console.log(web3.utils);
    //console.log(web3.providers);
    //console.log(new web3.eth.BatchRequest());
    var web3=new Web3(new Web3.providers.HttpProvider(getHttp(req.param.id)));
    //console.log(web3);
    // console.log(web3.modules);
    // console.log(web3.utils);
    //var contract = new web3.eth.Contract(abi, req.params.address);
    //console.log(contract);
    //var batch = new web3.BatchRequest();
    //console.log(batch);

    //console.log(new web3.eth.BatchRequest());
   // console.log(web3.providers);
    
    if(0){


         
    }else{
    console.log('in else')
    

    //console.log(web3.version.node);
    web3.version.getNode(function(error,result){
     if(error){
         console.log(error);
     }else{
         console.log('Result='+result);
     }   
    })
    data={};
    data.address=req.params.address;
    data.node=web3.version.node;
    data.network=web3.version.network;
    data.ethereum=web3.version.ethereum;
    data.currentProvider=web3.currentProvider;
    data.ascii=web3.fromAscii('ethereum');
    data.toDecimal=web3.toDecimal('0x15');
    data.fromDecimal=web3.fromDecimal('21');
    data.isAddress=web3.isAddress(req.params.address);
    data.listening=web3.net.listening;
    data.peerCount=web3.net.peerCount;
    data.defaultAccount=web3.eth.defaultAccount;
    data.defaultBlock=web3.eth.defaultBlock;
    data.syncing=web3.eth.syncing; // false
    data.coinbase=web3.eth.coinbase;
    data.mining=web3.eth.mining;// false
    data.hashrate=web3.eth.hashrate;
    data.gasPrice=web3.eth.gasPrice;
    data.accounts=web3.eth.accounts;
    data.blockNumber=web3.eth.blockNumber;
    data.getBalance=web3.eth.getBalance(req.params.address);
    data.getCode=web3.eth.getCode(req.params.address);
    //data.reciept=web3.eth.getTransactionReceipt(req.params.address);
    //console.log(web3.eth.getBlockTransactionCount("0x407d73d8a49eeb85d32cf465507dd71d507100c1")); // expected 64 char
    //data.getBlockTransactionCount=web3.eth.getBlockTransactionCount(req.params.address); // expected 64 char
    //data.info=web3.eth.getBlock(1);
    //data.isRegister=web3.eth.register("0x407d73d8a49eeb85d32cf465507dd71d507100ca");
    //console.log(web3.eth.defaultAccount);
    //data.wishper=web3.version.whisper;
    if(web3.isConnected()){
        data.connected=true;
    }else{
        data.connected=false;
    }
    console.log('syncing='+web3.eth.syncing);
    web3.eth.isSyncing(function(error, sync){
        if(!error) {
            // stop all app activity
            if(sync === true) {
               // we use `true`, so it stops all filters, but not the web3.eth.syncing polling
               //web3.reset(true);
                console.log('615');
            // show sync info
            } else if(sync) {
               console.log(sync.currentBlock);
               console.log('619');
            // re-gain app operation
            } else {
                console.log('622');
                // run your app init function...
            }
        }else{
            console.log('626');
        }
    });


    res.send('Date');
}
});

router.get('/upload_excel',function(req,res,next){
var data={};
data.list=[];

res.render("upload",{output:data});   
});

router.post("/uploadBulkTransactions",[Multer({dest:'./uploads'}).any(),parseFile],function(req,res,next){
});


router.post('/upload', [Multer({dest:'./uploads'}).any(), parseFile],function(req,res,next){
console.log('675');
});

router.get("/transaction_success",function(req,res,next){
var data={};
data.name = req.session.user.name;
data.userType = req.session.user.type;    
res.render("transaction_success",{output:data});

});

router.get("/confirm_transactions",function(req,res,next){
    var data={};
    data.name = req.session.user.name;
    data.userType = req.session.user.type;    
    var query={blockchain_tx_id: parseInt(req.query.id)};
    console.log('/////////////////////////////////');
    console.log(req.flash('transactionsList'));
    var list=req.flash('transactionsList');
    console.log(list[0]);
    console.log(list[0]);
    console.log(typeof(list));
    console.log("////////////////////////////////");

    db.collection("transactions").find(query).toArray(function (err, result) {
        if (err) {
            console.log(err);
        } else {
            console.log('718')
            console.log(result);
            data.transactionsList = result;
            console.log(data.transactionsList);
            res.render("confirm_transactions",{output:data});
        }
    });
    
    
    });

    router.get("/transactionsDetails",function(req,res,next){
        var id=req.query.request;
        var query={blockchain_tx_id: parseInt(req.query.request)};
        db.collection("transactions").find(query).toArray(function (err, result) {
            if (err) {
                console.log(err);
            } else {
            res.send(result);
            }
        });
        });

module.exports = router;

TransferMoney = function (transactionData) {
IDbank=transactionData.sending_bank_name;
IDaddress=transactionData.sending_bank_acc_no;
atAddr=transactionData.receiving_bank_acc_no;
amount=transactionData.transaction_amt;
return new Promise(function (resolve, reject) {
var web3 = new Web3(new Web3.providers.HttpProvider(getHttp(IDbank)));
var Contract = web3.eth.contract(abi).at(IDaddress);
var Contractor = web3.eth.contract(abitr).at("0x4df0f115551f6f36d753dc0ecf6832715bdd7001");
var UID = Contract.totalTransactions().c[0];
console.log('UID='+UID);
setTimeout(function(){
transactionData.sending_bank_id=parseInt(transactionData.unique_id);
transactionData.receiving_bank_id=parseInt(transactionData.receiving_bank_id);
console.log('713');
console.log(transactionData);
console.log('715');
console.log('jbfjvbdjfbvhjbv');
console.log(web3.eth.coinbase);
Contract.sendValue(transactionData.transaction_id,transactionData.sending_bank_id,transactionData.sending_bank_acc_no,transactionData.sending_bank_id,transactionData.receiving_bank_id,transactionData.receiving_bank_acc_no,"Cash"
,transactionData.transaction_amt,transactionData.transaction_type,1010101,{from:web3.eth.coinbase,gas:500000,privateFor:["R56gy4dn24YOjwyesTczYa8m5xhP6hF2uTMCju/1xkY="]},function(err,res){
if(err){
console.log(err);
reject(err);
}else{
var newTransactionID=Contract.totalTransactions().c[0];
console.log('739='+Contract.totalTransactions().c[0]);
console.log('740='+UID);
if(newTransactionID==UID){
console.log('744 not equal to');
reject(false);
//res.redirect("/transfer");
}else{
console.log('747');
var blockChainresult={};
TransactionResult=Contract.bankTransactions(Contract.transactionIDs(UID));
blockChainresult.blockchain_tx_id=UID;
blockChainresult.blockchain_tx_id_hash=Contract.transactionIDs(UID);
blockChainresult.status=TransactionResult[9];
resolve(blockChainresult);
}

}
});
},4000);
    });
}

TransferMoney_old_7_dec = function (IDbank, IDaddress, atAddr, amount) {
    console.log(arguments);

    return new Promise(function (resolve, reject) {
        var web3 = new Web3(new Web3.providers.HttpProvider(getHttp(IDbank)));
        //console.log(web3);
        var Contract = web3.eth.contract(abi).at(IDaddress);
        var Contractor = web3.eth.contract(abitr).at("0x4df0f115551f6f36d753dc0ecf6832715bdd7001");
        var UID = Contract.totalTransactions().c[0];
        //console.log(Contractor);
        console.log("total_trans="+UID);
        setTimeout(function(){


        console.log(atAddr, amount, "random1", { from: web3.eth.coinbase, gas: 500000, privateFor: [getPrivateKey('observer'), getPrivateKey(atAddr)] });

            Contract.sendValue(atAddr, amount, "random1", { from: web3.eth.coinbase, gas: 500000, privateFor: [getPrivateKey('observer'), getPrivateKey(atAddr)] }, function (err, res) {
                if (err) {
                    console.log(err);
                    reject(err);
                    console.log('721 error');
                }
                //console.log(err);
                console.log('723')
                //console.log(res);
                setTimeout(function(){
                    console.log('735');
                console.log(Contract.transactionIDs(UID), { from: web3.eth.coinbase, gas: 500000 });
                    Contractor.addTransaction(Contract.transactionIDs(UID), { from: web3.eth.coinbase, gas: 500000 }, function (err1, res1) {
                        if (err1) {
                            console.log('737');
                            //console.log()
                            reject(err1);
                        }else if(res1){
                            console.log('743');
                            console.log(res1);
                        }

                        var web33 = new Web3(new Web3.providers.HttpProvider(getHttp('observer')));
                        var contracttr = web33.eth.contract(abitr).at("0x4df0f115551f6f36d753dc0ecf6832715bdd7001");
                        var contract1 = web33.eth.contract(abi).at(IDaddress);
                        setTimeout(function() {
                            console.log('747');
                            console.log(UID);
                            console.log(Contract.transactionIDs(UID), { from: web33.eth.coinbase, gas: 500000, privateFor: [getPrivateKey(atAddr), getPrivateKey(IDaddress)] });
                            contract1.confirmTransactionRegulator(Contract.transactionIDs(UID), { from: web33.eth.coinbase, gas: 500000, privateFor: [getPrivateKey(atAddr), getPrivateKey(IDaddress)] }, function (err2, res2) {
                                if (err2) {
                                    console.log('747');
                                    reject(err2);
                                }else if(res2){
                                    console.log('758')
                                    console.log(res2);
                                    
                                }
                                
                                setTimeout(function(){
                                    Contract.balance(function (err3, res3) {
                                        if (err3) console.log(err3);
                                        else if(res3){
                                            console.log('767')
                                            console.log(res3);
                                        }
                                        resolve({ one: res, two: res1, three: res2, four: res3 });
                                    });
                                },8000);
                            });
                        },8000);
                    });
                },8000);
            });
        },4000);
    });
}

// TransferMoney_new = function (IDbank, IDaddress, atAddr, amount) {
//     console.log(arguments);

//     return new Promise(function(resolve,reject){

//         var web3 = new Web3(new Web3.providers.HttpProvider(getHttp(IDbank)));
//         var Contract = web3.eth.contract(abi).at(IDaddress);
//         var Contractor = web3.eth.contract(abitr).at("0x4df0f115551f6f36d753dc0ecf6832715bdd7001");
//         var UID = Contract.totalTransactions().c[0];

//         console.log("UID="+UID);
//         console.log("Contractor=");
//         console.log(Contract);
       

//     if(1){
//         resolve(true);
//     }else{
//         reject(false);
//     }
//     });
// }

getPrivateKey = function (address) {
    //return "";
    console.log('759');
    console.log(arguments);
    switch (address) {
        case "0x180893a0ec847fa8c92786791348d7d65916acbb":
            return "BULeR8JyUWhiuuCMU/HLA0Q5pzkYT+cHII3ZKBey3Bo=";
        case "0xf9a2cb34b6b5fd7a2ac0c2e9b2b9406d6daffbd4":
            return "QfeDAys9MPDs2XHExtc84jKGHxZg/aj52DTh0vtA3Xc=";
        case "0xc8f717ba9593dc9d45c4518cf444d2cbd08af24d":
            return "oNspPPgszVUFw0qmGFfWwh1uxVUXgvBxleXORHj07g8=";
        case "observer":
            return "R56gy4dn24YOjwyesTczYa8m5xhP6hF2uTMCju/1xkY=";
    }
}

getHttp = function (port) {
    switch (port) {
        case "bank1":
            return "http://127.0.0.1:22000";
        case "bank2":
            return "http://127.0.0.1:22001";
        case "bank3":
            return "http://127.0.0.1:22002";
        case "observer":
            return "http://127.0.0.1:22004";
    }
}

sendMail = function (to, subject, message) {
    //console.log(arguments);
    var smtpConfig = {
        service: 'Gmail',
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: 'anuj.singh@sofocle.com',
            pass: 'sofo@123'
        }
    };

    var transporter = nodemailer.createTransport(smtpConfig);
    var mailOptions = {
        from: '"AML"',
        to: to,
        cc: "anuj.singh@sofocle.com",
        subject: subject,
        html: message
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            return console.log(error);
        } else {
            console.log('success');
            console.log(info);
            return console.log(info.response);
        }
    });

}
function parseCSVFile(sourceFilePath, columns, onNewRecord, handleError, done){
    var source = fs.createReadStream(sourceFilePath);
    var parser = Parse({
        delimiter: ',', 
        columns:columns
    });

    parser.on("readable", function(){
        var record;
        while (record = parser.read()) {
            linesRead++;
            onNewRecord(record);
        }
    });

    parser.on("error", function(error){
        handleError(error)
    });

    parser.on("end", function(){
        done(linesRead);
        totalDocumentLines=linesRead;
        
    });

    source.pipe(parser);
}

//We will call this once Multer's middleware processed the request
//and stored file in req.files.fileFormFieldName

function parseFile(req, res, next){
    //console.log(req.files)
    var allRecord=[];
    var uploadedTransactionData=[];
    console.log(req.files[0]);
    
    if(req.files[0]==undefined){
        cheerio.load('sdasd');
        req.flash('error_msg', 'Please provide csv file to upload');
        res.redirect("/transfer");
    }else{
        
    }
    var filePath = req.files[0].path;

    //console.log(filePath);
    function onNewRecord(record){
        //console.log(record)
        allRecord.push(record);
        req.body=record;

        TransferMoney(req.body).then(function (response, error) {
            if (error) {
                console.log('errors');
                console.log(error);
                req.flash('errors', error);
                res.redirect('/transfer');
            } else {
                var sessionObject = req.session.user;
                var postData = req.body;
                var transactionData = {};
                transactionData.nature_of_transaction=req.body.nature_of_transaction;
                transactionData.sending_bank_name=req.body.sending_bank_name
                transactionData.sending_bank_acc_no = postData.sending_bank_acc_no;
                transactionData.receiving_bank_name = postData.receiving_bank_name;
                transactionData.receiving_bank_acc_no = postData.receiving_bank_acc_no;
                transactionData.amount = postData.transaction_amt;
                transactionData.transaction_type = postData.transaction_type;
                transactionData.transaction_date = postData.transaction_date;
                transactionData.notes = postData.notes;
                transactionData.transaction_id = postData.transaction_id;
                transactionData.sending_bank_id = sessionObject._id;
                transactionData.send_value = response.one;
                transactionData.add_transaction = response.two;
                transactionData.cnfrm_transaction = response.three;
                transactionData.balance = response.four;
                db.collection("transactions").insertOne(transactionData, function (err, result) {
                    if (err) {
                        console.log(err);
                    } else {
                        totalReadLines++;
                        blockChainIds.push(transactionData.blockchain_tx_id);
                        uploadedTransactionData.push(transactionData);
                        if((linesRead==totalReadLines) &&  totalReadLines!=0 && linesRead!=0){
                            var data={};
                            data.transactionsList=uploadedTransactionData;
                            req.flash('transactionsList',uploadedTransactionData);
                            req.flash('success_msg', 'Transaction has been done');
                            res.render("confirm_transactions",{output:data});
                           
                        }



                    }
                });
            }
        })


    }

    function onError(error){
        console.log(error)
    }

    function done_old(linesRead){
        var data={};
        data.list=allRecord;
        res.render("upload.ejs",{output:data});
    }
    function done(linesRead){
    // when lines reading completed

    }

    var columns = true; 
    parseCSVFile(filePath, columns, onNewRecord, onError, done);

}

