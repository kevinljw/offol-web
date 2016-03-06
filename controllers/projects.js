var secrets = require('../config/secrets');
var User = require('../models/User');
var moment = require('moment');
var Fund = require('../models/Fund');
var Project = require('../models/Project');
var async = require('async');
var md5 = require('md5');

var addNullNum = 10000000;

// var a_projectObj = {
// 	id: '10000001',
// 	goal: 2000,
// 	nowMoney: 0,
// 	investors: 0,
// 	percent: 0,
// 	ticketBuyArr: new Array(2000)
// }
// var b_projectObj = {
// 	id: '10000002',
// 	goal: 1200,
// 	nowMoney: 0,
// 	investors: 0, 
// 	percent: 0,
// 	ticketBuyArr: new Array(1200)
// }

// iniFundingData();
// refreshFundingData();

// function iniFundingData(){

// 	for(var i=0; i< a_projectObj.ticketBuyArr.length; i++)a_projectObj.ticketBuyArr[i]=false;
// 	for(var j=0; j< b_projectObj.ticketBuyArr.length; j++)b_projectObj.ticketBuyArr[j]=false;
	
// }
// function refreshFundingData(){

	
	
// 	singleUserUpdate('10000001', a_projectObj);
// 	singleUserUpdate('10000002', b_projectObj);
// }
// function singleUserUpdate(thisHost, projObj){

// 	// console.log('hoster:'+ thisHost);

// 	projObj.id = thisHost;
// 	projObj.nowMoney = 0;
// 	projObj.investors = 0;
// 	percent: 0;

// 	Fund.find({hoster: thisHost},function(err, thisProjs) {
// 		if (err) throw err;

// 		if(thisProjs){

// 			var investorArr = [];
// 			// console.log(thisProjs);
// 			async.forEachOf(thisProjs, function (eachFund, eachFundIndex, thisFund_callback) {
			
// 				// console.log(eachFund.money);
// 				projObj.nowMoney+=eachFund.money;
// 				if(investorArr.indexOf(eachFund.investor)==-1){
// 					investorArr.push(eachFund.investor);
// 				}
// 				eachFund.serials.forEach(function(eachSerial){
// 					a_projectObj.ticketBuyArr[parseInt(eachSerial)-addNullNum]=true;
// 				});
				
// 				thisFund_callback();
				
// 			},function(err){
// 				if (err) console.error(err.message);
				
// 				projObj.investors=investorArr.length;
// 				projObj.percent = Math.round(projObj.nowMoney/projObj.goal*100);
// 				// console.log("#Money:"+projObj.nowMoney);
// 				// console.log("#investors:"+projObj.investors);
// 			});
// 		}
// 	});

// }
exports.getSurvey = function(req, res) {
	// console.log(req.query.id);
	// console.log(req.query.amount);
	// res.redirect('/survey');
	res.render('survey', {
      title: 'Survey',
      targetUrl: '/payend/field?amount='+req.query.amount+'&id='+req.query.id+'&host='+req.query.host,
    });

};
exports.postSurvey = function(req, res) {

	res.redirect('/payend');
};
exports.getDiscover = function(req, res) {
  // get all the users
  // console.log("getPeople");  
 Project.find({},null, {sort:{"_id":-1}}, function(err, projs) {
	if (err) throw err;
	res.render('discover', {
      title: 'Discover',
      // a_project: a_projectObj,
      // b_project: b_projectObj,
      allProjects: projs
    });

});
    
  
};
/**
 * GET /people
 * People form page.
 */
