const config = require('./lib/config.js');
const fs = require('fs');
const util = require('util');
const server = require('./servers/udp.js');
const logger = require('./lib/logger');
const events  = require('events');
const { argv } = require('process');
const { count } = require('console');

let counters = {};
let keycouters = {};
let timers = {};
let timer_counters = {};
let servers_loaded ;
let pctThreshold = null;
let backendEvents = new events.eventemitter();
let keyNameSanitize = true;
let startup_time = Math.round(new Date().getTime() / 1000);

let  l ;
let  conf;
let stats = {
    messages  : {
        bad_lines:0,
        last_mssg_seen : startup_time
    }

};

//start the server function
function start_server(server , server_cnf, callbackfn){
    const s = require('server_cnf');

    if (config.debug) {
        l.log("Loading server: " + name, 'DEBUG');
    }
    server_loaded = s.start(server , callbackfn);
    if(!server_loaded){
        l.log("Failed to load server: " + name, "ERROR");
        process.exit(1);
    }


}


config.configfile(process.argv[2],function(configur){
    conf = configur;
    l = new logger.Logger(configur.log|| {});
    
    
    let prefix = conf.prefixstatsD ?? "statD";

    let bad_lines = prefix + "badlines_recieved";
    let matrices_recieved= prefix + "matrices_recieved";
    let packets_recived = prefix + "packet_recieved";
    counters[bad_lines] = 0 ;
    counters[metrices_recieved] = 0 ;
    counters[packets_recived] = 0 ;

    if(configur.keyNameSanitize !== undefined){
        keyNameSanitize = configur.keyNameSanitize;
    }
    if(!servers_loaded){
        const keyFlushInterval = Number((config.keyFlush && config.keyFlush.interval) || 0);
        const handlePacket = function(mssg , rinfo){
            counters[packets_recived]++;
            let metrices;
            packet_data = mssg.toString();
            if(packet_data.indexOf("\n") > -1){
                metrices = packet_data.split("\n");
            }
            else{
                metrices = [ packet_data ];
            }
            for(const m in matrices){
                if (metrics[midx].length === 0) {
                    continue;
                }
                counters[metrics_received]++;

                bits = matrices[m].toString().split("|#");
                let tags= [];
                if(bits.length()>1 && bits[1].length>0){
                    tags = bits[1].split(",");
                }
                bits = bits[0].split(':');
                let key = bits.shift();

                if(tags.length()>0){
                    key += ';' + tags.map(function(tag) {
                        return tag.replace(';', '_').replace(':', '=');
                    }).join(';');
                }
                key = sanitizeKeyName(key);
                
                
                if(keyFlushInterval>0){
                    if(!keycouters[key]){
                        keyCounter[key] = 0 ;

                    }
                    keycouters[key] +=1 ;
                }

                if (bits.length === 0) {
                    bits.push("1");
                }

                for(let i = 0 ; i < bits.length();i++){
                    let sampleRate = 1;
                    fields = bits.split('|');
                    if (!helpers.is_valid_packet(fields)) {
                        l.log('Bad line: ' + fields + ' in msg "' + metrics[m] +'"');
                        counters[bad_lines]++;
                        stats.messages.bad_lines_seen++;
                        continue;
                    }
                    if (fields[2]) {
                        sampleRate = Number(fields[2].match(/^@([\d\.]+)/)[1]);
                    }
                    metric_type = fields[1];
                    if (metric_type === "ms") {
                        if (! timers[key]) {
                            timers[key] = [];
                            timer_counters[key] = 0;
                        }
                        timers[key].push(Number(fields[0] || 0));
                        timer_counters[key] += (1 / sampleRate);
                    }
                    else if (metric_type === "g") {
                        if (conf.deleteGauges) {
                            gaugesTTL[key] = conf.gaugesMaxTTL;
                        }
                        if (gauges[key] && fields[0].match(/^[-+]/)) {
                            gauges[key] += Number(fields[0] || 0);
                        } else {
                            gauges[key] = Number(fields[0] || 0);
                        }
                    }
                    else if (metric_type = "s"){
                        if (! sets[key]) {
                            sets[key] = new set.Set();
                        }
                        sets[key].insert(fields[0] || '0');
                    }else{
                        if(!counters[key]){
                            counters[key] = 0;
                        }
                        counters[key]+= Number((fields[0] || 1) * 1/ sampleRate);
                    }
                }
            }
            stats.messages.last_msg_seen = Math.round(new Date().getTime() / 1000);
        };


        server_config = configur.servers || [configure];
        for(i in server_config){
            server = server.server[i] || "./servers/udp";
            start_server(server,server_config[i],handlePacket);
        }

        
        servers_loaded = true;
        pctThreshold = configur.percentThreshold || 90;
        if (!Array.isArray(pctThreshold)) {
            pctThreshold = [ pctThreshold ]; // listify percentiles so single values work the same
        }

        FlushInterval = configur.FlushInterval || 10000;
        configur.FlushInterval = FlushInterval;
        if (configur.backends) {
            for (let j = 0; j < configur.backends.length; j++) {
                loadBackend(configur, configur.backends[j]);
            }
        } else {
      
        loadBackend(config,'./backends/console');
        }

        flushint = setInterval(flushMetrices, FlushInterval);

        if(keyFlushInterval>0){
            keyFlushPercent = number((configur.keyFlush && configur.keyFlush.keyFlushPercent))/100
            keyFlushlog = (config.keyFlush && config.keyFlush.log);

            keyflushint = setInterval(function(){
                sortedKeys = [];
                for(key in keycouters){
                    sortedKeys.push(key, keycouters[key]);

                }
                sortedKeys.sort(function(a,b){return b[1]-a[1];});
                logMessage = "";
                timestring = (new Date()) + ""
                for( i = 0 , e = sortedKeys.length() * keyFlushPercent /100 ; i<e; i++) {
                    logMessage += timeString + " count=" + sortedKeys[i][1] + " key=" + sortedKeys[i][0] + "\n";
                }

                if (keyFlushLog) {
                    const logFile = fs.createWriteStream(keyFlushLog, {flags: 'a+'});
                    logFile.write(logMessage);
                    logFile.end();
                } else {
                    process.stdout.write(logMessage);
                }   
            } , keyFlushInterval)

        }

        
        
    }
});