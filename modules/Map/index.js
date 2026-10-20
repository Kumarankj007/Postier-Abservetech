/* ************************
 * Copyright 2023
 * ABSERVETECH
 ************************ */
import DistanceLogs from './DistanceLog.js'
import RoutePath from './RoutePath.js'
import GoogleDistanceMatrix from 'google-distance-matrix'
import { Config } from '../../config/AppConfig.js'
import { StaticMap } from './StaticMap.js'
import fs from 'fs'
import * as turf from '@turf/turf'
import axios from 'axios'
import length from '@turf/length'

import { Helpers } from '../../helpers/Function.js'
import { Enum } from '../../utils/Enum.js'
import { BadRequestError } from '../../utils/ErrorHandler.js'

class MapServices {
  static getLocationData = async (origin, destination, metrics = {}) => {
    let response = {
      status: false,
      message: 'unprocessable',
      data: {}
    }
    try {
      const { distanceMetric = Config.app.distanceMetric, timeMetric = Config.app.timeMetric } = metrics
      let locationData = await DistanceLogs.findOne({
        origin: origin,
        destination: destination
      })
        .lean()
        .exec()

      if (!locationData) {
        const addLocation = await this.addLocation(origin, destination)
        if (!addLocation.status) {
          throw new Error(addLocation.message || 'Something Went Wrong!')
        }
        locationData = addLocation.data
      }
      // const dis = await this.calculateDistanceBetweenTwoPoints(origin, destination)
      // console.log('nearDis', dis)

      // Meter to Miles multiplier 0.000621371
      // Meter to kilo multiplier 0.001
      if (distanceMetric == Enum.TRIP.DISTANCEMETRIC.MILE)
        locationData.distanceValue = Helpers.roundOff(locationData.distanceValue * 0.000621371)
      else if (distanceMetric == Enum.TRIP.DISTANCEMETRIC.KILOMETER)
        locationData.distanceValue = Helpers.roundOff(locationData.distanceValue * 0.001)
      else locationData.distanceValue = locationData.distanceValue

      if (timeMetric == Enum.TRIP.TIMEMETRIC.MNIUTE)
        locationData.timeValue = Math.ceil(Helpers.roundOff(locationData.timeValue / 60) || 0)
      else locationData.timeValue = locationData.timeValue

      response = {
        status: true,
        message: 'Data Added',
        data: locationData
        // data: {
        //   distanceMetric,
        //   distanceValue,
        //   timeMetric,
        //   timeValue,
        //   originLabel: locationData.originLabel,
        //   destinationLabel: locationData.destinationLabel,
        //   timeLabel: locationData.timeLabel
        // }
      }
    } catch (error) {
      response = {
        status: false,
        message: 'Unprocessable',
        data: {}
      }
      console.log('Error updating data', error)
    }
    return response
  }

  // static addLocation = async (origin, destination) => {
  //   let response = {
  //     status: false,
  //     message: 'unprocessable',
  //     data: {}
  //   }
  //   try {
  //     const distanceData = await this.calculateDistanceAndTime(origin, destination)
  //     console.log('distanceData', distanceData)

  //     if (distanceData.error) {
  //       throw new Error(`${distanceData.msg}`)
  //     }

  //     const [startLat, startLng] = origin[0].split(',').map(Number)
  //     const [endLat, endLng] = destination[0].split(',').map(Number)

  //     const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${startLat},${startLng}&destination=${endLat},${endLng}&key=AIzaSyA_klYGitng4x11li2Xk45je9FuGksYNMU`

  //     const response = await axios.get(url)
  //     const steps = response.data.routes[0].legs[0].steps

  //     const coordinates = steps.flatMap((step) => [
  //       [step.start_location.lng, step.start_location.lat],
  //       [step.end_location.lng, step.end_location.lat]
  //     ])

  //     const waypoints = await this.getWaypoints(coordinates)
  //     console.log(waypoints, 'waypoints')
  //     const { distanceValue, distanceLabel, timeValue, timeLabel, from, to } = distanceData
  //     const createLocation = new DistanceLogs({
  //       originLabel: from,
  //       destinationLabel: to,
  //       origin: origin,
  //       destination: destination,
  //       distanceValue: distanceValue,
  //       distanceLabel: distanceLabel,
  //       timeValue: timeValue,
  //       timeLabel: timeLabel,
  //       routePathId: waypoints._id
  //     })

