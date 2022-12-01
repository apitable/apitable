# Client collaboration



## Basic process


1. After the client is loaded, a socket will be allocated to establish a link with the co-server.
2. The user opens a datasheet and enters the room of the datasheet. One page is one room, and all table operations involved in the page are coordinated in one room.
3. After the user makes a change operation, the operation record will be sent to the collaborative server.
4. The co-server receives the request.
5. The cooperative server broadcasts the processed request to the corresponding room.
6. The room where the client is located receives the request. Execute the corresponding processing logic.


### Association table description

1. The user opens form `A` and enters the room where the form is located.
2. The `A` table is associated with the `B` and `C` tables, and the user will also join the rooms of the `B` and `C` tables.



## Synchronization instructions


### Make a request

| reqType | name | note |
|-------------------|-----------------|------------ ---------------------------------------|
| \ | watch | After the client is loaded, a socket will be allocated to connect to the co-server |
| USER_CHANGES | sendUserChanges | The user generates a change request and sends it to the collaborative server |
| SWITCH_DATASHEET | switchDatasheet | User switches from one sheet (which may not exist) to another sheet |
| ACTIVATE_COLLABORATORS | Activate collaborators | Display user avatar in the interface |
| DEACTIVATE_COLLABORATOR | Deactivate collaborators | Hide user avatars, users will automatically deactivate collaborators when closing the page |
| ENGAGEMENT_CURSOR | sendCursor | When the user clicks on a cell, the active cell cursor is sent to the collaborative server |
| \ | unwatch | Client disconnects from companion |


### Accept the request

| recType | name | note |
|-------------------|----------------------------|- -----------------------------------------|
| NEW_CHANGES | handleNewChanges | Change requests made by other users in the room |
| ENGAGEMENT_CURSOR | handleCursor | Other users in the room, the active cell cursor changes |
| ACTIVATE_COLLABORATORS | handleUserEnter | New collaborator activated |
| DEACTIVATE_COLLABORATOR | handleUserLeave | A collaborator has left |
| SWITCH_DATASHEET | handleUserSwitchDatasheet | A user switched to another sheet, but did not leave the room |