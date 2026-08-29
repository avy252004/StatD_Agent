"use strict";


class Logger {


    constructor(config = {}) {


        this.level =
            config.level || "INFO";


        this.backend =
            config.backend || "stdout";


        this.file =
            config.file || null;


        this.levels = {

            DEBUG:0,
            INFO:1,
            WARN:2,
            ERROR:3

        };


        this.currentLevel =
            this.levels[this.level] ??
            this.levels.INFO;


        if(this.backend === "file"){

            const fs=require("fs");

            this.stream =
                fs.createWriteStream(
                    this.file,
                    {
                        flags:"a"
                    }
                );

        }


    }




    shouldLog(level){


        return (
            this.levels[level]
            >=
            this.currentLevel
        );

    }





    format(level,message){


        return (
`
${new Date().toISOString()}
[${level}]
${message}
`
        );

    }




    write(message){


        if(this.backend==="file"){

            this.stream.write(message);

        }
        else{

            console.log(message);

        }


    }





    debug(message){


        if(this.shouldLog("DEBUG")){

            this.write(
                this.format(
                    "DEBUG",
                    message
                )
            );

        }

    }





    info(message){


        if(this.shouldLog("INFO")){

            this.write(
                this.format(
                    "INFO",
                    message
                )
            );

        }

    }





    warn(message){


        if(this.shouldLog("WARN")){

            this.write(
                this.format(
                    "WARN",
                    message
                )
            );

        }

    }





    error(message){


        if(this.shouldLog("ERROR")){

            this.write(
                this.format(
                    "ERROR",
                    message
                )
            );

        }

    }


}



module.exports = Logger;
