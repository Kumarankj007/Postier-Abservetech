/* ************************
 * Copyright 2023
 * ABSERVETECH
 ************************ */
import multer, { diskStorage } from 'multer'
import path from 'path'
import { BadRequestError } from '../utils/ErrorHandler.js'

class UploadMiddlewware {
  constructor(storageObject) {
    this.storagePath = storageObject.path || './public/temp/'
    // this.fileTypes = storageObject.fileTypes || ''
    if (storageObject.fileTypes instanceof RegExp) {
      this.fileTypes = storageObject.fileTypes
    } else if (typeof storageObject.fileTypes === 'string' && storageObject.fileTypes.trim() !== '') {
      this.fileTypes = new RegExp(storageObject.fileTypes, 'i')
    } else {
      this.fileTypes = /(jpeg|jpg|png|webp|gif|svg|)$/i // default allowed types
    } 

    this.fileParam = storageObject.fileParam || 'file'
    this.fileFields = storageObject.fileFields || [
      { name: 'primaryImage', maxCount: 1 },
      { name: 'topviewImage', maxCount: 1 },
      { name: 'frontviewImage', maxCount: 1 },
      { name: 'sideviewImage', maxCount: 1 }
    ]

    this.multer = multer
    this.diskStorage = diskStorage
  }

  get storageConfig() {
    return this.diskStorage({
      filename: (req, file, cb) => {
        try {
          const filetypes = this.fileTypes
          const newFileName = file.fieldname + '-' + Date.now() + path.extname(file.originalname)
          if (filetypes && filetypes != '') {
            const mimetype = filetypes.test(file.mimetype)
            const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
            if (!mimetype || !extname) throw new BadRequestError('File not match our extentions.')
          }
          cb(null, newFileName)
        } catch (Error) {
          return cb(new Error(Error.message), null)
        }
      },
      destination: (req, file, cb) => {
        cb(null, this.storagePath)
      }
    })
  }

  fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase()
    
    const mimetype = file.mimetype.toLowerCase()

    if(!this.fileTypes?.test(ext) || !this.fileTypes?.test(mimetype)) {
      return cb(new BadRequestError('Invalid file type. Only image files are allowed'), false)
    }
    cb(null, true)
  }

  get multerConf() {
    return this.multer({
      storage: this.storageConfig,
      fileFilter: this.fileFilter,
      limits: { fileSize: 10 * 1024 * 1024 }
    })
  }

  get singleFileUpload() {
    return this.multerConf.single(this.fileParam)
  }

  get multipleKnownFields() {
    return this.multerConf.fields(this.fileFields)
  }

  get unknownFields() {
    return this.multerConf.any()
  }
}

export { UploadMiddlewware }
