# ChitChat Firebase Cloud Functions

## Install instructions
### To install

- Run git clone https://github.com/olddustysocksunderthecouch/ChitChat-FirebaseCloudFunctions.git
- Run ```npm install```
- Edit .firebaserc in the root folder to point to your project

### Deployment
- Run ```firebase deploy```

## List of functions

### 1. addDeviceToken
_Add a unique device to a users list of devices_
#### Object Structure
- TBD

### 2. createAccount
_Create a new user account_
#### Object Structure
- TBD


### 3. sendMessage
_Send a new message to an existing contact_
#### Object Structure
- TBD

### 4. createGroup
_Create a new group_
#### Object Structure
- TBD

### 5. updateMessageStatus
_Update message status (sent | read)_
#### Object Structure
- TBD

### 6. addUnreadMessage
_Add a sent message to unread messages node to be counted_
#### Object Structure
- TBD

### 7. deleteUnreadMessage
_Set unread message count to 0_
#### Object Structure
- TBD

### 8. createNewChat
_Send a new message to an new contact_
#### Object Structure
- TBD

### 9. leaveChat
_Leave a group_
#### Object Structure
- TBD

## Understanding Database rules

### Rule guidelines
https://gist.github.com/codediodeio/6dbce1305b9556c2136492522e2100f6
