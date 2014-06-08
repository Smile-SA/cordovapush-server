#!/usr/bin/env node
/**
 * revised by Lei Niu 2014/06/08
 */

var config = require('../lib/Config'),
    web = require('../lib/Web'),
    pack = require('../package'),
    program = require('commander'),
    fs = require('fs'),
    path = require('path');

program.version(pack.version)
    .option("-c --config <configPath>", "Path to config file")
    .parse(process.argv);

var configPath = program.config;
if (configPath) {
    configPath = configPath.indexOf('/') === 0 ? configPath : path.join(process.cwd(), configPath);
    if (!fs.existsSync(configPath)) {
    	var meta = '[' + (new Date()).toISOString()+ ']:The configuration file doesn\'t exist.';
        console.log(meta);
        return program.outputHelp();
    }
} else {
		var meta = '[' + (new Date()).toISOString()+ ']:You must provide a configuration file.';
		console.log(meta);
    return program.outputHelp();
}

config.initialize(configPath);
console.log('[' + (new Date()).toISOString()+ ']:todo-server start...');
web.start();