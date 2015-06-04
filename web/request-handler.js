var path = require('path');
var archive = require('../helpers/archive-helpers');
var helpers = require('./http-helpers');
var fs = require('fs');
var _ = require('underscore');

var actions = {
  'GET': function(request, response) {
    console.log(request.url);
    if (request.url === "/") {
      helpers.serveAssets(response, '/index.html', function(data) {
        response.writeHead(200, helpers.headers);
        response.end(data);
      });
    } else {
      // search the public directory for the file
      fs.readdir(archive.paths['siteAssets'], function(err, files){
        if(_.contains(files, request.url.slice(1))){
          helpers.serveAssets(response, '/' + request.url, function(data) {
            response.writeHead(200, helpers.headers);
            response.end(data);
          });
        } else {
          fs.readdir(archive.paths['archivedSites'], function(err, files){
            if(_.contains(files, request.url.slice(1))){
              helpers.serveArchive(response, '/' + request.url, function(data) {
                response.writeHead(200, helpers.headers);
                response.end(data);
              });
            } else {
              response.writeHead(404, helpers.headers);
              response.end();
            }
          });
        }
      });

      // search the archives for the file
      // return 404 if not found
    }


    // } else if (request.url.slice(0,4) === '/www') {
    //   helpers.serveArchive(response, '/' + request.url, function(data) {
    //     response.writeHead(200, helpers.headers);
    //     response.end(data);
    //   });
    // } else {
    //   helpers.serveAssets(response, '/' + request.url, function(data) {
    //     response.writeHead(200, helpers.headers);
    //     response.end(data);
    //   });
    // }
  },
  'POST': function(request, response) {
    //if site exists in sites.txt, then return from data store
    //otherwise, add it to sites.txt, and server loading page
      //keep checking for site
    request.on('data', function(chunk) {
      var link = chunk.toString().slice(4);
      console.log("CHUNK IS");
      console.log(chunk.toString());
      archive.isURLArchived(link, exports.handleFound.bind(null, request, response, false), exports.handleFound.bind(null, request, response, true));
    })

  },
  'OPTIONS': function(request, response) {

  }
}

exports.handleFound = function(request, response, found, site){
  // archived.
  if(found){
    // redirect user to the site!
    response.writeHead(302, {
        'Location': site
    });
    response.end();
  }else{
    //not archived.
    // check if in sites.txt
    archive.readListOfUrls(function(sites){
      archive.isUrlInList(site, function(found, site){
        if(!found){
          archive.addUrlToList(site);
        }
      }, sites)
    });

    response.writeHead(302, {
        'Location': "loading.html"
    });
    response.end()
    // add it to sites.txt
    // redirect to loading page
  }
}

exports.handleRequest = function (request, response) {
  if (actions[request.method]) {
    actions[request.method](request, response);
  }
};