  //     const locationData = await createLocation.save()
  //     response = {
  //       status: true,
  //       message: 'Data Added',
  //       data: locationData
  //     }
  //   } catch (error) {
  //     console.log(error)
  //     response = {
  //       status: false,
  //       message: error.message,
  //       data: {}
  //     }
  //     console.log('Error updating data', error)
  //   }
  //   return response
  // }

  // static addLocation = async (origin, destination) => {
  //   let response = {
  //     status: false,
  //     message: 'unprocessable',
  //     data: {}
  //   }
  //   try {
  //     const distanceData = await this.calculateDistanceAndTime(origin, destination)
  //     console.log('distanceData', distanceData)

  //     if (distanceData.error) {
  //       throw new Error(`${distanceData.msg}`)
  //     }

  //     const [startLat, startLng] = origin[0].split(',').map(Number)
  //     const [endLat, endLng] = destination[0].split(',').map(Number)

  //     console.log(startLat, startLng, 'start')
  //     console.log(endLat, endLng, 'end')

  //     const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${startLat},${startLng}&destination=${endLat},${endLng}&key=${Config.mapConfig.websiteKey}&alternatives=true`

  //     const routePoint = await axios.get(url)
  //     const steps = routePoint.data.routes[0].legs[0].steps

  //     const coordinates = steps.flatMap((step) => [
  //       [step.start_location.lng, step.start_location.lat],
  //       [step.end_location.lng, step.end_location.lat]
  //     ])
  //     console.log(coordinates, 'coordinates')

  //     const waypoints = await this.getWaypoints(coordinates)
  //     console.log(waypoints, 'waypoints111111111')

  //     const { distanceValue, distanceLabel, timeValue, timeLabel, from, to } = distanceData
  //     const createLocation = new DistanceLogs({
  //       originLabel: from,
  //       destinationLabel: to,
  //       origin: origin,
  //       destination: destination,
  //       distanceValue: distanceValue,
  //       distanceLabel: distanceLabel,
  //       timeValue: timeValue,
  //       timeLabel: timeLabel,
  //       routePathId: waypoints.data._id
  //     })

  //     const locationData = await createLocation.save()
  //     console.log(locationData, 'locationData')
  //     response = {
  //       status: true,
  //       message: 'Data Added',
  //       data: locationData
  //     }
  //   } catch (error) {
  //     console.log(error)
  //     response = {
  //       status: false,
  //       message: error.message,
  //       data: {}
  //     }
  //   }
  //   return response
  // }

