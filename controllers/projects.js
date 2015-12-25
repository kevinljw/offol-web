var secrets = require('../config/secrets');
var User = require('../models/User');
var moment = require('moment');
var Fund = require('../models/Fund');
var async = require('async');

var a_projectObj = {
	id: '10000001',
	goal: 2000,
	nowMoney: 0,
	investors: 0,
	percent: 0 
}
var b_projectObj = {
	id: '10000002',
	goal: 1200,
	nowMoney: 0,
	investors: 0, 
	percent: 0 
}

refreshFundingData();

function refreshFundingData(){
	
	singleUserUpdate('10000001', a_projectObj);
	singleUserUpdate('10000002', b_projectObj);
}
function singleUserUpdate(thisHost, projObj){

	console.log('hoster:'+ thisHost);

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
				thisFund_callback();
				
			},function(err){
				if (err) console.error(err.message);
				
				projObj.investors=investorArr.length;
				projObj.percent = Math.round(projObj.nowMoney/projObj.goal*100);
				console.log("#Money:"+projObj.nowMoney);
				console.log("#investors:"+projObj.investors);
			});
		}
	});

}
exports.getDiscover = function(req, res) {
  // get all the users
  // console.log("getPeople");  
    res.render('discover', {
      title: 'Discover',
      a_project: a_projectObj,
      b_project: b_projectObj
    });
  
};
/**
 * GET /people
 * People form page.
 */
exports.getProject = function(req, res) {
  // get all the users
  // console.log("getPeople");
  	if(req.params.id=='10000001'){
  		res.render('projects/'+req.params.id, {
	    	title: '【Loffo x 江峰】舞蹈、創作、重生',
	    	a_project: a_projectObj,
	    });
  	}
  	else{
  		res.render('projects/'+req.params.id, {
	    	title: '【Loffo x 謝睿哲】攝影、探索、台灣',
	    	b_project: b_projectObj,
	    });

  	}
  
    
  
  
};
exports.getFunding = function(req, res) {
  // get all the users
  // console.log("getPeople");
  
	res.render('fundings/'+req.params.id, {
		title: '我要募集',
	});
  
  
};
exports.postFunding = function(req, res) {

  	req.assert('money', '請填入至少一元以上之金額').notEmpty().isInt();
  	// req.assert('money', '請填入至少一元以上之金額').gte(1);
  	
  	// console.log(req)
  	var errors = req.validationErrors();

	  if (errors) {
	    req.flash('errors', errors);
	    return res.redirect(req.headers.referer);
	  }

  	

	var thisFund = new Fund({
	  hoster: req.headers.referer.substr(req.headers.referer.indexOf("/fundings/")+10),
	  investor: req.params.id,
	  money: req.body.money,
	  timestamp: Date(),
	  serials: [],

    });
    // console.log(thisArticle);
   	thisFund.save(function(err) {
        if (err) {
          return next(err);
        }
        refreshFundingData();
        req.flash('success', { msg: '已登記:'+req.body.money+"元" });
        res.redirect('/discover');
    });
		
  
};