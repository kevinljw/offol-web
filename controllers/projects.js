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
	Fund.find({investor: req.user.id},{},{sort: {_id:-1}, limit:1}, function(err, newestFund) {
	    if (err) {
	      return next(err);
	    }
		res.render('payend', {
	    	title: '贊助完成',
	    	buynum: newestFund[0].money,
	    	slotNum: newestFund[0].money-newestFund[0].slotNum,
	    	fundId: newestFund[0].id
	    	// buynum: req.params.num
	    });
	});
};
exports.getPayTheEndR = function(req, res) {
	Fund.findById(req.params.id, function(err, newestFund) {
	    if (err) {
	      return next(err);
	    }
		res.render('payend2', {
	    	title: '贊助紀錄',
	    	buynum: newestFund.money,
	    	slotNum: newestFund.money-newestFund.slotNum,
	    	fundId: newestFund.id
	    	// buynum: req.params.num
	    });
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
exports.postSlot = function(req, res, next) {
	

	// console.log(req.body);
	Fund.findById(req.body.fid, function(err, thisFund) {
	    if (err) {
	      return next(err);
	    }
	    if(thisFund && thisFund.money-thisFund.slotNum>=parseInt(req.body.amount)){
	    	// var startIndex = thisFund.money-thisFund.slotNum;
	    	
	    	Project.findOne({"hid": thisFund.hid}, function(err, proj) {
				if (!proj) {
		          req.flash('errors', { msg: 'No project with that id exists.' });
		          return res.redirect('/payend');
		        }
		        else{
		        	// proj.winnerSerials=['10007'];
		        	var thisSlotSerials = thisFund.serials.slice(thisFund.slotNum, thisFund.slotNum+parseInt(req.body.amount));
		        	console.log(thisFund.slotNum, thisFund.slotNum+parseInt(req.body.amount), thisSlotSerials);
		        	
		        	var resultSlot = Array.intersect(proj.winnerSerials,thisSlotSerials);
		        	thisFund.slotNum+=parseInt(req.body.amount);
		        	if(resultSlot.length>0){
		        		res.end('恭喜您獲得回饋品 '+resultSlot.length+' 件，您的中獎序號為:'+resultSlot.join(' '));
		        		resultSlot.forEach(function(eachSerial){
		        			proj.winnerList.push({'wId': thisFund.investor, 'wName': thisFund.investorName, 'serial': eachSerial});
		        			proj.save(function(err) {
						      if (err) {
						        return next(err);
						      }

						  	});
		        		});
		        	}
		        	else{
		        		res.end('銘謝惠顧，歡迎再次贊助');

		        	}
		        	thisFund.save(function(err) {
				      if (err) {
				        return next(err);
				      }

				  	});

		        }

		    });

	    	
	    }
	    else{
	    	res.end('錯誤：您輸入的金額有誤');
	    }
	});
	
	// res.render('payend', {
 //    	title: '贊助完成',
 //    	slotResult: '鳴謝會酷'
 //    	// buynum: req.params.num
 //    });
};
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
/** 
* each是一個集合迭代函數，它接受一個函數作為參數和一組可選的參數 
* 這個迭代函數依次將集合的每一個元素和可選參數用函數進行計算，並將計算得的結果集返回 
{%example 
<script> 
var a = [1,2,3,4].each(function(x){return x > 2 ? x : null}); 
var b = [1,2,3,4].each(function(x){return x < 0 ? x : null}); 
alert(a); 
alert(b); 
</script> 
%} 
* @param {Function} fn 進行迭代判定的函數 
* @param more ... 零個或多個可選的用戶自定義參數 
* @returns {Array} 結果集，如果沒有結果，返回空集 
*/ 
Array.prototype.each = function(fn){ 
fn = fn || Function.K; 
var a = []; 
var args = Array.prototype.slice.call(arguments, 1); 
for(var i = 0; i < this.length; i++){ 
var res = fn.apply(this,[this[i],i].concat(args)); 
if(res != null) a.push(res); 
} 
return a; 
}; 
//数组是否包含指定元素
Array.prototype.contains = function(suArr){
    for(var i = 0; i < this.length; i ++){  
        if(this[i] == suArr){
            return true;
        } 
     } 
     return false;
}
/** 
* 得到一個數組不重複的元素集合<br/> 
* 唯一化一個數組 
* @returns {Array} 由不重複元素構成的數組 
*/ 
Array.prototype.uniquelize = function(){ 
var ra = new Array(); 
for(var i = 0; i < this.length; i ++){ 
if(!ra.contains(this[i])){ 
ra.push(this[i]); 
} 
} 
return ra; 
}; 

/** 
* 求兩個集合的補集 
{%example 
<script> 
var a = [1,2,3,4]; 
var b = [3,4,5,6]; 
alert(Array.complement(a,b)); 
</script> 
%} 
* @param {Array} a 集合A 
* @param {Array} b 集合B 
* @returns {Array} 兩個集合的補集 
*/ 
Array.complement = function(a, b){ 
return Array.minus(Array.union(a, b),Array.intersect(a, b)); 
}; 

/** 
* 求兩個集合的交集 
{%example 
<script> 
var a = [1,2,3,4]; 
var b = [3,4,5,6]; 
alert(Array.intersect(a,b)); 
</script> 
%} 
* @param {Array} a 集合A 
* @param {Array} b 集合B 
* @returns {Array} 兩個集合的交集 
*/ 
Array.intersect = function(a, b){ 
return a.uniquelize().each(function(o){return b.contains(o) ? o : null}); 
}; 

/** 
* 求兩個集合的差集 
{%example 
<script> 
var a = [1,2,3,4]; 
var b = [3,4,5,6]; 
alert(Array.minus(a,b)); 
</script> 
%} 
* @param {Array} a 集合A 
* @param {Array} b 集合B 
* @returns {Array} 兩個集合的差集 
*/ 
Array.minus = function(a, b){ 
return a.uniquelize().each(function(o){return b.contains(o) ? null : o}); 
}; 

/** 
* 求兩個集合的並集 
{%example 
<script> 
var a = [1,2,3,4]; 
var b = [3,4,5,6]; 
alert(Array.union(a,b)); 
</script> 
%} 
* @param {Array} a 集合A 
* @param {Array} b 集合B 
* @returns {Array} 兩個集合的並集 
*/ 
Array.union = function(a, b){ 
return a.concat(b).uniquelize(); 
};  
