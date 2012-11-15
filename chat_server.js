var http = require('http');
var fs = require('fs');
var queue = ['Welcome to chat!'];
http.createServer(function (req, res) {
    console.log("Incoming " + req.method + " request for URL " + req.url + ".");
    if (req.method == 'GET')
    {
        fs.readFile('chat_client.html', 'UTF-8', function (err, data) {
            if (err) throw err;
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end(data);
        });
    }
    else
    {
        if (req.url == "/poll") {
            poll(res, Date.now());
        }
        else if (req.url == "/send") {
            req.setEncoding()
            req.on('data', function(data) {
                queue.push(data);
                res.writeHead(200, {'Content-Type': 'text/plain'});
                res.end('Ok!');
            });
        }
        else {
            console.log("Unknown request URL " + req.url);
            res.writeHead(402);
            res.end();
        }
    }
}).listen(1337, '127.0.0.1');
console.log('Server running at http://127.0.0.1:1337/');

var poll = function(res, startTime) {
    if (queue.length === 0) {
        if (Date.now() - startTime > 10000) {
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.end("[(< --- No messages here. --- >)]");
        }
        else {
            setTimeout(function() { poll(res, startTime); }, 10);
        }
    }
    else {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end(queue.pop());
    }
}
