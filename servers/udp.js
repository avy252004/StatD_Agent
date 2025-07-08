const dgram = require('dgram');

// const fs = require('fs')
exports.start = function(config , callback) {
    udp_version = config.address_ipv6 ? 'udp6' : 'udp4';
    server = dgram.createSocket(udp_version, callback);
    server.bind(config.port || 8125 , config.address || undefined);
    
    this.server = this.server;
    return true;
}