exports.getProject = function(req, res) {
  // get all the users
  // console.log("getPeople");
  	Project.findOne({"hid": req.params.id}, function(err, proj) {
		if (!proj) {
          req.flash('errors', { msg: 'No project with that id exists.' });
          return res.redirect('/postProj');
        }

        // console.log(proj);
        // req.flash('success', { msg: 'Done.' });

	    res.render('project', {
			title: proj.title,
			thisProject: proj
		});
        
	});
  	// if(req.params.id=='10000001'){
  	// 	res.render('projects/'+req.params.id, {
	  //   	title: '【Loffo x 江峰】舞蹈、創作、重生',
	  //   	a_project: a_projectObj,
	  //   });
  	// }
  	// else{
  	// 	res.render('projects/'+req.params.id, {
	  //   	title: '【Loffo x 謝睿哲】攝影、探索、台灣',
	  //   	b_project: b_projectObj,
	  //   });

  	// }
 
};
exports.getPayTheEnd = function(req, res) {
	res.render('payend', {
    	title: '贊助完成',
    	buynum: req.params.amount
    	// buynum: req.params.num
    });
};
exports.getPayEnd = function(req, res) {
  // get all the users
  // console.log("getPeople");

   // var hostId = req.headers.referer.substr(req.headers.referer.indexOf("/fundings/")+10);
  	User.findById(req.user.id, function(err, user) {
	    if (err) {
	      return next(err);
	    }
	    if(user){
	    	console.log(user.preHid, user.prePay);
	    	if(user.payyet){
	    			        
				res.redirect('/payend/'+user.prePay);
						        
	    	}
	    	else{
		    	Project.findOne({hid : user.preHid}, function(err, thisProj) {
				    if (err) {
				      return next(err);
				    }
				    if(thisProj){
				    	// console.log(thisProj);
					  	serialGenerate(user.preHid, user.id, user.prePay, thisProj.goalmoney ,function(allSeriels){
					  	
							// console.log(allSeriels);

							user.payyet = true;
							user.save(function(err) {
						        if (err) {
						          return next(err);
						        }
						        
						    });

							var thisFund = new Fund({
							  hid: user.preHid,
							  investor: user.id,
							  investorName: user.profile.name,
							  money: user.prePay,
							  timestamp: moment().utcOffset(8).format('lll'),
							  serials: allSeriels,

						    });

						    
						    // console.log(thisFund);
						    // console.log(thisArticle);
						   	thisFund.save(function(err) {
						        if (err) {
						          return next(err);
						        }
						        // refreshFundingData();
						        req.flash('success', { msg: '已登記:'+thisFund.money+"元" });
						        
						        res.redirect('/payend/'+thisFund.money);
						        
						    });
						});
			   		}
			    });

	    	}

  		}
  	});
 
};
exports.getFunding = function(req, res) {
  // get all the users
  // console.log("getPeople");
  Project.findOne({"hid": req.params.id}, function(err, proj) {
		if (!proj) {
          req.flash('errors', { msg: 'No project with that id exists.' });
          return res.redirect('/discover');
        }
	res.render('funding', {
		title: '我要募集',
		thisProjHid: req.params.id,
		thisProjBanner: proj.bannerPImg,
		thisProjBackground: proj.bannerColor,
		remainMoney: proj.goalmoney-proj.nowmoney,
		quickpayid: proj.quickPayId,
		payInfo: proj.payInfo
	});
  
  });
};
exports.postInPerson = function(req, res, next) {


	console.log("InPerson", req.body);
	// var hostId = req.headers.referer.substr(req.headers.referer.indexOf("/fundings/")+10);
  	User.findById(req.user.id, function(err, user) {
	    if (err) {
	      return next(err);
	    }
	    if(user){
	    	user.prePay = req.body.TradeAMT;
	    	user.preHid = req.body.ProductName;
	    	user.payyet = false;
	    	// console.log(user);
		    user.save(function(err) {
		      if (err) {
		        return next(err);
		      }
		  	});
	  	}
	  	res.render('inPerson', {
			title: '面交聯絡資訊',
			TradeAMT: req.body.TradeAMT,
			targetUrl: '/0a0e0389f9f272205d43d978c2f7f03c',
		});
      
    });
  	// console.log(req.body)
} 
exports.postFunding = function(req, res, next) {

	// var hostId = req.headers.referer.substr(req.headers.referer.indexOf("/fundings/")+10);
  	
  	console.log(req.body)
  	
	res.end("File is uploaded");

	User.findById(req.user.id, function(err, user) {
	    if (err) {
	      return next(err);
	    }
	    if(user){
	    	user.prePay = req.body.TradeAMT;
	    	user.preHid = req.body.ProductName;
	    	user.payyet = false;
	    	// console.log(user);
		    user.save(function(err) {
		      if (err) {
		        return next(err);
		      }
		  	});
	  	}
      
    });

	 // res.render('survey', {
	 //      title: 'Survey',
	 //      targetUrl: '/payend/field?amount='+req.body.money+'&id='+req.params.id+'&host='+hostId,
	 //    });
	
		
  
};

