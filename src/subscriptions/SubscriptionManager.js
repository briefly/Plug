/*
 * This file is the property of Briefly.io Limited.
 *
 * Distribution of this file and / or any of its content
 * outside of Briefly is prohibited.
 *
 */

let _ = require('underscore' ),
    NRP = require('node-redis-pubsub')

/**
 * The SubscriptionManager is designed to store a reference to all objects of interest tied to attached streams.
 *
 * It provides a single point for the Pub Sub models to be received.
 */
class SubscriptionManager {

    constructor () {

        this.subscriptions = {}

        this.addSubscription = this.addSubscription.bind(this)
        this.removeSubscription = this.removeSubscription.bind(this)
        this.handleUpdate = this.handleUpdate.bind(this)

        // Establish a Node Redis PubSub connection to monitor for update
        this.nrp = new NRP({
            port: process.env.REDIS_PORT || 10677,
            host: process.env.REDIS_HOST,
            auth: process.env.REDIS_AUTH,
            scope: process.env.REDIS_SCOPE
        })

        this.nrp.on('object-update', this.handleUpdate)

    }

    /**
     * Increment the reference counter in subscriptions
     */
    addSubscription (id, socket) {

        // Check if the subscription is already being listened to by another object
        if ( typeof this.subscriptions[id] !== 'object' ) {

            // Not already subscribed to so we will need to initialize it in the Set
            this.subscriptions[id] = [socket]

        } else {

            // Already subscribed, but increment the counter to show the reference
            this.subscriptions[id].push(socket)

        }

    }

    /**
     * Decrement the reference counter from subscriptions.
     *
     * If the reference counter hits zero as a result of the decrement, then the reference will be removed from the
     * subscription.
     */
    removeSubscription (id, socket) {

        // Check that the subscription is still present in case of crazy error otherwise we're done here
        if ( typeof this.subscriptions[id] === 'object' ) {

            // Subscription is present, decrement it
            this.subscriptions[id] = _.without(this.subscriptions[id], socket)

            // If the counter has fallen below 1 then remove it from the subscription
            if ( this.subscriptions[id].length < 1 ) {
                delete this.subscriptions[id]
            }

        }

    }

    /**
     * Process an update on a watched object
     */
    handleUpdate (data, channel) {

        // Check that the data has been received okay
        if ( typeof data.id === 'string' ) {

            // Check if any subscriptions exist for the id
            if ( typeof this.subscriptions[data.id] === 'object' ) {

                var subscribers = this.subscriptions[data.id]

                _.forEach(subscribers, function(subscriber) {

                    subscriber.handleNotification(data.id)

                })

            }

        }

    }

}

module.exports = new SubscriptionManager()