# Test Suite for Plug

The test suite is designed to give relative assurance that all the major features of Plug function correctly when a 
 change is made.

They are not designed to give assurance about plug's space in the ecosystem. For this a more throough integration
 test would need to be created.

## Connection Tests

### Endpoint Available

Test that an endpoint is made available that can be connected to by a SockJS client.

### Disconnect Test

Ensure that a disconnect by the client, simulated by running socket.destroy() on the clinet, does not cause a crash in 
 the server.
 
 
## Authentication Tests

### Succesful JWT Test

Test that a valid JWT is accepted by the socket connection and a welcome message is received.

### Invalid JWT Test

Test that an invalid JWT results in a termination of the connection.


## Notification Tests

### Subscription Test

Test that a subscription call results in an addition to the Redis datastore.

### Notification Test

Test that a push to the subscription interface results in a correctly formatted downstream from the websocket


## REST Gateway Tests

### REST Format Test

Test that a push to the request endpoint results in a correctly formatted response, using a correct request to the
 backend.
