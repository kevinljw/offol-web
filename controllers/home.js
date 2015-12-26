// var Article = require('../models/Article');
// var Share = require('../models/Share');
/**
 * GET /
 * Home page.
 */
exports.index = function(req, res) {
	
			res.render('home', {
			    title: '集資透',
			    
			});
		
	// var Aarr=[];
	// Share.find({}, function(err, shares) {
	// 	Article.find({}, function(err, articles) {
	// 		// var rarticles = articles.reverse()
	// 		shares.reverse().forEach(function(eachShare,sum_s){

	// 		}
	// 		articles.reverse().forEach(function(element,sum_a){
	// 			if(sum==articles.length-1 || sum>5){
	// 				if (err) throw err;
	// 		    	res.render('home', {
	// 				    title: 'Home',
	// 				    nArticles: Aarr,
	// 				    nShares: Sarr
	// 				});
	// 			}
	// 			else{
	// 				Aarr.push(element);
	// 			}

	// 		})
	    	
	// 	});
	// });
  
};