var express = require("express");
var app = express();
var server  = require("http").Server(app);
var io = require("socket.io")(server);
var log4js = require("log4js");
var logger = log4js.getLogger();
var port = 3000;
logger.debug('Script has been started...');
server.listen(port);
app.use(express.static(__dirname + '/public'));

io.on('connection', function (socket) {
    console.log("user connected");
    //var name = 'U' + (socket.id).toString().substr(1,4);
    //socket.broadcast.emit('newUser', name);

    //logger.info(name + ' connected to chat!');
    // Обработчик ниже // Мы его сделали внутри коннекта
    socket.on('userAdd', function(userName){
        socket.broadcast.emit('newUser', userName);
        socket.emit('userName', userName);
        console.log('userAdd');
        console.log(userName);
    });
    socket.on('message', function(msg, userName){ // Обработчик на событие 'message' и аргументом (msg) из переменной message
        logger.warn('-----------'); // Logging
        console.log(userName);
        //socket.broadcast.emit('newUser', userName);
        logger.warn('User: ' + userName + ' | Message: ' + msg);
        logger.warn('====> Sending message to other chaters...');
        io.sockets.emit('messageToClients', msg, userName); // Отправляем всем сокетам событие 'messageToClients' и отправляем туда же два аргумента (текст, имя юзера)
    });
});