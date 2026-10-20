/* ************************
 * Copyright 2023
 * ABSERVETECH
 ************************ */
import Redis from '../server/Redis.js'
import { Enum } from '../utils/Enum.js'

export class RedisHelper {
  constructor(key) {
    this.Redis = new Redis()
  }

  async __addServiceRequestUser(data) {
    return new Promise(async (resolve, reject) => {
      try {
        const connectRedis = await this.Redis.getConnection()
        const keyIndex = `${Enum.SOCKET.SERVICE}:${data.userId}:${Enum.SOCKET.REQUEST}`
        let checkExist = await connectRedis.get(keyIndex)
        if (!checkExist || checkExist != data.socketId) {
          await connectRedis.del(keyIndex)
          await connectRedis.set(keyIndex, data.socketId)
          checkExist = data.socketId
        }
        resolve(checkExist)
      } catch (error) {
        console.log(error)
        reject(error.message)
      }
    })
  }

  __getServiceRequestUser(data) {
    return new Promise(async (resolve, reject) => {
      try {
        const connectRedis = await this.Redis.getConnection()
        const keyIndex = `${Enum.SOCKET.SERVICE}:${data.userId}:${Enum.SOCKET.REQUEST}`
        let checkExist = connectRedis.get(keyIndex)
        if (!checkExist) {
          // throw new Error("Not Found")
          checkExist = null
        }
        return resolve(checkExist)
      } catch (error) {
        return reject(error.message)
      }
    })
  }

  __deleteServiceRequestUser(data) {
    return new Promise(async (resolve, reject) => {
      try {
        const connectRedis = await this.Redis.getConnection()
        const keyIndex = `${Enum.SOCKET.SERVICE}:${data.userId}:${Enum.SOCKET.REQUEST}`
        let checkExist = connectRedis.get(keyIndex)
        if (checkExist) {
          await connectRedis.del(keyIndex)
          checkExist = null
        }
        return resolve(checkExist)
      } catch (error) {
        return reject(error.message)
      }
    })
  }
  __addChatUser(user) {
    console.log('useriiiid', user.userId.toString())

    return new Promise(async (resolve, reject) => {
      try {
        const connectRedis = await this.Redis.getConnection()
        // converts user object id into string
        const keyIndex = user.userId.toString()

        let checkExist = await connectRedis.get(keyIndex)
        if (!checkExist || checkExist != user.socketId) {
          await connectRedis.del(keyIndex)
          await connectRedis.set(keyIndex, user.socketId)
          checkExist = user.socketId
        }
        resolve(checkExist)
      } catch (error) {
        console.log(error)
        reject(error.message)
      }
    })
  }

  __getChatUser(user) {
    return new Promise(async (resolve, reject) => {
      try {
        const connectRedis = await this.Redis.getConnection()
        const keyIndex = user.userId
        let checkExist = connectRedis.get(keyIndex)
        if (!checkExist) {
          // throw new Error("Not Found")
          checkExist = null
        }
        return resolve(checkExist)
      } catch (error) {
        return reject(error.message)
      }
    })
  }
  __deleteChatUser(user) {
    return new Promise(async (resolve, reject) => {
      try {
        const connectRedis = await this.Redis.getConnection()
        const keyIndex = `users:${user.userId}:channel`
        let checkExist = connectRedis.get(keyIndex)
        if (checkExist) {
          await connectRedis.del(keyIndex)
          checkExist = null
        }
        return resolve(checkExist)
      } catch (error) {
        return reject(error.message)
      }
    })
  }
}
