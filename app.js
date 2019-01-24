"use strict";
var express = require('express');
var app = express();

var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static('./public'));

var users = [{"username": "doctorwhocomposer", "forename": "Delia", "surname": "Derbyshire","access_token":"123", "active":false,"chats":[{"from":"doctorwhocomposer","to":"Bongos","message":"Hi"}]}, {"username": "Bongos", "forename": "Joe", "surname": "Blogs","access_token": "letmein" ,"active":false,"chats":[{"from":"doctorwhocomposer","to":"Bongos","message":"Hi"}]},{"username":"robot","forename":"Bender","surname":"Bender","access_token":"futurama","active":false,"chats":[]}];
var posts = [{"username":"doctorwhocomposer", "text":"welcome to this website"},{"username":"robot","text":"Cool club"}];
var events = [{"creator":"doctorwhocomposer","date":"2019-02-01","title":"Web deadline","description":"this is when this website is due"}]


app.get('./people', function(req, resp){
	resp.send(users);
});
app.get('./people/:user', function(req,resp){
	var person = req.url;
	person = person.split('/');
	person = person[2];
	var found = false;
	users.forEach(function(item){
		if(item.username == person){
			found = true;
			resp.send(item);
		}
	});
	if (found == false){
		resp.send(false);
	}
});
	
app.post('./login', function(req,resp){
	const username = req.body.username;
	const passw = req.body.passw;
	var found = false;
	users.forEach(function (item){
		if (item.username == username && item.access_token == passw){
			item.active = true;
			found = true;
			resp.send(item);
		}
	});
	if (found == false){
		resp.send(false);
	}
});	

app.post('./people', function(req, resp){
	var username = req.get('username');
	var forename = req.get('forename');
	var surname = req.get('surname');
	var pass = req.get('access_token');
	if (username == null){
		username = req.body.username;
		forename = req.body.forename;
		surname = req.body.surname;
		pass = req.body.access_token;
	}
	var unique = true;
	users.forEach(function(item){
		if (item.username == username){
			unique = false;
		}
	});
	if (unique == true && pass != null){
		users.push({"username": username, "forename": forename, "surname":surname, "access_token": pass, "active":true,"chats":[]});
		resp.send(true);
	}
	else{
		if(pass == null){
			resp.status(403).send(false);
		}
		if(unique == false){
			resp.status(400).send(false);
		}
	}
});

app.get('./posts', function(req,resp){
	resp.send(posts);
});

app.post('./signout', function(req,resp){
	const user = req.body.username;
	var found = false;
	users.forEach(function(item){
		if(item.username == user){
			found = true;
			item.active = false;
			resp.send(true);
		}
	});
	if (found == false){
	resp.send(false);
	}
});

app.post('./post', function(req,resp){
	const user = req.body.username;
	const text = req.body.text;
	posts.push({"username":user,"text":text});
	resp.send(true);
});

app.post('./createevent', function(req,resp){
	const creator = req.body.creator;
	const title = req.body.title;
	const description = req.body.description;
	const date = req.body.date;
	events.push({"creator":creator, "date":date, "title":title, "description":description});
	resp.send(true);
});

app.get('./events', function(req,resp){
	resp.send(events);
});

app.post('./chats',function(req,resp){
	const user = req.body.username;
	users.forEach(function(item){
		if(item.username == user){
			resp.send(item.chats);
		}
	});
});

app.post('./send',function(req,resp){
	const from = req.body.from;
	const to = req.body.to;
	const message = req.body.message;
	users.forEach(function(item){
		if(item.username == from || item.username == to){
			item.chats.push({"from":from,"to":to,"message":message});
		}
	});
	resp.send(true);
});

module.exports = app;