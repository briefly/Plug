/*
 * This file is the property of Briefly.io Limited.
 *
 * Distribution of this file and / or any of its content
 * outside of Briefly is prohibited.
 *
 */

let JWTlib = require('jsonwebtoken' ),
    Socket = require('./Socket')

/**
 * The SocketManager is in charge of the connection of the server to connecting clients.
 *
 * It's primary use is to provide a handler for the overall state of the connections and provide methods for
 *  allocating new Socket instances.
 */
class SocketManager {

    constructor (server) {

        // Save the primus instance
        this.primus = server

        // Bind the handlers to the correct context
        this.handleInboundConnection = this.handleInboundConnection.bind(this)
        this.authenticateConnection = this.authenticateConnection.bind(this)

        // Bind the authentication handler
        this.primus.authorize(this.authenticateConnection)

        // Bind the handler to the primus connect event
        this.primus.on('connection', this.handleInboundConnection)

    }

    authenticateConnection (req, done) {

        // First validate that the incoming request has a JWT query token

        if ( typeof req.query.jwt !== "string" ) {
            done({
                statusCode: 401,
                message: 'Authentication Failed: No token provided'
            })
        }

        // Once we have verified that a jwt was provided, attempt to verify its integrity
        try {

            var result = JWTlib.verify(
                req.query.jwt,
                new Buffer(process.env.JWT_SECRET, 'base64'),
                { algorithms: ["HS256"] }
            )

            done(null, result)

        } catch (err) {

            done({
                statusCode: 401,
                message: 'Authentication Failed: Token Invalid'
            })

        }


    }

    handleInboundConnection (spark) {

        // Create a new socket to handle the connection
        new Socket(spark)

    }

}

module.exports = SocketManager