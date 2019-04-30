const fs = require("fs");
var port = process.env.PORT;

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const cookieParser = require('cookie-parser');

const express = require("express");
const app = express();
app.use(cookieParser());
var mysql = require('mysql');
app.use(express.static('public'));

console.log("web service started");

app.get("/", function(req, res){
	// res.sendfile('login.html');
	res.sendfile('login.htmlhttps://nick-donfris-jacket-website.herokuapp.com/login.html');
})


app.get('/storefront', function (req, res) {
	res.header("Access-Control-Allow-Origin", "*");
	let params = req.query;
	let json = "";
	json = get_all();
    res.send(JSON.stringify(json));
});

app.get('/logout', (req, res)=>{ 
	//it will clear the userData cookie 
	res.clearCookie('username'); 
	res.send('user logout successfully'); 
});


//connection object
var con = mysql.createConnection({
    host: "127.0.0.1",
    port: 8080,
    database: "customers",
    user: "root",
    password: "",
    debug: "true",
});

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers",
	"Origin, X-Requested-With, Content-Type, Accept");
	next();
});

app.post('/account', jsonParser, function (req, res) {
	var username = req.body.username;
	var password = req.body.password;
	con.connect(function(err) {
		con.query("SELECT * FROM users where username ='"+ username +"' and password ='" + password +"'",
			function (err, result, fields) {
				if (err) throw err;
				console.log("result: ", result);
				res.send(result);
		});
	})
});

app.post('/create', jsonParser, function (req, res) {
	var username = req.body.username;
	var password = req.body.password;
	var firstname = req.body.firstname;
	var lastname = req.body.lastname;
	var email = req.body.email;
	con.connect(function(err) {
		con.query('INSERT INTO users (username, password, email, firstname, lastname) VALUES ("'+username+'", "'+password+'", "'+email+'", "'+firstname+'", "'+lastname+'");',
			function (err, result, fields) {
				if (err) throw err;
				console.log(result);
				res.send(result);
		});
	})   
});

console.log("connected");

con.connect(function(err){
    if (err) throw err;
    console.log("connected to database");
});

function get_all(){
	var files = fs.readdirSync("./sweaters/.");
	var contents = [];
	for (let i = 1; i<files.length; i++){
		content = {};
		content["img"] = "/sweaters/"+files[i]+"/cover.jpg";
		content["title"] = files[i];
		contents.push(content);
	}
	json = contents;
	return json;
};

app.listen(port);