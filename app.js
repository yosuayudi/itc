const path        = require('path');
const express     = require('express');
const hbs         = require('hbs');
const bodyParser  = require('body-parser');
const mysql       = require('mysql');
const app         = express();
const session     = require('express-session');
const md5           = require('md5');

//Create Connection
const conn = mysql.createConnection({
  host: 'localhost',
  user: 'admin',
  password: '12345',
  database: 'crud'
});

//connect to database
conn.connect((err) =>{
  if(err) throw err;
  console.log('Mysql Connected...');
});

app.set('views',path.join(__dirname,'views'));
app.set('view engine', 'hbs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/assets',express.static(__dirname + '/public'));

// START - configure login using express-session
app.use(session({
  name: 'ITC',
  secret: 'iloveyoualwaysforever',
  saveUninitialized: true,
  resave: false,
  cookie: {secure: false}
}));
// END - configure login using express-session

//route for homepage
app.get('/',(req, res) => {
  var sql = "SELECT * FROM planing";
  var query = conn.query(sql, (err, results) => {
    if(err) throw err;
    res.render('login',{
      results: results
    });
  });
});


//route for homepage
app.get('/home',(req, res) => {
  var sql = "SELECT * FROM planing";
  var query = conn.query(sql, (err, results) => {
    if(err) throw err;
    res.render('karyawan_view',{
      results: results
    });
  });
});

//route for insert data
app.post('/save',(req, res) => {
  var data = {nama_karyawan1: req.body.nama_karyawan1, tgl_plan: req.body.tgl_plan, planing: req.body.planing};
  var sql = "INSERT INTO planing SET ?";
  var query = conn.query(sql, data,(err, results) => {
    if(err) throw err;
    res.redirect('/home');
  });
});

//route for update data
app.post('/update',(req, res) => {
  var sql = "UPDATE planing SET nama_karyawan1='"+req.body.nama_karyawan1+"', tgl_plan='"+req.body.tgl_plan+"', planing='"+req.body.planing+"' WHERE id_plan="+req.body.id;
  var query = conn.query(sql, (err, results) => {
    if(err) throw err;
    res.redirect('/home');
  });
});

//route for delete data
app.post('/delete',(req, res) => {
  var sql = "DELETE FROM planing WHERE id_plan="+req.body.id_splan+"";
  var query = conn.query(sql, (err, results) => {
    if(err) throw err;
      res.redirect('/home');
  });
});

// POST LOGIN USER
app.post('/auth', (req, res) => {
  var usernames = req.body.inputusername;
  var passwords = md5(req.body.inputpassword);
  if(usernames && passwords){
      conn.query('SELECT * FROM users WHERE usernames = ? AND  passwords = ?', [usernames, passwords], (err, hasil) => {
          if(err) throw err;
          if(hasil.length > 0){
              console.log(hasil);
              req.session.loggedin = true;
                  req.session.user = {
                      username: usernames
                  };
                  console.log('username ' + req.session.user.username + ' is login');
                  console.log("Session Before Redirect: ", req.session);
                  res.redirect('/home');
          } else {
              console.log('username ' + usernames + ' with password ' + passwords + ' is failed to login');
              res.redirect('/');
          }
      });
  } else {
      res.send('Please enter Username and Password!');
  res.end();
  }
});

app.get('/logout', (req, res) => {
  req.session.loggedin = false;
  req.session.destroy();
  res.redirect('/');

});


//server listening
app.listen(1500, () => {
  console.log('Server is running at port 9500');
});
