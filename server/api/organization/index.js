var express = require('express');
var router = express.Router();
var request = require('superagent');
var authenticate = require('../../components/utils.js').authenticate;
var Organization = require('../../database/models/organization.js');
var User = require('../../database/models/user.js');
var places = require('../places/places.js');


router.post('/create/github', authenticate, function(req,res){
  Organization.forge()
  .where({github_id: req.body.github_id}) // let's triple check it doesn't exist
  .fetch()
  .then(function(organization){
    if (!organization){
      if (!req.body.placeId){ // in case a place ID wasn't successfully transmitted from the front end
        places.geocodeAddress(req.body.address)
        .then(function(geometry){
          request.get('https://api.github.com/orgs/' + req.body.github_login)
          .query({access_token: req.user.access_token})
          .end(function(err,gitres){
            if (err){
              console.error('Error fetching Github org data: ' + err);
              res.status(500).send();
            } else {
                Organization.forge({
                  name: req.body.name,
                  address: req.body.address,
                  place_id: geometry[2],
                  github_id: req.body.github_id,
                  location_lat: geometry[0],
                  location_long: geometry[1],
                  github_profile: gitres
                }).save()
                  .then(function(newOrg){
                  User.forge()
                  .where({id: req.user.id})
                  .fetch()
                  .then(function(user){
                    user.set('organization_id', newOrg.get('id'))
                    .save();
                    res.status(201).send();
                  });
                }); // assign the user
              }
          });
      }); // geometry request
    } // if null place
    else {
      request.get('https://api.github.com/orgs/' + req.body.github_login)
      .query({access_token: req.user.access_token})
      .end(function(err, gitRes){
        if (err){
          console.error('Error fetching Github org data: ' + err);
          res.status(500).send(err)
        } //if err
        Organization.forge({
          name: req.body.name,
          address:req.body.address,
          place_id: req.body.placeId,
          github_id: req.body.github_id,
          github_profile: gitRes,
          location_lat: req.body.details.geometry.location.lat,
          location_long: req.body.details.geometry.location.long
        }).save()
          .then(function(newOrg){
            User.forge()
            .where({id: req.user.id})
            .fetch()
            .then(function(user){
              user.set('organization_id', newOrg.get('id'))
              .save()
              .then(function(){
                res.status(201).send();
              });
            }); // assign the user and send a response
          });
      }); // gitRes
    } // else
  }//if no org
   else res.status(409).send('Error: organization with that Github ID already exists.');
  }); // org.forge
});//router.post

module.exports = router;