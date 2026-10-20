import { vehicleCategory } from "./interface.d";
import { FetchParcelLocation } from "./app/tools/queryfn/fetch";
import { PostDetails } from "@/app/component/deliveryParcelDetails/PostDetails";
import { MyProfile } from "@/app/component/profileDetails/MyProfile";
export type LoginInputs = {
  email: string;
  password: string;
  phone?: string;
  phoneCode?: string;
  fcmId?:string
};

export type ResetPassInputs = {
  password: string;
  newpassword: string;
};
export type ChangePassInputs = {
  oldpassword: string;
  password: string;
  newpassword: string;
};
export type OtpInputs = {
  email: string;
};

export interface OTPConfig {
  otp: string;
  numInputs: number;
  separator: ReactElement | string;
  minLength: number;
  maxLength: number;
  placeholder: string;
  inputType: "text" | "number" | "tel";
}

export type SignupInputs = {
  dob:string;
  fname: string;
  lname: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  phoneCode: string;
  type: string;
  fcmId:string;
};

export type DeliverparcelInputs = {
  title: string;
  email: string;
  description: string;
  drop: string;
  pickup: string;
  pickupTime: string;
  startDate: string;
  pickupDate: string;
  dropDate: string;
  dropTime: string;
  capacity: string;
  avgPrice: string;
  pickupLng: string;
  pickupLat: string;
  dropLng: string;
  dropLat: string;
  type: string;
};

export type SendparcelInputs = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  phCode: string;
  favAddressId: string;
  address: string;
  // address2: string;
  country: string;
  state: string;
  city: string;
  pinCode: string;
  pickupAddress: string;
  dropAddress: string;
  deliveryDate: string;
  parcelBy: string;
  pickupLng: string;
  pickupLat: string;
  dropLng: string;
  dropLat: string;

  title: string;
  description: string;
  type: string;
  height: number;
  heightType: string;
  widthType: string;
  apprxSize: number;
  width: number;
  files: any;
  size: number | string;

  recvrFname: string;
  recvrLname: string;
  recvrEmail: string;
  recvrPhone: string;
  recvrPhonecode: string;
  favAddressId: string;
  country: string;
  recpincode: string;
  city: string;
  state: string;
  location: { lat: number; lng: number };
  isEnable: boolean;
  name: string;
};

export interface StatusResponse {
  status: "connected" | "not_authorized" | "unknown";
  authResponse: AuthResponse;
}

export interface AuthResponse {
  accessToken: string;
  expiresIn: number;
  reauthorize_required_in: number;
  signedRequest: string;
  userID: string;
}

export interface UserInfo {
  id: string;
  name: string;
  email: string;
}

export interface Window {
  fbAsyncInit: () => void;
  FB: any;
}

export type IInputProps = {
  type: "prev" | "next";
  onClick: (e:any) => void;
  isPrevDisabled?: boolean;
  isNextDisabled?: boolean;
};

export type OTPInputProps = {
  value?: string;
  numInputs?: number;
  onChange: (otp: string) => void;
  onPaste?: (event: ClipboardEvent<HTMLDivElement>) => void;
  renderInput: (
    props: React.InputHTMLAttributes<HTMLInputElement>,
    index: number
  ) => React.ReactNode;
  shouldAutoFocus?: boolean;
  inputType?: "text" | "number" | "tel";
  renderSeparator?: (index: number) => React.ReactNode | ReactElement;
  placeholder?: string;
  containerStyle?: React.CSSProperties | string;
  inputStyle?: React.CSSProperties | string;
  skipDefaultStyles?: boolean;
};

export interface User {
  [key: string]: any;
}
export interface Document {
  [key: string | Array]: any;
}
export interface UserState {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
  fetchProfile: () => void;

  UploadDocument: Document | null;
  FetchUploadDocument: () => void;

 
}
export interface UserState {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
  fetchProfile: () => void;
}
export type MyProfileInputs = {
  fname: string;
  lname: string;
  email: string;
  phone: string;
  dob?: string;
  phoneCode: number;
  address?: string;
  city?: string;
  country?: string;
  state?: string;
  address2?: string;
  vehicleCategory?: string;
};

