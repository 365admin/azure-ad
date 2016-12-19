#!/usr/bin/env node

/**
 * Module dependencies.
 */
var Q = require('q');
var _ = require('lodash');
var path = require('path');

var chalk = require("chalk");
var colors = require('colors');
var log = console.log;
var program = require('commander');
var pkg = require('./package.json');

var builder = require("./commands/builder.js")
var server = require("./commands/server.js")
var pdfBuilder = require("./commands/pdfbuilder.js")


function runPromise(p) {
    return p
        .then(function () {
            process.exit(0);
        }, function (err) {
            console.log('');
            console.log(color.red(err.toString()));
            if (program.debug || process.env.DEBUG) console.log(err.stack || '');
            process.exit(1);
        });
}
console.log(pkg.name)
program
    .option('-V, --version', 'Display running versions of elsa-cli', function () {
        console.log('CLI version:', pkg.version);
    });

program
    .command('build')
    .description('Build static web site')
    .action(function (documentId) {
        console.log("Building");
        runPromise(
            builder.build()
                .then(function (files) {
                    console.log('Build completed');
                })
        );
    });

program    
    .command('serve')
    .description('Serving the static web site')
    .action(function () {
        console.log("Serving");
        server.serve('_build');
    });
    
program    
    .command('pdf')
    .description('Create PDF file ')
    .action(function (documentId) {
        console.log(">Creating PDF file");
        runPromise(
            pdfBuilder.build()
                .then(function (files) {
                    console.log('Build completed');
                })
        );
    });
    
    ;

// Parse and fallback to help if no args
if (_.isEmpty(program.parse(process.argv).args) && process.argv.length === 2) {
    program.help();
}

