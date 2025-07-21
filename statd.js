const config = require('./lib/config.js');
const fs = require('fs');
const util = require('util');
const server = require('./servers/udp.js');
const logger = require('./lib/logger');
const events  = require('events');
const { argv } = require('process');
const { count } = require('console');
const pm = require('./lib/process_metrices')

let counters = {};
let keycouters = {};
let timers = {};
let timer_counters = {};
let servers_loaded ;
let pctThreshold = null;
let backendEvents = new events.eventemitter();
let keyNameSanitize = true;
let startup_time = Math.round(new Date().getTime() / 1000);
let set = {};
let counter_rates = {};
let time_lag;

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
        l.log("Loading server: " + server_cnf, 'DEBUG');
    }
    server_loaded = s.start(server , callbackfn);
    if(!server_loaded){
        l.log("Failed to load server: " + server_cnf +  "ERROR");
        process.exit(1);
    }


}

//startt eh backed srver by default console for flushin the metrices
function backendServer(backend_config,name){
    const backendmod = require('name');
    if(backend_config.debug){
        l.log("loading the backend srver:" + name , "DEBUG" );

    }

    ret = backendmod.start(startup_time , backend_config, backendEvents , l);
    if(!ret){
        l.log("faild to start" + name , "ERROR" );
    }
    
}

function flushMetrices(){
    let matric_hash={
        counters : counters,
        timers : timers,
        timer_counters : timer_counters,
        gauges : gauges,
        pctThreshold: pctThreshold,
        histogram : conf.histogram,
        sets : set,
        counter_rates : counter_rates
    };
    let time_stamp = Math.round(new Date().getTime() / 1000);
    if(old_time_Stamp>0){
        gauges[time_lag] = (time_stamp - old_time_Stamp - (number(conf.FlushInterval /1000)));
    }
    backendEvents.on('flush',function(time_stamp,matrices){
        console.log(`Clearing metrics at ${new Date(time_stamp).toISOString()}`);

        // clear counter
        let deletecounters = conf.deletecounters || false;
        if(deletecounters){
            for(key in matrices.counters){
                if(key.indexOf("badlines_recieved")!= 0 || key.indexOf("matrices_recieved")!= -1|| key.indexOf("packet_recieved")!=-1){
                    matrices.counter[keys] = 0;
                }else{
                    delete(matrices.counter[key]);
                }
            }

        }else{
            for(key in counters){
                matrices.counters[key] = 0;
            }
        }

        //cleart timer and timer_counter;
        let deletetimer = conf.deletetimer || false;
        for(keys in matrices.timers){
            if(deletetimer){
               delete(matrices.timers[key]);
               delete(matrices.timer_counters[key]);
            }
            else{
                matrices.timers[key] = [];
                matrices.timer_counters[key] = 0;
            }
        }

        //delete gauges
        let deleteGauges = conf.deleteGauges;
        if(deleteGauges){
            for(key in matrices.gauges){
                matrices.gaugesTTL[key]--;
                if(gaugesTTL[key]<1){
                    delete matrices.gauges[key];
                    delete matrices.gaugesTTL[key];
                }
            }
        }

        //delete the sets
        conf.deleteSets = conf.deleteSets || false;
        for (const set_key in metrics.sets) {
            if (conf.deleteSets) {
                delete(metrics.sets[set_key]);
            } else {
                metrics.sets[set_key] = new set.Set();
            }
        }
    })

}


function getflusinterval(interval)
{
    const now = new Date.getTime();
    const delta = now - startup_time*1000;
    const timeoutattempt = Math.round(delta/interval)+1;
    const finaltimeinterval = (startup_time *1000 + timeoutattempt*interval) - now;
    return finaltimeinterval;
}


config.configfile(process.argv[2],function(configur){
    conf = configur;
    l = new logger.Logger(configur.log|| {});
    
    
    let prefix = conf.prefixstatsD ?? "statD";

    let bad_lines = prefix + "badlines_recieved";
    let metrices_recieved= prefix + "matrices_recieved";
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

        backendServer(configur,"./backend/console");


        pctThreshold = configur.percentThreshold || 90;
        if (!Array.isArray(pctThreshold)) {
            pctThreshold = [ pctThreshold ]; // listify percentiles so single values work the same
        }

        FlushInterval = configur.FlushInterval || 10000;
        configur.FlushInterval = FlushInterval;
        // if (configur.backends) {
        //     for (let j = 0; j < configur.backends.length; j++) {
        //         loadBackend(configur, configur.backends[j]);
        //     }
        // } else {
      
        // loadBackend(config,'./backends/console');
        // }

        flushint = setTimeout(flushMetrices, getflusinterval(FlushInterval));

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
                
                keycouters = {};
            } , keyFlushInterval)

        }

        
        
    }
});