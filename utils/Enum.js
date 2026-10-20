/* ************************
 * Copyright 2023
 * ABSERVETECH
 ************************ */
const Enum = {
  ROLES: {
    ADMIN: 'ADMIN',
    USER: 'USER',
    COMPANY: 'COMPANY'
  },
  VERIFICATION: {
    LOGIN: 'LOGIN',
    REGISTRATION: 'REGISTRATION',
    CHANGEPASSWORD: 'CHANGEPASSWORD',
    FORGETPASSWORD: 'FORGETPASSWORD',
    VERIFICATION: 'VERIFICATION'
  },
  ERROR: {
    SOMETHING_WENT_WRONG: 'SOMETHING_WENT_WRONG',
    UNAUTHORIZED: 'UNAUTHORIZED',
    LOGICAL_ERROR: 'LOGICAL_ERROR'
  },
  SOCKET: {
    SERVICE: 'SERVICE',
    REQUEST: 'REQUEST',
    CHAT: 'CHAT',
    USER: 'USER',
    LOCATION: 'LOCATION'
  },
  PAYMENT: {
    MODULES: {
      TRIP: 'TRIP',
      PAYOUT: 'PAYOUT',
      SUBSCRIPTION: 'SUBSCRIPTION',
      ADJUSTMENT: 'ADJUSTMENT',
      REFUND: 'REFUND'
    },
    STATUS: {
      PENDING: 'PENDING',
      ACCEPTED: 'ACCEPTED',
      REFUNDED: 'REFUNDED',
      APPROVED: 'APPROVED',
      REJECTED: 'REJECTED'
    },
    MODE: {
      CREDIT: 'CREDIT',
      DEBIT: 'DEBIT'
    }
  },
  TRIP: {
    PAYMENT_MODE: {
      CASH: 'CASH',
      CARD: 'CARD',
      STRIPE: 'STRIPE'
    },
    STATUS: {
      PENDING: 'Pending',
      PUBLISHED: 'Published',
      ACCEPTED: 'Accepted',
      TRANSIT: 'Transit',
      DELIVERED: 'Delivered',
      RECEIVED: 'Received',
      FINISHED: 'Finished',
      CANCELLED: 'Cancelled',
      NORESPONSE: 'Noresponse',
      REQUESTED: 'Requested',
      ASSIGNED: 'Assigned',
      CALLED: 'Called',
      DECLINED: 'Declined',
      BIDDED: 'Bidded',
      HOLD: 'Hold',
      PICKEDUP: 'Pickedup'
    },
    PAYMENT_STATUS: {
      PAID: 'PAID',
      UNPAID: 'UNPAID'
    },
    DISTANCEMETRIC: {
      METER: 'METER',
      KILOMETER: 'KILOMETER',
      MILE: 'MILE'
    },
    TIMEMETRIC: {
      SECOND: 'SECOND',
      MNIUTE: 'MINUTE',
      HOUR: 'HOUR'
    }
  },
  NOTIFICATION: {
    TYPE: {
      PUSHNOTIFICATION: 'PUSHNOTIFICATION',
      INACCOUNT: 'INACCOUNT',
      MAIL: 'MAIL',
      SMS: 'SMS'
    },
    SEVERITY: {
      INFO: 'INFO',
      WARNING: 'WARNING',
      DANGER: 'DANGER'
    },
    STATUS: {
      SUCCESS: 'SUCCESS',
      FAILURE: 'FAILURE'
    }
  },
  SOCKET: {
    SERVICE: 'SERVICE',
    REQUEST: 'REQUEST',
    CHAT: 'CHAT',
    USER: 'USER',
    LOCATION: 'LOCATION'
  },
  USER: {
    STATUS: {
      ACTIVE: 'Active',
      PENDING: 'Pending',
      INACTIVE: 'Inactive',
      BLOCKED: 'Blocked'
    }
  }
}

export { Enum }
