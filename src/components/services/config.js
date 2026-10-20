import viewServiceType from "@/pages/Services/ServiceTrip/viewServiceType";

const BASE_URL = import.meta.env.VITE_API_URL;

export const APIURLS = {
  baseUrl: BASE_URL,
};

// All keys should be in camelCase sensitive
export const APICONSTANT = {
  login: "common/login/admin",
  forgotPassword: "common/forgotPassword",
  getAdminProfile: "common/admin/profile",
  addAdmin: "common/admin",
  getAdmin: "common/admin",
  deleteAdmin: "common/admin",
  editAdmin: "common/admin",

  addUser: "common/user",
  getUser: "common/user",
  editUser: "common/user",
  userStatus: "common/user",
  deleteUser: "common/user",
  activeUser: "common/user/userActive",
  inactiveUser: "common/user/userActive",
  getUserDocument: "common/document/user",
  editUserDocument: "common/document/user",
  docsStatus: "common/document/updateStatus",
  changePassword: "common/admin/changePassword",


  getUserVehicle: "common/document/vehicle",

  addPost: "common/user",
  getPost: "common/post",
  editPost: "common/user",
  deletePost: "common/user",
  activeUser: "common/user/userActive",
  inactiveUser: "common/user/userActive",
  changePassword: "common/admin/changePassword",
  post: "common/posts",

  addCountry: "common/country",
  viewCountry: "common/country",
  deleteCountry: "common/country",

  viewState: "common/state",
  deleteState: "common/state",
  addState: "common/state",
  editState: "common/state",

  viewVehicle: "creteria/vehicle",
  addVehicle: "creteria/vehicle",
  deleteVehicle: "creteria/vehicle",
  editVehicle: "creteria/vehicle",

  viewCity: "common/city",
  deleteCity: "common/city",
  addCity: "common/city",
  editCity: "common/city",

  getMenuList: "common/admin/menusLIst",
  viewAdminGroup: "common/adminGroup",
  deleteAdminGroup: "common/adminGroup",
  addAdminGroup: "common/adminGroup",
  editAdminGroup: "common/adminGroup",

  viewParcelType: "common/parcelType",
  deleteParcelType: "common/parcelType",
  addParcelType: "common/parcelType",
  editParcelType: "common/parcelType",

  viewDeliverParcel: "common/deliverParcelType",
  deleteDeliverParcel: "common/deliverParcelType",
  addDeliverParcel: "common/deliverParcelType",
  editDeliverParcel: "common/deliverParcelType",

  viewTrips: "common/trip",
  editTrips: "common/trip",
  addTrips: "common/trip",
  postbyTrips: "common/postByTripId",

  viewPost: "common/post",

  viewServiceType: "creteria/serviceType",
  addServiceType: "creteria/serviceType",
  viewPricing: "creteria/pricing",
  viewMakes: "common/make",
  viewModels: "common/model",

  viewLanguages: "module/translation/language",
  viewTranslation: "module/translation",
  singleTranslation: "module/translation/transcribe",
  generatejson: "module/translation/transcribe/generate",

  settings: "common/setting",
  updatesettings: "common/setting/app",

  getEmailGateway: "common/config/getmailconfig",
  updateEmailGateway: "common/config/setmailconfig",
  statusEmailGateway: "common/config/activemailgateway",
  getPaymentGateway: "common/config/getpaymentconfig",
  updatePaymentGateway: "common/config/setpaymentconfig",
  statusPaymentGateway: "common/config/activepaymentgateway",

  viewRating: "common/reviews",
  viewCMS: "common/help/article",

  getEmailTemplate: "common/template",
  deleteEmailTemplate: "common/template",

  dashboard: "common/report/dashboard",
  siteStatistics: "common/report/siteStatistics/tripReport",
  tripcount: "common/report/siteStatistics/tripCount",
  postcount: "common/report/siteStatistics/postCount",
  customercount: "common/report/siteStatistics/customerCount"
};
