/* ************************
 * Copyright 2023
 * ABSERVETECH
 ************************ */
class QueryBuilder {
  static getSearchable(model, queryData) {
    return new Promise((resolve, reject) => {
      try {
        const queryObject = {}
        let searchAble = {}
        model.schema.eachPath((pathname, schematype) => {
          if (
            (schematype.options?.options?.isSearch ||
              (Array.isArray(schematype.options.type) &&
                schematype.options.type[0].options &&
                schematype.options.type[0].options.isSearch)) &&
            queryData[pathname] &&
            schematype.instance !== 'Date'
          ) {
            const addSearchAble = {}
            addSearchAble[pathname] = schematype.instance

            if (addSearchAble[pathname] === 'String') {
              queryObject[pathname] = { $regex: queryData[pathname], $options: 'i' }
            } else if (addSearchAble[pathname] === 'Number') {
              queryObject[pathname] = parseInt(queryData[pathname])
            } else if (addSearchAble[pathname] === 'ObjectId') {
              queryObject[pathname] = new mongoose.Types.ObjectId(queryData[pathname])
            } else if (addSearchAble[pathname] === 'Array') {
              const arrayIds = queryData[pathname].split(',')
              queryObject[pathname] = { $all: arrayIds }
            } else if (addSearchAble[pathname] === 'Boolean') {
              queryObject[pathname] = queryData[pathname]
            }
            searchAble = { ...searchAble, ...addSearchAble }
          } else if (schematype.instance == 'Date' && queryData[pathname]) {
            const setDate = new Date(queryData[pathname]) || null
            if (setDate) {
              const addSearchAble = {}
              addSearchAble[pathname] = schematype.instance
              searchAble = { ...searchAble, ...addSearchAble }
              queryObject[pathname] = {
                $gte: new Date(setDate.setHours(0, 0, 0, 0)), // Start of day
                $lt: new Date(setDate.setHours(23, 59, 59, 999)) // End of day
              }
            }
          } /* else if (pathname == 'createdAt' && queryData[pathname]) {
            const setDate = new Date(queryData[pathname]) || null
            if (setDate) {
              const addSearchAble = {}
              addSearchAble[pathname] = schematype.instance
              searchAble = { ...searchAble, ...addSearchAble }
              queryObject[pathname] = {
                $gte: new Date(setDate.setHours(0, 0, 0, 0)), // Start of day
                $lt: new Date(setDate.setHours(23, 59, 59, 999)) // End of day
              }
            }
          } else if (pathname == 'updatedAt' && queryData[pathname]) {
            const setDate = new Date(queryData[pathname]) || null
            if (setDate) {
              const addSearchAble = {}
              addSearchAble[pathname] = schematype.instance
              searchAble = { ...searchAble, ...addSearchAble }
              queryObject[pathname] = {
                $gte: new Date(setDate.setHours(0, 0, 0, 0)), // Start of day
                $lt: new Date(setDate.setHours(23, 59, 59, 999)) // End of day
              }
            }
          } else if (pathname == 'scheduleOn' && queryData[pathname]) {
            const setDate = new Date(queryData[pathname]) || null
            if (setDate) {
              const addSearchAble = {}
              addSearchAble[pathname] = schematype.instance
              searchAble = { ...searchAble, ...addSearchAble }
              queryObject[pathname] = {
                $gte: new Date(setDate.setHours(0, 0, 0, 0)), // Start of day
                $lt: new Date(setDate.setHours(23, 59, 59, 999)) // End of day
              }
            }
          }*/
        })
        return resolve({ queryObject, searchAble })
      } catch (error) {
        reject(error)
      }
    })
  }
}
export { QueryBuilder }
