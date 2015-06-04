var fs = require('fs');
var path = require('path');
var _ = require('underscore');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  'siteAssets' : path.join(__dirname, '../web/public'),
  'archivedSites' : path.join(__dirname, '../archives/sites'),
  'list' : path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for jasmine tests, do not modify
exports.initialize = function(pathsObj){
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

//IsUrlInList("www.google.com")
exports.readListOfUrls = function(callback){
  fs.readFile(exports.paths['list'], function(err, data) {
    var sites = data.toString().split('\n').slice(0);
    callback(sites);
  })
};

exports.isUrlInList = function(site, callback, request, response, sites){
  var found = _.contains(sites, site);
  callback(request, response, found, site);
};

exports.addUrlToList = function(site){
  fs.appendFile(exports.paths['list'], site + '\n', function (err) {
    if (err) throw err;
    // console.log('The "data to append" was appended to file!');
  });
};

exports.isURLArchived = function(){
};

exports.downloadUrls = function(){
};
