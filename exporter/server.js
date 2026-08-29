const http=require("http");


const config=require("./config");


const exporter=
require("./prometheus_exporter");




function start(){


const server =
http.createServer(
(req,res)=>{


    if(req.url === "/metrics"){


        let data =
        exporter.generateMetrics();



        res.writeHead(
            200,
            {
             "Content-Type":
             "text/plain; version=0.0.4"
            }
        );


        res.end(data);


        return;

    }



    res.writeHead(404);

    res.end("Not Found");


});



server.listen(

config.port,

config.host,

()=>{

console.log(
`Prometheus exporter listening on ${config.port}`
);

}

);


}



module.exports={
    start
};