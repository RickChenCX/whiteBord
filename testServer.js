const   websocketServer = require('ws').Server;

var wss = new websocketServer({port:8081});

var sockets = new Array();
let backData = {
    "Type":"RESPONSE",
    "Code":200,
    "Desc":"OK",
    "From":"Alex@rtc.test.com",
    "To":"room:888@rtc.test.com",
    "DialogueID":"1f2b38472f596d72",
    "CSeq":1,
    "P-Asserted-Identity":"8888@rtc.test.com",
};
wss.on('connection',function (ws) {
    // console.log(ws);
    ws.on('message',function (msg) {
        console.log(msg);

        var that = this;

        var parse_msg = JSON.parse(msg);
        if(!parse_msg.Type){
            ws.send(msg);
        }
        switch (parse_msg.Type){
            case "SUBSCRIBE":
                if(parse_msg.Expire == 300){
                    sockets.push(that);
                    sockets.forEach(function (value,index) {
                        if(ws == that){
                            ws.send(JSON.stringify(backData));
                        }else{
                            ws.send(msg);
                        }
                    })

                }
                break;
            case "MESSAGE":
                console.log(sockets.length);
                sockets.forEach(function (ws) {
                    if(ws == that){
                        ws.send(JSON.stringify(backData));
                    }else{
                        ws.send(msg);
                    }

                })
                break;
        }

    });
    ws.on('close',function(msg){
        console.log(msg);
    })
    ws.on('error',function (error) {
        console.log(error);
    })
});

