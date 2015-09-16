# Plug

Plus is the websocket API used to interact with the Briefly platform.

# Scope

Plug is used to provide an interface for notifying affected clients about changes to ID's that they are trying to
 follow.
 
# Features

* JWT Authentication
* Object change notifications - When an object has been touched in the datastore

# How it Works

The system uses Primus backed by SockJS. 

A client connects and is authenticated against JWT.
 
Once the client is authenticated the socket is used in one way. It exposes a subscription endpoint that uses Redis 
 pub / sub to notify interested clients of an object change.
 
When a socket dies, the connection should clean up the pub / sub subscriptions and destroy the socket.

# Branch Model

*master*

Master is the branch that we deploy in production.

Master is a protected branch and all tests and validations must run before being merged.
 
*develop*

Develop represents the most advanced point of the project at which no active work is ongoing.

Develop is also a Protected Branch meaning that work can only be pushed to it via a Pull Request. All tests must pass in
 order for a merge to suceed.

*release*

Release is a temporary branch that is used to stage the next release on.

It is deleted once a Pull Request to master is complete and is normally only used to update the version number.

*feature/xxx*

Feature branches represent work on a discrete feature. 
They should be merged into develop via a Pull Request when they are stable.
