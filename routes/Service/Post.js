/* ************************
 * Copyright 2023
 * ABSERVETECH
 ************************ */
import * as express from 'express'
import { PostController as Post } from '../../controllers/Service/PostController.js'
import { Enum } from '../../utils/Enum.js'
import { AuthMiddleware } from '../../middlewares/AuthMiddleware.js'
const { authorize } = AuthMiddleware

import { UploadMiddlewware } from './../../middlewares/UploadMiddleware.js'
const AuthFile = new UploadMiddlewware({ path: './public/temp/auth/Parcel' }).multipleKnownFields

const Router = express.Router()

// Posts Api's
// Homepage
Router.route('/common/post/search').get(Post.searchForPosts)
Router.route('/common/post/detail/:postId').get(Post.getDetailPost)

// Estimate
Router.route('/common/post/estimation').post(
  authorize([Enum.ROLES.ADMIN, Enum.ROLES.USER]),
  Post.getPostEstimation
)

// CRUD
Router.route('/common/post/:postId?')
  .get(authorize([Enum.ROLES.ADMIN, Enum.ROLES.USER]), Post.getPost)
  .post(AuthFile, authorize([Enum.ROLES.ADMIN, Enum.ROLES.USER]), Post.createPost)
  .put(authorize([Enum.ROLES.ADMIN, Enum.ROLES.USER]), AuthFile, Post.updatePost)
  .delete(authorize([Enum.ROLES.ADMIN, Enum.ROLES.USER]), Post.deletePost)

// Update Sender Receiver
Router.route('/common/participants/:postId').put(authorize([Enum.ROLES.USER]), Post.updateSenderReceiver)

// Search Suggestion
Router.route('/common/searchSuggestion').get(authorize([Enum.ROLES.USER]), Post.postRouteSuggestion)

// Publish Post
Router.route('/common/publishPost/:postId?').put(
  authorize([Enum.ROLES.ADMIN, Enum.ROLES.USER]),
  Post.postPublish
)

// Get Routes
Router.route('/common/makePayment').post(Post.makePayment)

// Get Review
Router.route('/common/postReview/:postId').get(Post.getPostReviews)

export { Router as Post }