  static addLocation = async (pickUp, drop) => {
    let response = {
      status: false,
      message: 'unprocessable',
      data: {}
    }
    try {
      const [startLat, startLng] = pickUp[0].split(',').map(Number)
      const [endLat, endLng] = drop[0].split(',').map(Number)
      let optimalRoute = null
      const routePathIdArr = []
      let distanceLogData = {}

      const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${startLat},${startLng}&destination=${endLat},${endLng}&key=${Config.google.mapApiKey}&alternatives=true`

      const routeData = await axios(url)
      const routes = routeData.data.routes

      if (routes.length === 0) throw new Error('NOT_FOUND|ROUTES')

      await Promise.all(
        routes.map(async (route) => {
          console.log('route', route)

          const distance = route.legs[0].distance.value || 0
          const distanceText = route.legs[0].distance.text || 0
          const duration = route.legs[0].duration.value || 0
          const durationText = route.legs[0].duration.text || 0
          const hasTolls =
            route.legs[0].steps.some((step) => step.html_instructions.match(new RegExp('toll road', 'i'))) ||
            false
          const routeCoordinates = route.legs[0].steps.flatMap((step) => [
            [step.start_location.lng, step.start_location.lat],
            [step.end_location.lng, step.end_location.lat]
          ])

          const routePathData = {
            distance,
            distanceText,
            duration,
            durationText,
            hasTolls,
            routeCoordinates,
            overviewPolyline: route.overview_polyline.points
          }
          const waypoints = await this.getWaypoints(routePathData)
          // administrative_area need to done

          if (!optimalRoute || duration < optimalRoute.duration) {
            optimalRoute = routePathData
            delete optimalRoute.routeCoordinates
            optimalRoute.routePathId = waypoints.data._id
            optimalRoute.originLabel = route.legs[0].start_address
            optimalRoute.destinationLabel = route.legs[0].end_address
          }
          routePathIdArr.push(waypoints.data._id)
          distanceLogData = {
            routePathIdArr,
            optimalRoute
          }
        })
      )

      const createLocation = new DistanceLogs({
        origin: pickUp,
        destination: drop,
        originLabel: distanceLogData.optimalRoute.originLabel,
        destinationLabel: distanceLogData.optimalRoute.destinationLabel,
        routePathId: distanceLogData.optimalRoute.routePathId,
        distanceLabel: distanceLogData.optimalRoute.distanceText,
        distanceValue: distanceLogData.optimalRoute.distance,
        timeLabel: distanceLogData.optimalRoute.durationText,
        timeValue: distanceLogData.optimalRoute.duration,
        routePathIds: routePathIdArr
      })

      const locationData = await createLocation.save()

      response = {
        status: true,
        message: 'Data Added',
        data: locationData
      }
    } catch (error) {
      console.log(error)
      response = {
        status: false,
        message: error.message,
        data: {}
      }
    }
    return response
  }

  static calculateDistanceBetweenTwoPoints = async (originCoordinates, destinationCoordinates) => {
    try {
      const [pickupLatLongString] = originCoordinates
      const [destinationLatLongString] = destinationCoordinates

      const [latitude1, longitude1] = pickupLatLongString.split(',')
      const [latttude2, longitude2] = destinationLatLongString.split(',')

      const lat1 = parseFloat(latitude1)
      const lat2 = parseFloat(latttude2)

      const long1 = parseFloat(longitude1)
      const long2 = parseFloat(longitude2)

      const toRad = (value) => (value * Math.PI) / 180
      const earthRadius = 6371

      const dlat = toRad(lat2 - lat1)
      const dlong = toRad(long2 - long1)
      const a =
        Math.sin(dlat / 2) * Math.sin(dlat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dlong / 2) * Math.sin(dlong / 2)
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
      const distance = earthRadius * c
      return distance
    } catch (error) {
      console.log(error)
    }
  }

  static calculateDistanceAndTime = async (origin, destination) => {
    console.log('calculateDistanceAndTime', origin, destination)
    try {
      GoogleDistanceMatrix.key(`${Config.google.mapApiKey}`)
      GoogleDistanceMatrix.units('metric')
      GoogleDistanceMatrix.mode('driving')

      const data = {
        error: false,
        msg: '',
        distanceValue: 0, // Meters
        distanceLable: '',
        timeValue: 0, // Minutes
        timeLable: '',
        from: '',
        to: ''
      }

      return new Promise(function (resolve, reject) {
        GoogleDistanceMatrix.matrix(origin, destination, function (err, distances) {
          console.log('distances', JSON.stringify(distances), 'end')
          try {
            if (err) {
              data['error'] = true
              data['msg'] = err.toString()
              reject(data)
            }
            if (!distances) {
              data['error'] = true
              data['msg'] = 'Error Getting Estimation, Please check your distination Address.'
              reject(data)
            }
            if (
              distances &&
              distances.rows[0].elements[0].status === 'OK' &&
              distances.status !== 'REQUEST_DENIED'
            ) {
              data.from = distances.origin_addresses[0]
              data.to = distances.destination_addresses[0]
              data.distanceLable = distances.rows[0].elements[0].distance.text
              data.distanceValue = distances.rows[0].elements[0].distance.value
              data.timeLable = distances.rows[0].elements[0].duration.text
              data.timeValue = distances.rows[0].elements[0].duration.value
              resolve(data)
            } else {
              // If Api gives error response
              let errMsg = distances.error_message
              if (!errMsg) {
                errMsg = distances.rows[0].elements[0].status
                if (errMsg == 'ZERO_RESULTS')
                  errMsg = 'Error Getting Estimation, Please check your distination Address.'
              }
              data['error'] = true
              data['msg'] = errMsg
              reject(data)
            }
          } catch (error) {
            data['error'] = true
            data['msg'] = error.toString()
            reject(data)
          }
        })
      })
    } catch (error) {
      console.log(error, 'err')
      return error
    }
  }

  static calculateLinestringLength = async (polyLine, metrics = {}) => {
    let distance = 0
    try {
      const { distanceMetric = Config.app.distanceMetric } = metrics
      const lengthValue = await length(
        {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: polyLine
          },
          properties: {}
        },
        { units: 'metres' }
      )
      distance = Math.round(lengthValue)
      if (distanceMetric == Enum.TRIP.DISTANCEMETRIC.MILE) distance = Helpers.roundOff(distance * 0.000621371)
      else if (distanceMetric == Enum.TRIP.DISTANCEMETRIC.KILOMETER)
        distance = Helpers.roundOff(distance * 0.001)
      else distance = distance
    } catch (error) {
      console.log('CALCULATE_LINE_STRING_LENGTH_ERROR', error)
      distance = 0
    }
    return distance
  }

  static routeImage = async (routeData) => {
    let response = {
      status: false,
      message: 'unprocessable',
      data: {}
    }
    try {
      /* Route Data format
        {
          storage : 'loction to store'
          pickupLocation : { lat: 9.9266848, lng: 78.1214533 },
          dropLocation: { lat: 9.9155739, lng: 78.1080646 },
          paths: ['9.9238488,78.1221824', '9.9238488,78.1221824']
        }
      */
      const properties = {
        key: `${Config.mapConfig.serverKey}`,
        scale: 1,
        size: '600x300',
        format: 'png',
        maptype: 'roadmap',
        mapId: `${Config.mapConfig.mapId}`,
        markers: [
          {
            location: routeData.pickupLocation,
            label: 'A',
            color: 'black'
          },
          {
            location: routeData.dropLocation,
            label: 'B',
            color: 'black'
          }
        ]
      }
      if (routeData.paths) {
        properties['paths'] = [
          {
            color: 'black',
            weight: '5',
            points: routeData.paths
          }
        ]
      }
      const mapEndPoint = await StaticMap.staticMapUrl(properties)
      if (routeData.storage) {
        const makePath = routeData.storage
        axios({
          url: mapEndPoint,
          method: 'GET',
          responseType: 'stream'
        })
          .then((getMap) => {
            fs.promises.writeFile(makePath, getMap.data, function (error) {
              if (error) console.error('ROUTE_IMAGE_WRITE_ERROR', error)
              else console.log('ROUTE_IMAGE_PATH', makePath)
            })
          })
          .catch((error) => console.error('ROUTE_IMAGE_STREAM_ERROR', error))
      }
      response = {
        status: true,
        message: 'Data Processed',
        data: {
          mapEndPoint: mapEndPoint
        }
      }
    } catch (error) {
      console.log('ROUTE_IMAGE_ERROR', error)
      response = {
        status: false,
        message: error.message,
        data: {}
      }
    }
    return response
  }

  static getVector = async (startCoords, endCoords) => {
    let response = {
      status: false,
      message: 'UNPROCESSABLE',
      data: {}
    }
    try {
      const vector = {
        x: endCoords[0] - startCoords[0],
        y: endCoords[1] - startCoords[1]
      }

      const magnitude = Math.sqrt(vector.x ** 2 + vector.y ** 2)
      const normalizedVector = {
        x: vector.x / magnitude,
        y: vector.y / magnitude
      }

      response = {
        status: true,
        message: 'VECTOR_GIVEN',
        data: normalizedVector
      }
    } catch (error) {
      response = {
        status: false,
        message: 'UNPROCESSABLE',
        data: {}
      }
    }
    return response
  }

  // static getWaypoints = async (coordinates) => {
  //   let response = {
  //     status: false,
  //     message: 'unprocessable',
  //     data: {}
  //   }
  //   try {
  //     const line = turf.lineString(coordinates)
  //     const distance = turf.length(line, { units: 'kilometers' })
  //     // const dist = distance - 20
  //     const waypoints = []
  //     // const exclusion = 20

  //     for (let i = 0; i <= Math.round(distance); i += 20) {
  //       const waypoint = turf.along(line, i, { units: 'kilometers' })
  //       // const latLng = [waypoint.geometry.coordinates[1], waypoint.geometry.coordinates[0]]
  //       waypoints.push(waypoint.geometry.coordinates)
  //     }
  //     // const newDoc = new RoutePath()
  //     console.log(waypoints, 'waypoints')
  //     waypoints.includes(coordinates[0]) && waypoints.unshift(coordinates[0])
  //     waypoints.includes(coordinates[coordinates.length - 1]) &&
  //       waypoints.push(coordinates[coordinates.length - 1])
  //     const addRoute = await RoutePath.create({
  //       route: {
  //         type: 'LineString',
  //         coordinates: waypoints
  //       }
  //     })
  //     response = {
  //       status: true,
  //       message: 'Path Created',
  //       data: addRoute
  //     }
  //   } catch (error) {
  //     console.log(error, 'error')
  //     response = {
  //       status: false,
  //       message: error.message,
  //       data: {}
  //     }
  //   }
  //   return response
  // }

  static getWaypoints = async (routePathData) => {
    let response = {
      status: false,
      message: 'unprocessable',
      data: {}
    }
    try {
      const {
        distance,
        distanceText,
        duration,
        durationText,
        hasTolls,
        routeCoordinates: coordinates,
        overviewPolyline
      } = routePathData

      const vector = await this.getVector(coordinates[0], coordinates[coordinates.length - 1])
      console.log('vector', vector)

      if (!vector.status) throw new BadRequestError(vector.message)

      if (distance < 20000) {
        const addRoute = await RoutePath.create({
          route: {
            type: 'LineString',
            coordinates
          },
          distance,
          distanceText,
          duration,
          durationText,
          hasTolls,
          overviewPolyline,
          vector: {
            x: vector.data.x,
            y: vector.data.y
          },
          stopPoints: []
        })

        response = {
          status: true,
          message: 'Path Created',
          data: addRoute
        }
        return response
      }

      const line = turf.lineString(coordinates)
      const distanceBetween = turf.length(line, { units: 'kilometers' })
      // const dist = distance - 20
      const waypoints = []
      const cities = []
      const promisesArr = []
      // const exclusion = 20

      for (let i = 0; i <= Math.round(distanceBetween); i += 5) {
        const waypoint = turf.along(line, i, { units: 'kilometers' })
        // const latLng = [waypoint.geometry.coordinates[1], waypoint.geometry.coordinates[0]]
        // add cities alongs the route

        // if (i > 20 && i < distanceBetween - 20) {
        //   const [lng, lat] = waypoint.geometry.coordinates
        //   const coords = `${lat},${lng}`
        //   const geocodeurl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coords}&key=${Config.mapConfig.websiteKey}`
        //   const geoData = await axios(geocodeurl)
        //   const area = geoData.data.results
        //     .flatMap((result) => result.address_components)
        //     .find((city) => city.types.includes('administrative_area_level_3'))

        //   if (area) {
        //     if (!cities.some((place) => place.city === area.long_name)) {
        //       cities.push({ city: area.long_name, coords: [lng, lat] })
        //     }
        //   }
        //   promisesArr.push(geoData)
        // }
        waypoints.push(waypoint.geometry.coordinates)
      }

      // const newDoc = new RoutePath()
      await Promise.all(promisesArr)
      console.log(waypoints, 'waypoints')
      // waypoints.includes(coordinates[0]) && waypoints.unshift(coordinates[0])
      // waypoints.includes(coordinates[coordinates.length - 1]) &&
      //   waypoints.push(coordinates[coordinates.length - 1])
      const addRoute = await RoutePath.create({
        route: {
          type: 'LineString',
          coordinates: waypoints
        },
        distance,
        distanceText,
        duration,
        durationText,
        hasTolls,
        overviewPolyline,
        vector: {
          x: vector.data.x,
          y: vector.data.y
        },
        stopPoints: cities
      })
      response = {
        status: true,
        message: 'Path Created',
        data: addRoute
      }
    } catch (error) {
      console.log(error, 'error')
      response = {
        status: false,
        message: error.message,
        data: {}
      }
    }
    return response
  }
}
export { MapServices }
