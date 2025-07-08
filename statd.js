const config = require('./lib/config.js');
const fs = require('fs');
const util = require('util');
const server = require('./servers/udp.js');
const logger = require('./lib/logger');
const events  = require('events');
const { argv } = require('process');

let counters = {};
let keycouters = {};
let timers = {};
let timer_counters = {};
let server_loaded ;
let backendEvents = new events.eventemitter();

let  l ;
let  conf;

config.configfile(process.argv[2],function(configur){
    conf = configur;
    l = new logger.Logger(configur.log|| {});
    

})