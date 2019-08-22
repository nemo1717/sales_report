var LocalStrategy = require('passport-local').Strategy;
var mysql = require('mysql');
var bcrypt = require('bcryptjs');

var db = mysql.createPool({
  host: 'party.cmef2c3wa0gr.us-east-2.rds.amazonaws.com',
  user: 'party',
  password: 'Layanparty17',
  database: 'partymania',

});

module.exports = function(passport) {
  passport.use(
      
      new LocalStrategy({ usernameField: 'email', passwordField: 'password' }, ( email, password, done) => {
        
        // Match email
        db.query("select * from register where email = ? ",
        email, function(err, data){

          console.log(email);
          

          if(!data.length){
            return done(null, false, { message: 'That email is not registered' });
          }


            
          else{

          

            if (data[0].status == "false"){
              return done(null, false, { message: 'You need to verify email to login. To confirm email, please check your email inbox sent to you when you registered ' });

            }
            else {

            

          
          bcrypt.compare(password, data[0].Password, (err, isMatch)=>{
            console.log(data[0].Password);

            if(err) throw err;

         
            if(isMatch){
              return done(null, data[0]);
            }
            else{
              return done(null, false, {message: 'Password is not correct'});
            }
          });
        }
        }
           
            
        });
      })
    );
      

    
    passport.serializeUser(function(user, done) {
      done(null, user.id);
    });
  
      // used to deserialize the user
    passport.deserializeUser(function(id, done) {
      db.query("select * from register where id = ?",[id],function(err,rows){
        done(err, rows[0]);
      });
    });

};