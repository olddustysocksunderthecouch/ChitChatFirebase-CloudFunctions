/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License")
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict'

import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import { addDeviceToken, createAccount, sendMessage, createGroup, updateMessageStatus, addUnreadMessage, deleteUnreadMessages } from './functions'

admin.initializeApp()

exports.addDeviceToken = functions.https.onCall(addDeviceToken(functions, admin))
exports.createAccount = functions.https.onCall(createAccount(functions, admin))
exports.sendMessage = functions.database.ref('/messages/{chatID}/{messageID}').onCreate(sendMessage)
exports.createGroup = functions.https.onCall(createGroup(functions, admin))
exports.updateMessageStatus = functions.https.onCall(updateMessageStatus(functions, admin))
exports.addUnreadMessage = functions.database.ref('/messages/{chatID}/{messageID}').onWrite(addUnreadMessage)
exports.deleteUnreadMessages = functions.database.ref('/messages_unread/{userID}/{chatID}').onDelete(deleteUnreadMessages)
