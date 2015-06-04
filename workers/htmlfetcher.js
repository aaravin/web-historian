// eventually, you'll have some code here that uses the code in `archive-helpers.js`
// to actually download the urls you want to download.
var archive = require('../helpers/archive-helpers');
var _ = require('underscore');

var fetch = function(){
  // invokes a callback on the list of urls in sites.txt
  archive.readListOfUrls(function(sites){
    _.each(sites, function(site){
      // isURLArchived calls callback if site not archived
      archive.isURLArchived(site, function(site){
        archive.downloadUrls(decodeURIComponent(site));
      })
    });
  })
}

fetch();

