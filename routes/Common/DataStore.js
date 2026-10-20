/* ************************
 * Copyright 2023
 * ABSERVETECH
 ************************ */
import * as express from 'express'
import { Enum } from '../../utils/Enum.js'

import { ConfigController as Config } from '../../controllers/DataStore/ConfigController.js'
import { PresetController as Preset } from './../../controllers/DataStore/PresetController.js'
import { ReportController as Report } from '../../controllers/DataStore/ReportController.js'
import { AuthMiddleware } from '../../middlewares/AuthMiddleware.js'
const { authorize } = AuthMiddleware

import { UploadMiddlewware } from './../../middlewares/UploadMiddleware.js'
const configFile = new UploadMiddlewware({ path: './public/' }).unknownFields
const VehicleCategoryFile = new UploadMiddlewware({ path: './public/temp/auth/vehicleCategory' })
  .singleFileUpload

const Router = express.Router()

Router.route('/common/setting').get(Config.getConfiguration)
Router.route('/common/setting/app').post(authorize([Enum.ROLES.ADMIN]), configFile, Config.updateAppConfig)

Router.route('/common/modules').get(Preset.getServiceModule)
// Language
Router.route('/common/language/exists').get(authorize([Enum.ROLES.ADMIN]), Preset.getLanguageExists)
Router.route('/common/language/:languageId?')
  .get(authorize([Enum.ROLES.ADMIN]), Preset.getAllLanguages)
  .post(authorize([Enum.ROLES.ADMIN]), Preset.createLanguage)
  .put(authorize([Enum.ROLES.ADMIN]), Preset.updateLanguage)
  .delete(authorize([Enum.ROLES.ADMIN]), Preset.deleteLanguage)

// Country

Router.route('/common/country/exists').get(authorize([Enum.ROLES.ADMIN]), Preset.getCountryExists)
Router.route('/common/country/:countryId?')
  .get(authorize([Enum.ROLES.ADMIN]), Preset.getAllCountry)
  .post(authorize([Enum.ROLES.ADMIN]), Preset.createCountry)
  .put(authorize([Enum.ROLES.ADMIN]), Preset.updateCountry)
  .delete(authorize([Enum.ROLES.ADMIN]), Preset.deleteCountry)

Router.route('/common/list/country').get(
  authorize([Enum.ROLES.ADMIN, Enum.ROLES.USER]),
  Preset.listAllCountries
)
Router.route('/common/list/state/:countryId?').get(
  authorize([Enum.ROLES.ADMIN, Enum.ROLES.USER]),
  Preset.listAllStates
)
Router.route('/common/list/city/:countryId?/:stateId?').get(
  authorize([Enum.ROLES.ADMIN, Enum.ROLES.USER]),
  Preset.listAllCities
)

// State
Router.route('/common/state/exists').get(authorize([Enum.ROLES.ADMIN]), Preset.getStateExists)
Router.route('/common/state/:stateId?')
  .get(authorize([Enum.ROLES.ADMIN]), Preset.getAllState)
  .post(authorize([Enum.ROLES.ADMIN]), Preset.createState)
  .put(authorize([Enum.ROLES.ADMIN]), Preset.updateState)
  .delete(authorize([Enum.ROLES.ADMIN]), Preset.deleteState)

// City
Router.route('/common/city/exists').get(authorize([Enum.ROLES.ADMIN]), Preset.getCityExists)
Router.route('/common/city/:cityId?')
  .get(authorize([Enum.ROLES.ADMIN]), Preset.getAllCity)
  .post(authorize([Enum.ROLES.ADMIN]), Preset.createCity)
  .put(authorize([Enum.ROLES.ADMIN]), Preset.updateCity)
  .delete(authorize([Enum.ROLES.ADMIN]), Preset.deleteCity)

// Model
Router.route('/common/model/exists').get(authorize([Enum.ROLES.ADMIN]), Preset.getModelExists)
Router.route('/common/model/:modelId?')
  .get(authorize([Enum.ROLES.ADMIN]), Preset.getAllModel)
  .post(authorize([Enum.ROLES.ADMIN]), Preset.createModel)
  .put(authorize([Enum.ROLES.ADMIN]), Preset.updateModel)
  .delete(authorize([Enum.ROLES.ADMIN]), Preset.deleteModel)

