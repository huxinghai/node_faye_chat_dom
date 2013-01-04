var http = require('http'),
    fs = require('fs'),
    faye = require('faye');


var PORT = 8000,
    PUBLIC_DIR = "public";

var bayeux = new faye.NodeAdapter({mount: '/faye', timeout: 45});

var handleRequest = function(request, response){    
    var path = (request.url === '/') ? '/index.html' : request.url; 
    fs.readFile(PUBLIC_DIR + path, function(err, content){      
        
        var status = err ? 404 : 200;
        response.writeHead(status, {'Content-Type': 'text/html'});
        response.write(content || 'Not found');
        response.end();
    })
}

var server = http.createServer(handleRequest)
bayeux.attach(server)
server.listen(PORT);

bayeux.getClient().subscribe('/messages/*', function(data) {
  console.log(data.message);
});

console.log("Listening on "+ PORT )

