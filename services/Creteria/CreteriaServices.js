/* ************************
 * Copyright 2023
 * ABSERVETECH
 ************************ */
import { BaseService } from '../BaseService.js'
import path from 'path'
import mongoose from 'mongoose'
import * as fs from 'fs'
import ServiceType from '../../models/Creteria/ServiceType.js'

class CreteriaService extends BaseService {
  static getServicesType = async (query) => {
    let response = {
      status: false,
      data: {},
      message: 'UNPROCESSABLE_ENTITY'
    }
    try {
      const findCondition = []
      if (query._id) findCondition.push({ _id: mongoose.Types.ObjectId(query._id) })

      if (query.name) findCondition.push({ name: query.name })

      const account = await ServiceType.findOne({ $or: findCondition }).exec()

      if (!account) throw new Error('NOT_FOUND|SERVICE_TYPE')

      response.status = true
      response.data = {
        Language: account
      }
      response.message = 'FOUND|SERVICE_TYPE'
    } catch (error) {
      response = {
        status: false,
        data: {},
        message: error.message || response.message
      }
    }
    return response
  }

  static makeDirectory = async (pathUrl) => {
    let response = {
      status: false,
      data: {},
      message: 'UNPROCESSABLE_ENTITY'
    }
    try {
      const movePath = {
        newPath: pathUrl
      }
      if (fs.existsSync(pathUrl)) {
        movePath['exist'] = true
      } else {
        fs.mkdirSync(pathUrl)
        movePath['exist'] = false
      }
      response = {
        status: true,
        data: movePath,
        message: 'UNPROCESSABLE_ENTITY'
      }
    } catch (error) {
      console.error('MAKE_DIRECTORY', error)
      response = {
        status: false,
        data: {},
        message: error.message || response.message
      }
    }
    console.log(response)
    return response
  }

  static moveFile = async (path1, path2) => {
    let response = {
      status: false,
      data: {},
      message: 'UNPROCESSABLE_ENTITY'
    }
    try {
      await new Promise((resolve, reject) => {
        fs.rename(path1, path2, (err, resp) => {
          if (err) reject(err)
          else resolve(true)
        })
      })
      response = {
        status: true,
        data: {},
        message: 'FILE_MOVED'
      }
    } catch (error) {
      console.error('MOVE_FILE', error)
      response = {
        status: false,
        data: {},
        message: error.message || response.message
      }
    }
    return response
  }

  static removeFile = async (data) => {
    let response = {
      status: false,
      data: {},
      message: 'UNPROCESSABLE_ENTITY'
    }
    try {
      fs.unlinkSync(data)
      return true
    } catch (error) {
      response = {
        status: false,
        data: {},
        message: error.message || response.message
      }
    }
    return response
  }

  static removeDirectory = async (data) => {
    let response = {
      status: false,
      data: {},
      message: 'UNPROCESSABLE_ENTITY'
    }
    try {
      fs.rmdirSync(data)
      return true
    } catch (error) {
      response = {
        status: false,
        data: {},
        message: error.message || response.message
      }
    }
    return response
  }

  static uploadDoc = async (documentData, pathUL, body, dbData) => {
    let response = {
      status: false,
      data: {},
      message: 'UNPROCESSABLE_ENTITY'
    }
    try {
      const removeOldFiles = []
      let findFile = {}

      const fieldArr = []
      for (const document of documentData.fields) {
        const fieldData = {
          name: document.indexName
        }
        let findField
        if (dbData) {
          findFile = dbData.find((e) => e.name == body.fieldName)
          if (findFile && findFile.status == 'rejected') {
            findFile.status = 'pending'
            findFile.reason = ''
          }
        }
        if (findFile && findFile.fields) {
          findField = findFile.fields.find((e) => e.name == document.indexName)
        }
        if (document.type == 'image') {
          const imagePath = body.files.find((elem) => elem.fieldname == document.indexName)
          if (imagePath) {
            // Remove Existing File
            if (findField) {
              removeOldFiles.push(pathUL + '/' + findField.value)
            }
            const getPath = await CreteriaService.makeDirectory(pathUL)
            if (!getPath.status) throw new Error(getPath.message)
            const directory = getPath.data.newPath + '/' + path.basename(imagePath.path)
            await CreteriaService.moveFile(imagePath.path, directory)
            fieldData['value'] = path.basename(imagePath.path)
          } else {
            fieldData['value'] = findField && findField.value ? findField.value : ''
          }
        } else if (document.type == 'string') {
          fieldData['value'] = body[document.indexName] || findField.value
        } else if (document.type == 'date') {
          let dateData = body[document.indexName] || findField.value
          dateData = new Date(dateData)
          dateData.setHours(0, 0, 0, 0)
          fieldData['value'] = dateData.toISOString()
        }
        fieldArr.push(fieldData)
      }
      response['data']['removeOldFiles'] = removeOldFiles
      response['data']['fieldArr'] = fieldArr
      response['data']['findFile'] = findFile
      response['status'] = true
      response['message'] = 'success'
    } catch (error) {
      console.error('Upload Docs Error: ', error)
      response = {
        status: false,
        data: {},
        message: error.message || response.message
      }
    }
    return response
  }
}

export { CreteriaService }
