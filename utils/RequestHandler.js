/* ************************
 * Copyright 2023
 * ABSERVETECH
 ************************ */
import _ from 'lodash'
import i18n from 'i18n'

class RequestHandler {
  constructor(logger) {
    this.logger = logger
  }

  throwIf(fn, status, errorType, errorMessage) {
    return (result) => (fn(result) ? this.throwError(status, errorType, errorMessage)() : result)
  }

  validator(err, status, errorType, errorMessage) {
    if (err) {
      this.logger.log(`error in validating request : ${errorMessage}`, 'warn')
    }
    return !_.isNull(err) ? this.throwError(status, errorType, errorMessage)() : ''
  }

  throwError(status, errorType, errorMessage) {
    return (e) => {
      if (!e) e = new Error(errorMessage || 'Default Error')
      e.status = status
      e.errorType = errorType
      throw e
    }
  }

  catchError(res, error) {
    if (!error) error = new Error('Default error')
    res
      .status(error.statusCode || 500)
      .json({ type: 'error', message: error.message || 'Unhandled error', error })
  }

  sendError(req, res, error) {
    // this.logger.log(`error ,Error during processing request: ${`${req.protocol}://${req.get('host')}${req.originalUrl}`} details message: ${error.message}`, 'error');
    this.logger.log(
      `${req.method} : ${req.originalUrl} - ${error.statusCode || 500} , ${error.message}`,
      'error'
    )
    return res.status(error.statusCode || 500).json({
      type: 'error',
      message: error.message || error.message || 'Unhandled Error',
      error
    })
  }

  sendSuccess(req, res, message, status) {
    this.logger.log(`${req.method} : ${req.originalUrl} - ${status || 200}`, 'info')
    const language = req.headers['accept-language']
    return (data, globalData) => {
      let message
      const regexTest = /\|/
      if (_.isUndefined(status)) {
        status = 200
      }
      if (language && regexTest.test(data.message)) {
        const [key, fallback] = data.message.split('|')
        message = i18n.__(key, fallback)
      } else {
        message = language ? i18n.__(data.message) : data.message
      }
      res.status(status).json({
        type: 'success',
        message: message || 'Success result',
        data,
        ...globalData
      })
    }
  }
}
export { RequestHandler }
