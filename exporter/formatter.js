// This converts:

// {
//  http_requests_total:5000
// }

// into:

// # HELP http_requests_total Total counter
// # TYPE http_requests_total counter

// http_requests_total 5000



function sanitize(name){

    return name
        .replace(/[^a-zA-Z0-9_:]/g,"_");

}



function counterFormatter(counters){

    let output="";


    for(let key in counters){

        let name=sanitize(key);


        output +=
`
# HELP ${name} StatsD counter
# TYPE ${name} counter
${name} ${counters[key]}

`;

    }


    return output;

}



function gaugeFormatter(gauges){

    let output="";


    for(let key in gauges){

        let name=sanitize(key);


        output +=
`
# HELP ${name} StatsD gauge
# TYPE ${name} gauge
${name} ${gauges[key]}

`;

    }


    return output;

}



function timerFormatter(timers,timerCounters){

    let output="";


    for(let key in timers){


        let name=sanitize(key);


        let values = timers[key];


        let count =
            timerCounters[key] || values.length;



        let sum =
            values.reduce(
                (a,b)=>a+b,
                0
            );



        output +=
`
# HELP ${name}_count Timer count
# TYPE ${name}_summary summary

${name}_count ${count}

${name}_sum ${sum}

`;

    }


    return output;

}



module.exports={

counterFormatter,

gaugeFormatter,

timerFormatter

};