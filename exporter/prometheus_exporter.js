const metrics =
require("../stats");


const {

counterFormatter,

gaugeFormatter,

timerFormatter

}=require("./formatter");




function generateMetrics(){


    let output="";


    output +=
        counterFormatter(
            metrics.counters
        );



    output +=
        gaugeFormatter(
            metrics.gauges
        );



    output +=
        timerFormatter(
            metrics.timers,
            metrics.timer_counters
        );



    return output;

}



module.exports={

    generateMetrics

};