Router.route('/common/list/makes').get(authorize([Enum.ROLES.ADMIN, Enum.ROLES.USER]), Preset.listAllMakes)
Router.route('/common/list/models/:makeId?').get(
  authorize([Enum.ROLES.ADMIN, Enum.ROLES.USER]),
  Preset.listAllModels
)

// Make
Router.route('/common/make/exists').get(authorize([Enum.ROLES.ADMIN]), Preset.getMakeExists)
Router.route('/common/make/:makeId?')
  .get(authorize([Enum.ROLES.ADMIN]), Preset.getAllMake)
  .post(authorize([Enum.ROLES.ADMIN]), Preset.createMake)
  .put(authorize([Enum.ROLES.ADMIN]), Preset.updateMake)
  .delete(authorize([Enum.ROLES.ADMIN]), Preset.deleteMake)

// Currency
Router.route('/common/currency/:currencyId?')
  .get(authorize([Enum.ROLES.ADMIN]), Preset.getCurrency)
  .post(authorize([Enum.ROLES.ADMIN]), Preset.createCurrency)
  .put(authorize([Enum.ROLES.ADMIN]), Preset.updateCurrency)
  .delete(authorize([Enum.ROLES.ADMIN]), Preset.deleteCurrency)

// Reports
Router.route('/common/report/dashboard/:requestType(totalRecord|tripEarning|tripReport)?').get(
  authorize([Enum.ROLES.ADMIN]),
  Report.dashboard
)
Router.route('/common/report/siteStatistics/:requestType(tripReport|tripCount|postCount|customerCount)?').get(
  authorize([Enum.ROLES.ADMIN]),
  Report.siteStatistics
)

// vehicle colors
Router.route('/common/vehicleColor/:vehicleColorId?')
  .get(authorize([Enum.ROLES.ADMIN]), Preset.getVehicleColor)
  .post(authorize([Enum.ROLES.ADMIN]), Preset.createVehicleColor)
  .put(authorize([Enum.ROLES.ADMIN]), Preset.updateVehicleColor)
  .delete(authorize([Enum.ROLES.ADMIN]), Preset.deleteVehicleColor)

// Manufacture Year
Router.route('/common/year/:manufactureYearId?')
  .get(authorize([Enum.ROLES.ADMIN]), Preset.getManufactureYear)
  .post(authorize([Enum.ROLES.ADMIN]), Preset.createManufactureYear)
  .put(authorize([Enum.ROLES.ADMIN]), Preset.updateManufactureYear)
  .delete(authorize([Enum.ROLES.ADMIN]), Preset.deleteManufactureYear)

// Settings
Router.route('/common/settings/:page?')
  .get(authorize([Enum.ROLES.ADMIN]), Preset.getPage)
  .put(authorize([Enum.ROLES.ADMIN]), Preset.updatePage)

// Content-Mangament
Router.route('/common/help/article/:cmsId?')
  .post(authorize([Enum.ROLES.ADMIN]), Preset.createCms)
  .get(Preset.getCms)
  .put(authorize([Enum.ROLES.ADMIN]), Preset.updateCms)
  .delete(authorize([Enum.ROLES.ADMIN]), Preset.deleteCms)

// Faq Category
Router.route('/common/faqCategory/:faqCategoryId?')
  .get(authorize([Enum.ROLES.ADMIN]), Preset.getFaqCategory)
  .post(authorize([Enum.ROLES.ADMIN]), Preset.createFaqCategory)
  .put(authorize([Enum.ROLES.ADMIN]), Preset.updateFaqCategory)
  .delete(authorize([Enum.ROLES.ADMIN]), Preset.deleteFaqCategory)

// Faq
Router.route('/common/faq/:faqId?')
  .get(authorize([Enum.ROLES.ADMIN]), Preset.getFaq)
  .post(authorize([Enum.ROLES.ADMIN]), Preset.createFaq)
  .put(authorize([Enum.ROLES.ADMIN]), Preset.updateFaq)
  .delete(authorize([Enum.ROLES.ADMIN]), Preset.deleteFaq)

