/*
 * This file is the property of Briefly.io Limited.
 *
 * Distribution of this file and / or any of its content
 * outside of Briefly is prohibited.
 *
 */

let Ampere = require( 'ampere' ),
    SubscriptionManager = require( '../subscriptions/SubscriptionManager' ),
    _ = require('underscore')

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
        this.subscriptions = []

        // Bind classes because ES6 seriously hasn't fixed this shit yet.
        this.handleMessage = this.handleMessage.bind(this)
        this.handleNotification = this.handleNotification.bind(this)
        this.subscribe = this.subscribe.bind(this)
        this.unsubscribe = this.unsubscribe.bind(this)
        this.cleanUp = this.cleanUp.bind(this)

        // Bind the event handlers
        spark.on('data', this.handleMessage)
        spark.on('end', this.cleanUp)

    }

    /**
     * Handles an incoming message over the socket
     */
    handleMessage (message) {

        // Check that the message is carrying a briefly format signature, else discard it
        if ( typeof message.format === 'string' && message.format === 'briefly' ) {

            // If the message is a subscription pass that along
            if ( message.type === 'subscribe' ) {

                this.subscribe(message.data.id)

                this.spark.write(new Ampere('subscribe-success', {
                    id: message.data.id
                }))

            } else if ( message.type === 'unsubscribe' ) {

                this.unsubscribe(message.data.id)

                this.spark.write(new Ampere('unsubscribe-success', {
                    id: message.data.id
                }))

            }

        }

    }

    /**
     * Handles a publish event
     */
    handleNotification (id) {

        // Push a change notification downstream to the spark
        this.spark.write(new Ampere('object-update', {
            id: id
        }))

    }

    /**
     * Subscribe to an object ID
     */
    subscribe (id) {

        // Add subscription to the local sub list
        this.subscriptions.push(id)

        // Add to global subscriptions
        SubscriptionManager.addSubscription(id, this)

    }

    /**
     * Unsubscribe from an object ID
     */
    unsubscribe (id) {

        // Remove the subscription from the sub list
        this.subscriptions = _.without(this.subscriptions, id)

        // Remove from global subscriptions
        SubscriptionManager.removeSubscription(id, this)

    }

    /**
     * Clean up the socket connection
     */
    cleanUp () {

        // Iterate over each subscription and remove its reference
        _.forEach(this.subscriptions, function(subscription) {

            // Remove reference to all of this sockets subscriptions
            SubscriptionManager.removeSubscription(subscription)

        })

        // Unassign socket to help garbage collector along
        this.spark = null
    }


}

module.exports = Socket