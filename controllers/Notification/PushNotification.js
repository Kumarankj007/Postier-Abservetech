/* ************************
 * Copyright 2023
 * ABSERVETECH
 ************************ */

import { GoogleAuth } from 'google-auth-library'
import axios from 'axios'
import { ServiceAccount } from '../../config/ServiceAccount.js'
import { BadRequestError } from '../../utils/ErrorHandler.js'
class PushNotification {
  constructor() {
    if (!PushNotification.instance) {
      // If instance doesn't exist, create it
      // Create Initial Date & Token
      this.setDate()
      this.setToken()

      this.data = 'Hello, I am a singleton!'
      PushNotification.instance = this
    }

    // Return the existing instance
    return PushNotification.instance
  }

  getToken = async () => {
    try {
      let presentToken = this.token
      const lastDate = this.getCreatedAt()
      const nowDate = new Date().getTime()
      if (this.createdAt == null || presentToken == null || lastDate < nowDate) {
        presentToken = await this.setToken()
      }
      // console.log(`Token : ${presentToken},\n,Created At : ${lastDate},\n,Now Date : ${nowDate},\n`)
      return presentToken
    } catch (error) {
      console.error('GET_TOKEN_ERROR: ', error)
      return null
    }
  }

  generateToken = async () => {
    try {
      const setAuth = new GoogleAuth({
        scopes: ['https://www.googleapis.com/auth/firebase.messaging'],
        credentials: ServiceAccount
      })
      const getClient = await setAuth.getClient()
      const getAccessToken = await getClient.getAccessToken()
      return getAccessToken.token
    } catch (error) {
      console.error('GENERATE_TOKEN_ERROR: ', error)
      return null
    }
  }

  setToken = async () => {
    try {
      const getToken = await this.generateToken()
      this.setDate()
      this.token = getToken
    } catch (error) {
      console.error('SET_TOKEN_ERROR: ', error)
      this.token = null
    }
    return this.token
  }

  getCreatedAt = () => {
    return this.createdAt
  }

  setDate = () => {
    const currentDate = new Date()
    // Here we add 50 minutes interval for generating new token
    const addOneHour = currentDate.setTime(currentDate.getTime() + 50 * 60 * 1000)
    this.createdAt = addOneHour
  }

  sendNotification = async (notify) => {
    try {
      const { pushToken = null, data = {} } = notify
      const endPoint = `https://fcm.googleapis.com/v1/projects/${ServiceAccount.project_id}/messages:send`

      const authToken = await this.getToken()
      if (!authToken) throw new BadRequestError('AUTHENDICATION_FAILED')

      const message = {
        message: {
          token: pushToken,
          notification: {
            body: data.body,
            title: data.title
          }
        }
      }

      const headers = {
        Authorization: `Bearer ${authToken}`
      }

      const sendRequest = await axios.post(endPoint, message, { headers })
      console.log(
        'sendNotification Success: ',
        JSON.stringify({ status: sendRequest?.status, body: sendRequest?.data })
      )
      return true
    } catch (error) {
      console.error('SEND_NOTIFICATION_ERROR:', error.message)
      return false
    }
  }
}

export const pushNotification = new PushNotification()
