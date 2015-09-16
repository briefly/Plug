/*
 * This file is the property of Briefly.io Limited.
 *
 * Distribution of this file and / or any of its content
 * outside of Briefly is prohibited.
 *
 */

/**
 * A Socket represents a discrete client connection.
 *
 * It is used to keep track of all variables related to a socket so they can be sanitized at once to prevent memory
 *  leaks resulting from EventEmitter issues.
 *
 */
class Socket {

    constructor (spark) {

        // Save the spark
        this.spark = spark

        // Keep track of which id's we are following
        this.subscribed = []

    }

    /**
     * Handles an incoming message over the socket
     */
    handleMessage () {

    }

    /**
     * Handles a publish event
     */
    handleNotification () {

    }

    /**
     * Subscribe to an object ID
     */
    subscribe (id) {

    }

    /**
     * Unsubscribe from an object ID
     */
    unsubscribe (id) {

    }


}

module.exports = Socket