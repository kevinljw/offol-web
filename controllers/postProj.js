var secrets = require('../config/secrets');
var moment = require('moment');
// var Article = require('../models/Article');
// var Share = require('../models/Share');
// var Idea = require('../models/Idea');
var User = require('../models/User');
var Project = require('../models/Project');
var hidStartSerial = secrets.projects.hidStartSerial;

var nodemailer = require("nodemailer");
var transporter = nodemailer.createTransport({
  service: 'SendGrid',
  auth: {
    user: secrets.sendgrid.user,
    pass: secrets.sendgrid.password
  }
});

var allProjs = function(req, res) {

	Project.find({},function(err, projs) {
    	if (err) console.error(err);

    	return projs;
	});
  	
};
/**
 * GET /contact
 * Contact form page.
 */
exports.getPostProj = function(req, res) {
	Project.find({}, null, {sort: {'_id': -1}}, function(err, projs) {
    	if (err) throw err;

		res.render('postProj', {
			title: 'Project Management',
			allProjects: projs,
			isEditing: false,
		});
		allProjs = projs;
	});
  
};
exports.postPostProj = function(req, res, next) {
	req.assert('title', 'Title must be at least 1 characters long').len(1);
	req.assert('name', 'Name must be at least 1 characters long').len(1);
	req.assert('abstract', 'Abstract must be at least 1 characters long').len(1);
	req.assert('content', 'Content must be at least 1 characters long').len(1);
	req.assert('video', 'video?').len(1);
	req.assert('money', 'money?').isInt();
	var errors = req.validationErrors();

	if (errors) {
	    req.flash('errors', errors);
	    return res.redirect('/postProj');
	}
	Project.find({}, null, {sort:{"hid":-1}}, function(err, projs) {
    	if (err) throw err;
    	var thisHid = hidStartSerial;
    	if(projs.length>0){
    		thisHid = parseInt(projs[0].hid)+1;
    	}
    	console.log("thisHid:"+thisHid);
    	allProjs = projs;
		// console.log(hidStartSerial, projs.length, thisHid);
		var thisProject = new Project({
	      hoster: req.body.name,
	      title: req.body.title,
		  abstract: req.body.abstract,
		  goalmoney: parseInt(req.body.money),
		  created_time: moment().format('MMMM Do YYYY, h:mm:ss a'),
		  main_video: req.body.video.replace("watch?v=", "embed/").replace("youtu.be", "www.youtube.com/embed/"),
		  content: req.body.content,
		  bannerPImg: req.body.bannerPImg,
		  coverPImg: req.body.coverPImg,
		  bannerColor: req.body.bannerColor,
		  hid: thisHid,
		  ticketBuyArr: new Array(parseInt(req.body.money))
		  // picture: PictureIsOn?PicPath:''
	    });

		for(var i=0; i<thisProject.goalmoney; i++)thisProject.ticketBuyArr[i]=false;
	    
	    // console.log(thisProject);
	    thisProject.save(function(err) {
	        if (err) {
	          return next(err);
	        }
	        req.flash('success', { msg: 'Done.' });
	        res.redirect('/postProj');
	    });
	
	});
};
exports.editProj = function(req, res, next) {
	Project.findOne({"_id": req.params.id}, function(err, proj) {
		if (!proj) {
          req.flash('errors', { msg: 'No project with that id exists.' });
          return res.redirect('/postProj');
        }

        // console.log(proj);
        // req.flash('success', { msg: 'Done.' });

	    res.render('postProj', {
			title: 'Project Management',
			thisProject: proj,
			isEditing: true,
			allProjects: allProjs,
		});
        
	});

};
exports.updateProj = function(req, res, next) {
	
		Project.findOne({"_id": req.params.id}, function(err, proj) {
			if (!proj) {
	          req.flash('errors', { msg: 'No project with that id exists.' });
	          return res.redirect('/postProj');
	        }
	        proj.hoster= req.body.name;
		    proj.title= req.body.title;
			proj.abstract= req.body.abstract;
			proj.goalmoney= req.body.money;
			proj.main_video= req.body.video.replace("watch?v=", "embed/").replace("youtu.be", "www.youtube.com/embed/");
			proj.content= req.body.content;
			proj.bannerPImg= req.body.bannerPImg;
		 	proj.coverPImg= req.body.coverPImg;
		 	proj.bannerColor =  req.body.bannerColor;
		 	proj.quickPayId = req.body.payid;

			proj.save(function(err) {
		        if (err) {
		          return next(err);
		        }
		        req.flash('success', { msg: 'Done.' });
		        res.render('postProj', {
					title: 'Project Management',
					thisProject: proj,
					isEditing: false,
					allProjects: allProjs,
				});
		    });
	        
		});
	
	

};
exports.deleteProj = function(req, res, next) {
	Project.remove({"_id": req.params.id}, function(err, proj) {
		if (!proj) {
          req.flash('errors', { msg: 'No account with that id exists.' });
          return res.redirect('/');
        }
        req.flash('success', { msg: 'Done.' });
	    res.redirect('/postProj');
        
	});

};
exports.getArticle = function(req, res) {
	Idea.find({},function(err, ideas) {
		if (err) throw err;
		Share.find({},function(err, shares) {
			if (err) throw err;
			Article.find({},function(err2, articles) {
		    	if (err2) throw err2;
				res.render('article', {
				    title: 'Account Management',
				    allArticles: articles,
				    allShares: shares,
				    allIdeas: ideas
				  });
			});
	  	});
	});
};
exports.postDeleteShare = function(req, res, next) {
	Share.remove({"_id": req.params.id}, function(err, article) {
		if (!article) {
          req.flash('errors', { msg: 'No account with that id exists.' });
          return res.redirect('/');
        }
        req.flash('success', { msg: 'Done.' });
	    res.redirect('/article');
        
	});
}
exports.postDeleteIdea = function(req, res, next) {
	Idea.remove({"_id": req.params.id}, function(err, idea) {
		if (!idea) {
          req.flash('errors', { msg: 'No account with that id exists.' });
          return res.redirect('/');
        }
        req.flash('success', { msg: 'Done.' });
	    res.redirect('/article');
        
	});
}
exports.postDeleteArticle = function(req, res, next) {
	Article.remove({"_id": req.params.id}, function(err, article) {
		if (!article) {
          req.flash('errors', { msg: 'No account with that id exists.' });
          return res.redirect('/');
        }
        req.flash('success', { msg: 'Done.' });
	    res.redirect('/article');
        
	});
}
exports.postNewArticle = function(req, res, next) {
	req.assert('title', 'Title must be at least 1 characters long').len(1);
	req.assert('content', 'Content must be at least 1 characters long').len(1);
	var errors = req.validationErrors();

	if (errors) {
	    req.flash('errors', errors);
	    return res.redirect('/article');
	}

	User.findById(req.params.id, function(err, user) {
        if (!user) {
          req.flash('errors', { msg: 'No account with that id exists.' });
          return res.redirect('/');
        }
        // console.log(req.file);

        var LinkIsOn = false;
        var PictureIsOn = false;
        var videoLink = req.body.link;
        var PicPath;

        
        if(req.file){
        	console.log(req.file);
        	PicPath = "/uploadAnnPImg/"+req.file.filename;
        	PictureIsOn = true;
        }
        else if(videoLink != "" && (videoLink.indexOf("vimeo.com")>-1 || videoLink.indexOf("youtu.be")>-1 || videoLink.indexOf("youtube")>-1)){
        	videoLink = videoLink.replace("watch?v=", "v/");
        	videoLink = videoLink.replace("youtu.be", "www.youtube.com/v");
        	videoLink = videoLink.replace("vimeo.com", "player.vimeo.com/video");
        	// https://player.vimeo.com/video/10881014
        	console.log(videoLink);
        	LinkIsOn = true;
        }
        if(req.body.IsSendEmail){
        	
        	console.log("SendEmail!!");
        }
        var thisArticle = new Article({
	      title: req.body.title,
		  content: req.body.content,
		  author: user.profile.name,
		  authorId: req.params.id,
		  timestamp: moment().format('MMMM Do YYYY, h:mm:ss a'),
		  link: LinkIsOn?videoLink:'',
		  picture: PictureIsOn?PicPath:''
	    });
	    console.log(thisArticle);
	    thisArticle.save(function(err) {
	        if (err) {
	          return next(err);
	        }
	        req.flash('success', { msg: 'Done.' });
	        res.redirect('/article');
	    });
	    
    });
	
};
