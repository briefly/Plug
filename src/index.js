/*
 * This file is the property of Briefly.io Limited.
 *
 * Distribution of this file and / or any of its content
 * outside of Briefly is prohibited.
 *
 */

// Bootstrap the Environment
var dotenv = require('dotenv')
dotenv.load()

// Create a new Primus server
var Primus = require('primus')

var server = new Primus.createServer({
    port: process.env.PORT_NUMBER || 9090,
    // Disable HTTPS warning because we deal with WSS unwrapping at the load balancer level,
    transformer: "sockjs",
    iknowhttpsisbetter: true
})

// Initialize a Socket Manager instance
var SocketManager = require('./sockets/SocketManager')
var managerInstance = new SocketManager(server)

// Report to Cloud66 handler if set that the server is operational