// Help Topics Category
Router.route('/common/helpCategory/:helpCategoryId?')
  .get(authorize([Enum.ROLES.ADMIN]), Preset.getHelpCategory)
  .post(authorize([Enum.ROLES.ADMIN]), Preset.createHelpCategory)
  .put(authorize([Enum.ROLES.ADMIN]), Preset.updateHelpCategory)
  .delete(authorize([Enum.ROLES.ADMIN]), Preset.deleteHelpCategory)

// Help Topics
Router.route('/common/helpTopic/:helpTopicId?')
  .get(authorize([Enum.ROLES.ADMIN]), Preset.getHelpTopic)
  .post(authorize([Enum.ROLES.ADMIN]), Preset.createHelpTopic)
  .put(authorize([Enum.ROLES.ADMIN]), Preset.updateHelpTopic)
  .delete(authorize([Enum.ROLES.ADMIN]), Preset.deleteHelpTopic)

// Seo Settings
Router.route('/common/seoSetting/:seoSettingId?')
  .post(authorize([Enum.ROLES.ADMIN]), Preset.createSeoSetting)
  .get(authorize([Enum.ROLES.ADMIN]), Preset.getSeoSetting)
  .put(authorize([Enum.ROLES.ADMIN]), Preset.updateSeoSetting)
  .delete(authorize([Enum.ROLES.ADMIN]), Preset.deleteSeoSetting)

// Privacy Policy
Router.route('/common/privacypolicy').get(Preset.sendPrivacypolicy).put(Preset.updatePrivacypolicy)

// Terms and conditions
Router.route('/common/tnc').get(Preset.sendTnc).put(Preset.updateTnc)

// Rider Terms and conditions
Router.route('/common/ridertnc').get(Preset.sendRiderTnc).put(Preset.updateRiderTnc)

// About us
Router.route('/common/aboutus').get(Preset.sendAboutus).put(Preset.updateAboutus)

// Refund Policy
Router.route('/common/refundPolicy').get(Preset.sendRefundPolicy).put(Preset.updateRefundPolicy)

// Cancellation Policy
Router.route('/common/cancellationPolicy')
  .get(Preset.sendCancellationPolicy)
  .put(Preset.updateCancellationPolicy)

// Safety Policy
Router.route('/common/safetyPolicy').get(Preset.sendSafetyPolicy).put(Preset.updateSafetyPolicy)

// Vehicle Category
Router.route('/common/vehicleCategory/:vehicleCategoryId?')
  .post(VehicleCategoryFile, authorize([Enum.ROLES.ADMIN]), Preset.createVehicleCategory)
  .get(authorize([Enum.ROLES.ADMIN, Enum.ROLES.USER]), Preset.getVehicleCategory)
  .put(VehicleCategoryFile, authorize([Enum.ROLES.ADMIN]), Preset.updateVehicleCategory)
  .delete(authorize([Enum.ROLES.ADMIN]), Preset.deleteVehicleCategory)

// Parcel Type
Router.route('/common/parcelType/:parcelTypeId?')
  .post(authorize([Enum.ROLES.ADMIN]), Preset.addParcelType)
  .get(authorize([Enum.ROLES.ADMIN, Enum.ROLES.USER]), Preset.getParcelType)
  .put(authorize([Enum.ROLES.ADMIN]), Preset.updateParcelType)
  .delete(authorize([Enum.ROLES.ADMIN]), Preset.deleteParcelType)

// Deliver Parcel Type
Router.route('/common/deliverParcelType/:deliverParcelTypeId?')
  .post(authorize([Enum.ROLES.ADMIN]), Preset.addDeliverParcelType)
  .get(authorize([Enum.ROLES.ADMIN, Enum.ROLES.USER]), Preset.getDeliverParcelType)
  .put(authorize([Enum.ROLES.ADMIN]), Preset.updateDeliverParcelType)
  .delete(authorize([Enum.ROLES.ADMIN]), Preset.deleteDeliverParcelType)

export { Router as DataStore }
