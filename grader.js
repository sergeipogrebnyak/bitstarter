#!/usr/bin/env node

var fs = require('fs');
var program = require('commander');
var cheerio = require('cheerio');
var rest = require('restler');

var HTMLFILE_DEFAULT = "index.html";
var CHECKSFILE_DEFAULT = "checks.json";

var assertFileExists = function(infile) {
    var instr = infile.toString();
    if(!fs.existsSync(instr)) {
        console.log("%s does not exist. Exiting.", instr);
        process.exit(1); // http://nodejs.org/api/process.html#process_process_exit_code
    }
    return instr;
};


var loadChecks = function(checksfile) {
    // console.log("loading %s", checksfile);
    return JSON.parse(fs.readFileSync(checksfile));
};

var checkHtml = function(html, checksfile) {
    $ = cheerio.load(html);
    var checks = loadChecks(checksfile).sort();
    var out = {};
    for(var ii in checks) {
        var present = $(checks[ii]).length > 0;
        out[checks[ii]] = present;
    }
    var outJson = JSON.stringify(out, null, 4);
    console.log(outJson);
};

var clone = function(fn) {
    // Workaround for commander.js issue.
    // http://stackoverflow.com/a/6772648
    return fn.bind({});
};


var loadUrl = function(htmlurl, checksfile) {
    // console.log("loading url %s", htmlurl);
    rest.get(htmlurl).on('success', function(data, response) {
        checkHtml(data, checksfile);
    });
}
      

if (require.main == module) {
    program
        .option('-c, --checks <check_file>', 'Path to checks.json', clone(assertFileExists), CHECKSFILE_DEFAULT)
        .option('-f, --file <html_file>', 'Path to index.html', clone(assertFileExists), HTMLFILE_DEFAULT)
	.option('-u, --url <html_url>', 'URL to index.html') 
        .parse(process.argv);

    if (program.url) {
        loadUrl(program.url, program.checks);
    } else {
        checkHtml(fs.readFileSync(program.file), program.checks);
    }
} else {
    exports.checkHtmlFile = checkHtml;
}

