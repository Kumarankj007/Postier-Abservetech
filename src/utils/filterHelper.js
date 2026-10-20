// change object to query string
export const updateQuery = (queryValues) => {
  const query_params = new URLSearchParams(queryValues);
  let url_string = query_params.toString();
  if (url_string) {
    url_string = "?" + url_string;
    window.history.replaceState({ path: url_string }, "", url_string);
  } else {
    window.history.replaceState(null, "", window.location.pathname);
  }
};
export const isValidInteger = (value) => {
  const parsed = parseInt(value, 10);
  return !isNaN(parsed) && parsed.toString() === value.toString();
};
export const isValidBoolean = (str) => {
  if (typeof str == "boolean") {
    return true;
  }
  return str === "true" || str === "false" || str === "0" || str === "1";
};

export const normalizeFilter = (schema, values) => {
  const obj = {};
  for (const key in schema) {
    if (schema.hasOwnProperty(key)) {
      const type = schema[key]?.type;
      if (type === "string" && typeof values[key] === "string") {
        if (values[key]) {
          // not empty
          obj[key] = values[key].replace(/\s+/g, " ").trim();
        }
      } else if (type === "number" && isValidInteger(values[key])) {
        obj[key] = values[key];
      } else if (type === "option") {
        if (
          values[key]?.value !== "" &&
          typeof values[key]?.value !== "undefined"
        ) {
          obj[key] = values[key]?.value;
        } else if (values[key] && values[key]?.value !== "") {
          obj[key] = values[key];
        }
      } else if (type === "multi_option" && values[key]) {
        if (Array.isArray(values[key])) {
          if (values[key].length > 0) {
            obj[key] = values[key].map((item) => item.value).join(",");
          }
        } else if (values[key]) {
          obj[key] = values[key];
        }
      } else if (type === "boolean" && isValidBoolean(values[key])) {
        obj[key] = values[key];
      }
    }
  }
  // update url query
  const queryValue = {};
  for (const key in obj) {
    if (schema[key]) {
      const item = schema[key];
      if (item.ignoreQuery) {
        continue;
      }
      if (obj[key] === item.default) {
        continue;
      }
      queryValue[key] = obj[key];
    }
  }
  updateQuery(queryValue);
  const query_params = new URLSearchParams(obj);
  return query_params.toString();
};

export const filterToState = (schema) => {
  const state = {};
  const params = new URLSearchParams(window.location.search);
  const query = Object.fromEntries(params.entries());

  for (let val in schema) {
    state[val] = query[val] || schema[val]?.default;
  }
  return state;
};

export const getFilterSchema = (options = {}) => {
  const isRatingPath = window.location.pathname === "/webadmin/rating";
  // debugger
  const schema = {
    page: {
      type: "number",
      default: 1,
    },
    limit: {
      type: "number",
      default: 10,
    },
    search: {
      type: "string",
      default: "",
    },

    ...(isRatingPath && {
      modelType: {
        type: "string",
        default: "Post",
      },
    }),
    ...options,
  };
  return {
    schema,
    state: filterToState(schema),
  };
};