export interface StoreInterface {
  email: string | null;
  setEmail: (email) => void;

  Phonecode: number | null;
  setPhonecode: (Phonecode) => void;

  Phone: number | null;
  setPhone: (Phone) => void;

  otp: string | null;
  setOtp: (otp) => void;

  token: Boolean;
  setToken: (token) => void;

  modal: {str: string,data: any} | null;
  setModal: (modal, data?) => void;

  postId: string | null;
  setPostId: (postId) => void;

  step: number | null;
  setStep: (step) => void;

  stepper: number | null;
  setStepper: (step) => void;

  Trackingstepper: number | null;
  TrackingsetStepper: (step) => void;

  TrackingStep: number | null;
  setTrackingStep: (step) => void;

  Modalstepper: number | null;
  setModalStepper: (step) => void;

  ModalStep: number | null;
  setModalStep: (step) => void;

  rememberMe: boolean | null;
  setRememberMe: (remenberMe) => void;

  loader: boolean | null;
  setLoader: (loader) => void;

  Page: number | null;
  setPage: (Page) => void;

  Limit: number | null;
  setLimit: (Limit) => void;

  CON64File: null;
  setCON64File: (CON64File) => void;

  ToggleButton: number;
  setToggleButton: (ToggleButton) => void;

  RouteIndex: number;
  setRouteIndex: (RouteIndex) => void;
  
  GooglemapLoader: false,
  setGooglemapLoader:(RouteIndex) => void;
  // next: number;
  // setNext: (next) => void
  // incrementNext:(next) => void
  // decrementNext:(next) => void
}

export interface TypeStoreInteface {
  Type: string | null;
  setType: (newType: string) => void;
}

interface Location {
  pickUp: string;
  drop: string;
  type: string;
  startCoords: [number, number];
  endCoords: [number, number];
}

interface Sender {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  phoneCode: string;
  address: string;
  country: string;
  state: string;
  city: string;
  pinCode: number;
  location: Location;
  address1: string;
  address2: string;
}

interface Parcel {
  title: string;
  description: string;
  type: string;
  height: number;
  width: number;
  heightType: string;
  widthType: string;
  image: string[];
  size: string;
  deliverBy: string;
  deliveryDate: string | null;
}

interface Receiver {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  phoneCode: string;
  address: string;
  address1: string;
  address2: string;
  country: string;
  state: string;
  city: string;
  favAddressId: string;
  pinCode: number;
  isEnable: boolean;
}

export interface ParcelObject {
  _id: string;
  sender: Sender;
  parcel: Parcel;
  receiver: Receiver;
  status: string;
  location: any;
}
export interface PostDetailsState {
  postDetails: ParcelObject | null;
  setPostDetails: (postDetails: User) => void;
  fetchPostDetails: (id) => void;

  ParcelDetails: ParcelObject | null;
  setParcelDetails: (postDetails: User) => void;
  fetchParcelDetails: (status, sortOrder, page, limit) => void;

  ParcelDetailsPostier: null;
  setParcelDetailsPostier: (ParcelDetailsPostier: User) => void;
  fetchParcelDetailsPostier: (id, sortOrder, page, limit) => void;

  findPost: [] | null;
  fetchfindPost: (id) => void;
}

export interface FetchParcelLocation {
  parcel: ParcelObject | null;
  FetchParcelLocation: (
    piclng?: any,
    piclat?: any,
    dislat?: any,
    dislng?: any,
    Type?: any
  ) => void;

  NearestMatches: [] | null;
  FetchNearestMatches: (id, page?, limit?) => void;

  Details: [] | null;
  FetchDetails: (id, type) => void;

  MyParcels: [] | null;
  total:number
  FetchMyparcels: (data) => void;

  MyTrips: [] | null;
  Triptotal:number
  FetchMyTrips: (data) => void;
  // AcceptDelivery : [] | null;
  // GetAcceptDelivery : (postId,tripid,val) => void

  MyParcelsDetails: {} | null;
  totalCount:number,
  FetchMyparcelsDetails :  (data,type) => void;

