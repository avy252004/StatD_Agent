const util = require('util');
const fs = require('fs');
const EventEmitter = require('events');
const EventEmitter = require('events').EventEmitter;

let configurator = function(file){
    let self = this;
    this.newconfig = {};
    this.oldconfig = {};
    
    this.updateconfig = function(){
        console.log('[' + process.pid + '] reading the file:' + file);
        fs.readFile(file , function(err , data){
            if(err){
                throw err;
            }
            self.oldconfig = self.newconfig;
            self.newconfig = eval('config = ' + data);
            self.emit('configchanged' , self.newconfig);
        })
    };


    this.updateconfig();
    
    fs.watch(file,function(event,file){
        if(event == 'change' && self.newconfig.automaticConfigReload != false){
            self.updateconfig();
        }
    });

};
util.inherits(configurator,EventEmitter);

exports.configurator  = configurator;

exports.configfile = function(file , callbackfn){
    let config = new configurator(file);
    config.on('configchanged',function(){
        callbackfn(config.newconfig);
    });
};