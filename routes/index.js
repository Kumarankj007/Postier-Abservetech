/* ************************
 * Copyright 2023
 * ABSERVETECH
 ************************ */
import * as express from 'express'

import { BaseController } from './../controllers/BaseController.js'
import { Auth } from './Common/Auth.js'
import { Creteria } from './Common/Creteria.js'
import { Document } from './Common/Document.js'
import { Payment } from '../modules/Payment/index.js'
import { Trip } from './Service/Trip.js'
import { Post } from './Service/Post.js'
import { Request } from './Service/Request.js'
import { DataStore } from './Common/DataStore.js'
import { Notification } from './Common/Notification.js'
import { SubscriptionModule } from '../modules/index.js'
import { Suggestions } from '../modules/Suggestion/index.js'
import { Review } from '../modules/Review/index.js'

const Router = express.Router()
Router.get('/success', BaseController.getSuccess)
Router.get('/error', BaseController.getError)
Router.get('/validator', BaseController.getValidator)
Router.use('/', Auth)
Router.use('/', Document)
Router.use('/', Payment)
Router.use('/', Trip)
Router.use('/', Post)
Router.use('/', Request)
Router.use('/', DataStore)
Router.use('/', Notification)
Router.use('/', SubscriptionModule)
Router.use('/creteria', Creteria)
Router.use('/common', Review)
Router.use('/common', Suggestions)

export { Router }