  MyTripsDetails:{} | null;
  TriptotalCount:number,
  FetchMyTripsDetails :  (id:any,type:any,droplat:any,droplng:any) => void;

  SearchTrip:[],
  SearchTripCount:number,
  FetchSearchTrip : (data) => void;

  SearchParcel:[],
  SearchParcelCount:number,
  FetchSearchParcel : (data) => void;
}

export interface vehicleCategory {
  vehicleCate: Array | null;
  FetchVehicleCate: () => void;
}
export interface ReviewStore {
  Reviews: Array | null;
  FetchReviews: (data: any) => Promise<void>;

  Notifications: Array | null;
  FetchNotifications:  (data?: any) => Promise<void>;
}
export interface Transaction {
  Transaction: [];
  fetchTransaction: (mode?: any, onYear?: any, onMonth?: any) => void;
}

export interface PaymentsMethods {
  PaymentsMethods: [] | null;
  FetchPaymentsMethods: () => void;
}
export interface Chat {
  onlineId: null;
  setOnlineId: (data) => void;

  loader: boolean;
  setLoader: (loader) => void;
  singleloader: boolean;
  setSingleLoader: (singleloader) => void;
  Chat: Array | null;
  clickedchat: Array | null;
  setChat: (data) => void;
  FetchChat: (search?) => void;

  ChatModal: boolean;
  setChatModal: (ChatModal) => void;
  SingleChat: Array | null;
  FetchSingleChat: (id) => void;

  DeleteChat: (id, channelId) => void;

  ResetMsg: (id) => void;
}
export interface FetchLocation {
  countryId: string;
  setCountryId: (countryId) => void;

  stateId: string;
  setStateId: (countstateIdryId) => void;

  cityId: string;
  setCityId: (cityId) => void;

  country: [];
  Reccountry: [];
  FetchCountry: (type?) => void;

  state: [];
  Recstate: [];
  FetchState: (id, type?) => void;

  city: [];
  Reccity: [];
  FetchCity: (cid, sid, type?) => void;

  FavLocation: [];
  FetchFavLocation: () => void;
  
  Routes: [];
  FetchRoutes: (data:any) => void;

  SingleRoutes: [],
  FetchSingleRoutes:(data:any) => void;
  // FaveLocationDelete: (id) => void
  // city :ParcelObject | null ;
  // FetchCity:(lng:any,lat:any,Type:any) =>void
}
export interface SocketState {
  socket: Socket | null;
  onlineUser: [];
  onlineStatus: Boolean | null;
  typing: Boolean | null;
  messages: any; // Replace `string` with the actual message type if needed
  lastMessageTime: Number | null;
  TriggerScrollBottom: () => void;
  setChat: (messages) => void;
  pushChat: (messages) => void;
  connect: (url: string,token:string) => void;
  disconnect: () => void;
  sendMessage: (value: any) => void; // Replace `string` with the actual message type if needed
  setRoom: (id) => void;
  lastBidding: string;
  Accepted:string;
  Declined:string;
  setlastBidding:(value) =>void
  // Typing: (id) => void
  // stopTyping:(id) => void
  // DeleteMsg:(msgid,recvrid)=>void
  // setOnlineStatus:(onlineStatus) => void
  // ActiveUser: (id,id) => void
  // InActiveUser: (id,id) => void
  SeenMessage: (channelId) => void;
  // Participants:()=>void
}

// interface.ts
export interface TypeStoreInteface {
  Type: string; // The current type state
  setType: (newType: string) => void; // A function to update the type
}


export interface UnifiedState {
    pickupLng: string;
    pickupLat: string;
    pickupAddress: string;
    dropLng: string;
    dropLat: string;
    dropAddress: string;
    pickupDate: Date | '';
    radius: string;
    sortby: string;
    pickupTime: string;
    deliveryTime: string;
    deliveryType: string;
    vehicleType: string;
    rating: string;
    minHeight: string;
    maxHeight: string;
    minWeight: string;
    maxWeight: string;
}

export interface LanguageState{
  Languages: any[],
  FetchLanguages : () => void
}