'use strict';

const Hapi = require('hapi');
var jwt = require('jsonwebtoken');
var fs  = require('fs');

const defaultHandler = (request, h) => {
    return h.response('success');
};
const server = Hapi.server({
    port: 3050,
    host: '0.0.0.0'
});

server.route({
    method: 'GET',
    path: '/'*,
    handler: (request, h) => {
        return new Promise((fullfill, reject)=> {
            const headers = request.headers
            const tokenjwt = headers['x-user'];
            var decoded = jwt.decode(tokenjwt, {complete: true});
            const output = {
                userData: decoded.payload,
                headers
            }
            fullfill(output);         
        });      
        
    }
});

server.route({
    method: 'GET',
    path: '/healthy',
    handler: (request, h) => {
        const output = {
            statusCode: 200,
        }
        return h.response(output).code(200);
    }
});


server.events.on('response', function (request) {
    console.log(request.info.remoteAddress + ': ' + request.method.toUpperCase() + ' ' + request.url.path + ' --> ' + request.response.statusCode);
    var host = request.headers; 
    Object.entries(host).forEach(
        ([key, value]) => console.log(`    ${key}: ${value}`)
      )
});

const init = async () => {
    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});
init();