function serialGenerate(hostId, thisEmail, thisNum, needForPeople, callback){
    
    var allSerials = [];
    var allSerialArr = new Array(thisNum);
    Project.findOne({hid : hostId}, function(err, thisProj) {
	    if (err) {
	      return next(err);
	    }
	    thisProj.investorNum = thisProj.investorNum+1;
	    thisProj.nowmoney = thisProj.nowmoney+thisNum;
	    thisProj.percent = Math.round((thisProj.nowmoney/thisProj.goalmoney)*10000)/100;
	    thisProj.save(function(err) {
	      // console.log('saved');
	      if (err) {
		        return console.log(err);
		      }
	  	});
	  	async.forEachOf(allSerialArr, function (thisSerial, thisSerialIndex, thisSerial_callback) {
	    	eachSerial(hostId, thisEmail, thisSerialIndex, needForPeople, function(serialNum){
	    		// console.log(thisProj.ticketBuyArr);
	    	// 	thisProj.save(function(err) {
			   //    console.log('saved');
			   //    thisSerial_callback();
			  	// });
	    		allSerials.push(serialNum);
	    		thisSerial_callback();
	    	});
	    	
	    },function(err){
			if (err) console.error(err.message);
			// console.log('saving thisProj');
			// console.log(thisProj.ticketBuyArr.join(','))
			thisProj.save(function(err) {
		      if (err) {
		        return console.log(err);
		      }
		      console.log('saved');
		      return callback(allSerials);
		  	});
			
		});

	  	function eachSerial(hostId, thisEmail, nowNum, needForPeople, each_callback){
    		// console.log(hostId, thisEmail, nowNum, needForPeople);
			    var tmpEnN = thisEmail+nowNum+Date.now();
			//    console.log(tmpEnN);
			    var getThisGuysMd5 = md5(tmpEnN);
			    var thisGuysMd5cutInt =  parseInt(getThisGuysMd5.substr(23),16);
			    
			  // console.log(thisGuysMd5cutInt);
			    thisGuysMd5cutInt = thisGuysMd5cutInt%needForPeople;
			    // console.log(thisEmail+"->"+thisGuysMd5cutInt);
			    
				    // thisProj.ticketBuyArr.forEach(function(eachEle,index){
				    // 	if(eachEle) console.log(index, '-true');
				    // });
				    for(var i=0; i<needForPeople;i++){
				    	
						if(thisProj.ticketBuyArr.charAt((thisGuysMd5cutInt+i)%needForPeople)=='0'){
							// console.log((thisGuysMd5cutInt+i)%needForPeople);
				            // thisProj.ticketBuyArr[(thisGuysMd5cutInt+i)%needForPeople]=true;
				            thisProj.ticketBuyArr = thisProj.ticketBuyArr.replaceAt((thisGuysMd5cutInt+i)%needForPeople,'1');
	    		
				            return each_callback(addNullNum+(thisGuysMd5cutInt+i)%needForPeople);
				            
				            break;
				        }
				    	
				        if(i==needForPeople-1) console.log("something wrong!");
				    }

			
			};
		});



    
   
    
//    callback();
}
String.prototype.replaceAt=function(index, character) {
    return this.substr(0, index) + character + this.substr(index+character.length);
}
