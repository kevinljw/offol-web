var secrets = require('../config/secrets');
var User = require('../models/User');
var moment = require('moment');
var Fund = require('../models/Fund');
var Project = require('../models/Project');
var async = require('async');
var md5 = require('md5');




var addNullNum = 10000000;

var a_projectObj = {
	id: '10000001',
	goal: 2000,
	nowMoney: 0,
	investors: 0,
	percent: 0,
	ticketBuyArr: new Array(2000)
}
var b_projectObj = {
	id: '10000002',
	goal: 1200,
	nowMoney: 0,
	investors: 0, 
	percent: 0,
	ticketBuyArr: new Array(1200)
}

iniFundingData();
refreshFundingData();

function iniFundingData(){

	for(var i=0; i< a_projectObj.ticketBuyArr.length; i++)a_projectObj.ticketBuyArr[i]=false;
	for(var j=0; j< b_projectObj.ticketBuyArr.length; j++)b_projectObj.ticketBuyArr[j]=false;
	
}
function refreshFundingData(){

	
	
	singleUserUpdate('10000001', a_projectObj);
	singleUserUpdate('10000002', b_projectObj);
}
function singleUserUpdate(thisHost, projObj){

	// console.log('hoster:'+ thisHost);

	projObj.id = thisHost;
	projObj.nowMoney = 0;
	projObj.investors = 0;
	percent: 0;

	Fund.find({hoster: thisHost},function(err, thisProjs) {
		if (err) throw err;

		if(thisProjs){

			var investorArr = [];
			// console.log(thisProjs);
			async.forEachOf(thisProjs, function (eachFund, eachFundIndex, thisFund_callback) {
			
				// console.log(eachFund.money);
				projObj.nowMoney+=eachFund.money;
				if(investorArr.indexOf(eachFund.investor)==-1){
					investorArr.push(eachFund.investor);
				}
				eachFund.serials.forEach(function(eachSerial){
					a_projectObj.ticketBuyArr[parseInt(eachSerial)-addNullNum]=true;
				});
				
				thisFund_callback();
				
			},function(err){
				if (err) console.error(err.message);
				
				projObj.investors=investorArr.length;
				projObj.percent = Math.round(projObj.nowMoney/projObj.goal*100);
				// console.log("#Money:"+projObj.nowMoney);
				// console.log("#investors:"+projObj.investors);
			});
		}
	});

}
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
      a_project: a_projectObj,
      b_project: b_projectObj,
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
    	title: '付款未完',
    	buynum: req.params.amount
    	// buynum: req.params.num
    });
};
exports.getPayEnd = function(req, res) {
  // get all the users
  // console.log("getPeople");

   // var hostId = req.headers.referer.substr(req.headers.referer.indexOf("/fundings/")+10);
  	
  	serialGenerate(req.query.host, req.query.id, req.query.amount, (req.query.host=='10000001')?a_projectObj.goal:b_projectObj.goal ,function(allSeriels){
  	
		// console.log(allSeriels);

		var thisFund = new Fund({
		  hoster: req.query.host,
		  investor: req.query.id,
		  money: req.query.amount,
		  timestamp: moment().utcOffset(8).format('lll'),
		  serials: allSeriels,

	    });
	    // console.log(thisArticle);
	   	thisFund.save(function(err) {
	        if (err) {
	          return next(err);
	        }
	        refreshFundingData();
	        req.flash('success', { msg: '已登記:'+req.query.amount+"元" });
	        
	        res.redirect('/payend/'+req.query.amount);
	        
	    });

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
		thisProjHId: req.params.id,
		thisProjBanner: proj.bannerPImg
	});
  
  });
};
exports.postFunding = function(req, res, next) {

	var hostId = req.headers.referer.substr(req.headers.referer.indexOf("/fundings/")+10);
  	
  	req.assert('money', '金額不得為空').notEmpty();
  	req.assert('money', '金額錯誤').isInt();
  	req.assert('money', '請填入至少一元以上之金額').gte(1);
  	if(hostId=='10000001') req.assert('money', '填入金額不得多於:'+(a_projectObj.goal-a_projectObj.nowMoney)).lt((a_projectObj.goal-a_projectObj.nowMoney));
  	else req.assert('money', '填入金額不得多於:'+(b_projectObj.goal-b_projectObj.nowMoney)+1).lt((b_projectObj.goal-b_projectObj.nowMoney+1));

  	// console.log(req)
  	var errors = req.validationErrors();

	  if (errors) {
	    req.flash('errors', errors);
	    return res.redirect(req.headers.referer);
	  }

	 // next();
	 res.render('survey', {
	      title: 'Survey',
	      targetUrl: '/payend/field?amount='+req.body.money+'&id='+req.params.id+'&host='+hostId,
	    });
	 // res.redirect('/survey/field?amount='+req.body.money+'&id='+req.params.id+'&host='+hostId);

	// serialGenerate(hostId, req.params.id, req.body.money, (hostId=='10000001')?a_projectObj.goal:b_projectObj.goal ,function(allSeriels){
  	
	// 	// console.log(allSeriels);

	// 	var thisFund = new Fund({
	// 	  hoster: hostId,
	// 	  investor: req.params.id,
	// 	  money: req.body.money,
	// 	  timestamp: moment().utcOffset(8).format('lll'),
	// 	  serials: allSeriels,

	//     });
	//     // console.log(thisArticle);
	//    	thisFund.save(function(err) {
	//         if (err) {
	//           return next(err);
	//         }
	//         refreshFundingData();
	//         // req.flash('success', { msg: '已登記:'+req.body.money+"元" });
	//         res.redirect('/payend/'+req.body.money);
	//     });

 //   });
		
  
};

function serialGenerate(hostId, thisEmail, thisNum, needForPeople, callback){
    
    var allSerials = [];
    // async.forEachOf(thisProjs, function (eachFund, eachFundIndex, thisFund_callback) {

   for(var i=0; i<thisNum;i++){
        allSerials.push(eachSerial(hostId, thisEmail, i, needForPeople));
        if(i==thisNum-1){
        	callback(allSerials);
        }
   } 
    
//    callback();
}
function eachSerial(hostId, thisEmail, nowNum, needForPeople){
    
    var tmpEnN = thisEmail+nowNum+Date.now();
//    console.log(tmpEnN);
    var getThisGuysMd5 = md5(tmpEnN);
    var thisGuysMd5cutInt =  parseInt(getThisGuysMd5.substr(23),16);
    
  // console.log(thisGuysMd5cutInt);
    thisGuysMd5cutInt = thisGuysMd5cutInt%needForPeople;
    // console.log(thisEmail+"->"+thisGuysMd5cutInt);
    for(var i=0; i<needForPeople;i++){
    	if(hostId=='10000001'){
    		// console.log('10000001');
    		if(a_projectObj.ticketBuyArr[(thisGuysMd5cutInt+i)%needForPeople]==false){
	            a_projectObj.ticketBuyArr[(thisGuysMd5cutInt+i)%needForPeople]=true;
	            return addNullNum+(thisGuysMd5cutInt+i)%needForPeople;
	        }
    	}
    	else{
    		if(b_projectObj.ticketBuyArr[(thisGuysMd5cutInt+i)%needForPeople]==false){
	            b_projectObj.ticketBuyArr[(thisGuysMd5cutInt+i)%needForPeople]=true;
	            return addNullNum+(thisGuysMd5cutInt+i)%needForPeople;
	        }
    	}
        
    }
    console.log("something wrong!");
}