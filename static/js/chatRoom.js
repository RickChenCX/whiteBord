/**
 * chatRoom
 */
var test_user = randomString(16) + '@rtc.test.com';
var chat_url = "ws://localhost:8081/rtc?userid=" + test_user;
var wbs = new WebSocket(chat_url);
var Cseq = 0 ;
var refreshSubscribe;
// var displayname = randomString(16);

//聊天室subscribe信令
function subScribe(ex){
    return {
        "Type":"SUBSCRIBE",
        "Request-URI":"room:888@rtc.test.com",
        "From":test_user,
        "To":"room:888@rtc.test.com",
        "DialogueID":randomString(16),
        "CSeq":Cseq++,
        "Expire":ex,
        "P-Asserted-Identity":test_user,
        "Event":"Message-push"
    };
}
//   聊天室 message信令
function chat_room_message(data){
    return {
        "Type":"MESSAGE",
        "Request-URI":"room:888@rtc.test.com",
        "From":test_user,
        "To":"room:888@rtc.test.com",
        "DialogueID":randomString(16),
        "CSeq":Cseq++,
        "P-Asserted-Identity":test_user,
        "Content-Type":"text",
        "Body":data
    }
}
function closeWs(){
    refreshSubscribe = clearInterval();
    wbs.send(JSON.stringify(subScribe(0)))
}
function Subscribe(){
    console.log(JSON.stringify(subScribe(300)));
    wbs.send(JSON.stringify(subScribe(300)));
}
wbs.addEventListener('open',function () {
    console.log('connection to server');
    Subscribe();
    wbs.addEventListener('message',function (e) {
        var ev = JSON.parse(e.data);

        if(ev.Body && ev.Body.title == 'message' ){
            $('#message_ul').append($('<div style="text-align:left; padding-left:4px;padding-top:6px;">').text("[" + ev.Body.user + "]:"));
            $('#message_ul').append($('<div style="text-align:left;">').html('<span class="remote-message">' +ev.Body.message + '</span>'));
            var objDiv = document.getElementById("messages");
            objDiv.scrollTop = objDiv.scrollHeight;
        }else {
            console.log(ev);
            return false;
        }
    });
});

var sendMessage = function() {
    var text = $('input#chatMessage').val();
    var data = {
        title:'message',
        user:test_user,
        message:text
    };
    if (text === "") return;

    var nick = "<div class='nickName'>我:</div>";
    var message = "<div class='msg'><span class='my-message'>" + text + "</span></div>";
    var block = "<div style='text-align: right'>"+nick+message+"</div>";
    var objDiv = document.getElementById("messages");

    $('#message_ul').append(block);
    objDiv.scrollTop = objDiv.scrollHeight;
    wbs.send(JSON.stringify(chat_room_message(data) ));
    if ($('#chatMessage').val() != "") {
        $('#chatMessage').val('');
    }
}
function randomString(length = 16) {
    var str = Math.random().toString(36).substr(2);

    if (str.length >= length) {
        return str.substr(0, length);
    }
    str += randomString(length - str.length);
    return str;
}
document.onkeydown = function(e){
    var ev = document.all ? window.event : e;
    if(ev.keyCode==13) {
        sendMessage();
    }
}
