"use strict";



function isNumber(value){


    if(value === undefined ||
       value === null ||
       value === ""){

        return false;

    }


    return !isNaN(
        Number(value)
    );

}





function isInteger(value){


    return (
        typeof value === "number"
        &&
        Number.isInteger(value)
    );

}





function isValidSampleRate(value){


    if(!value)
        return false;



    if(value[0] !== "@")
        return false;



    let rate =
        value.substring(1);



    return (
        isNumber(rate)
        &&
        Number(rate) > 0
    );

}





function isValidMetricType(type){


    return [

        "c",
        "counter",
        "g",
        "gauge",
        "ms",
        "timer",
        "s",
        "set"

    ].includes(type);


}





function validatePacket(fields){



    if(!fields ||
       fields.length < 2){

        return false;

    }




    let value =
        fields[0];


    let type =
        fields[1];



    if(!isValidMetricType(type)){

        return false;

    }




    if(type === "s"){

        return true;

    }



    if(!isNumber(value)){

        return false;

    }



    if(fields[2]){


        if(!isValidSampleRate(fields[2])){

            return false;

        }

    }



    return true;

}





function sanitizeMetricName(name){


    return name
        .replace(/[^a-zA-Z0-9_:.]/g,"_");

}





function parseSampleRate(field){


    if(!field)
        return 1;


    if(field[0] !== "@")
        return 1;


    return Number(
        field.substring(1)
    );

}





function writeConfig(config,stream){


    for(
        const key in config
    ){


        if(
            typeof config[key]
            ===
            "object"
        ){


            for(
                const child in config[key]
            ){

                stream.write(
`${key}.${child}: ${config[key][child]}\n`
                );

            }


        }
        else{


            stream.write(
`${key}: ${config[key]}\n`
            );

        }


    }


}



module.exports={


    isNumber,

    isInteger,

    isValidSampleRate,

    isValidMetricType,

    validatePacket,

    sanitizeMetricName,

    parseSampleRate,

    writeConfig


};
