var express = require('express');
var router = express.Router();

/* GET home page. 
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});*/

var monk = require('monk');
var db = monk('localhost:27017/vidzy');


router.get('/', function(req, res, next) {
  res.redirect('/videos');
});

router.get('/videos', function(req, res) {
	var collection = db.get('videos');
	collection.find({}, function(err, videos){
		if (err) throw err;
	  	res.render('index', { videos: videos });
	});
});


//new video
router.get('/videos/new', function(req, res) {
    res.render('new');
});

//search
router.post('/search', function(req, res) {
    var search_genre = req.body.genre;
    var search_title = req.body.title;
    var collection = db.get('videos');
    
    //both fields have values
    if(search_genre!="" && search_title!=""){
        collection.find({genre: search_genre,title: { $regex: search_title, $options: "i" }}, function(err, videos){
        if (err) throw err;
        //res.json(video);
        else{
        res.render('index',{ videos : videos});
      }
    });
}  
    else if(search_genre!="" && search_title==""){
    collection.find({genre: search_genre}, function(err, videos){
        if (err) throw err;
        //res.json(video);
        else{
        res.render('index',{ videos : videos});
      }
    });
}
    else if(search_title!="" && search_genre==""){
        
        collection.find({title: { $regex: search_title, $options: "i" }}, function(err, videos){
        if (err) throw err;
        //res.json(video);
        else{
        res.render('index',{ videos : videos});
      }
    });
}
else{
    collection.find({}, function(err, videos){
        if (err) throw err;
        //res.json(video);
        else{
        res.render('index',{ videos : videos});
      }
    });
}

});

//edit video
router.get('/videos/:id/edit', function(req, res) {
	var collection = db.get('videos');
	collection.findOne({ _id: req.params.id }, function(err, video){
		if (err) throw err;
	  	//res.json(video);
	  	res.render('edit', { video: video });
	});
});
//update
router.put('/videos/:id', function(req, res) {
    var collection = db.get('videos');
	collection.update({ _id: req.params.id },{$set:{title: req.body.title,
        genre: req.body.genre,
        image: req.body.image,
        description: req.body.desc}} ,function(err, video){
		if (err) throw err;
	  	//res.json(video);
	  	res.redirect('/videos');
	});
});


//insert route
router.post('/videos', function(req, res){
    var collection = db.get('videos');
    collection.insert({
        title: req.body.title,
        genre: req.body.genre,
        image: req.body.image,
        description: req.body.desc
    }, function(err, video){
        if (err) throw err;

        res.redirect('/videos');
    });
});



//show
router.get('/videos/:id', function(req, res) {
	var collection = db.get('videos');
	collection.findOne({ _id: req.params.id }, function(err, video){
		if (err) throw err;
	  	//res.json(video);
	  	res.render('show', { video: video });
	});
});

//delete route
router.delete('/videos/:id', function(req, res){
    var collection = db.get('videos');
    collection.remove({ _id: req.params.id }, function(err, video){
        if (err) throw err;

        res.redirect('/');
    });
});


module.exports = router;
