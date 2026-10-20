'use client';
import useSocketStore from "@/app/hooks/socket";
import queryString from "query-string";
import { API } from "./app/tools/apitools";
import LocationStore from "./app/store/locations";
import ChatData from "./app/store/chat";
import SocketStore from "@/app/hooks/socket";
import dayjs from "dayjs";
import { Result } from "postcss";

export function setCookie(cname?: any, cvalue?: any, exdays?: any, sec?: boolean) {
  if (typeof window !== "undefined") {
    const d = new Date();
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
    let expires = sec ? "; max-age=" + exdays: "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + "; path=/";
  }
}

export function getCookie(cname: any) {
  if (typeof window !== "undefined") {
    let name = cname + "=";
    let ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == " ") {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }
}

export function generateGoogleOAuthUrl() {
  const stringifiedParams = queryString.stringify({
    client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URL,
    scope: "profile email",
    response_type: "code",
    access_type: "offline",
    prompt: "consent",
    state: "googleHost",
  })
  const googleOAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?${stringifiedParams}`;

  return googleOAuthUrl;
}
export const getAccessTokenFromCode = async (authorizationCode: any) => {
  try {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID, // GOOGLE_CLIENTID
        client_secret: process.env.NEXT_PUBLIC_CLIENT_SECRET, // GOOGLE_CLIENTSECRET
        redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URL, // GOOGLE_REDIRECT_URI
        grant_type: 'authorization_code',
        code: authorizationCode,
      } as Record<string, string>)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Failed to get access token:', error);
    return false;
  }
};

export const FormatDate = (dateString: any) => {
  const date = new Date(dateString);

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
};

export const getCurrentLocation = async () => {
  if (!navigator.geolocation) {
    throw new Error("Geolocation is not supported by this browser.");
  }

  const getPosition = () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          resolve({ latitude, longitude });
        },
        (error) => {
          reject(error);
        }
      );
    });
  };

  try {
    const position = await getPosition();
    return position;
  } catch (error) {
    throw error;
  }
};

export function TimeFormat(hour: string, type?: string) {
  const date = new Date(hour);

  const Hourvalue = date.getHours(); 
  const Minvalue = date.getMinutes();

  const Meridiem = (Hourvalue: number) => (Hourvalue < 12 ? 'AM' : 'PM');

  const value = Meridiem(Hourvalue);
  const hours = String(Hourvalue % 12 || 12).padStart(2, '0'); // Convert 0 to 12 for 12-hour clock
  const minutes = String(Minvalue).padStart(2, '0'); // Ensure two-digit minutes

  return type === 'msg'
    ? `${hours}:${minutes} ${value}`
    : `${hours}:${minutes} ${value}`;
}


export const LocationFromApi = (type: any, id: any) => {
  const { country, state, city } = LocationStore()
  if (type === 'country') {
    const countryName: any = Array.isArray(country) && country.find((item: any) => item._id === id)
    return countryName ? countryName?.name : '';
  }
  else if (type === 'state') {
    const stateName: any = Array.isArray(state) && state.find((item: any) => item._id === id)
    return stateName ? stateName?.name : '';
  } else {
    const cityName: any = Array.isArray(city) && city.find((item: any) => item._id === id)
    return cityName ? cityName?.name : '';
  }

}

export const ReceiverLocationFromApi = (type: any, id: any) => {
  const { Reccountry, Recstate, Reccity } = LocationStore()
  if (type === 'country') {
    const countryName: any = Array.isArray(Reccountry) && Reccountry.find((item: any) => item._id === id)
    return countryName ? countryName?.name : '';
  }
  else if (type === 'state') {
    const stateName: any = Array.isArray(Recstate) && Recstate.find((item: any) => item._id === id)
    return stateName ? stateName?.name : '';
  } else {
    const cityName: any = Array.isArray(Reccity) && Reccity.find((item: any) => item._id === id)
    return cityName ? cityName?.name : '';
  }

}


export function MessageCount(id: any) {
  const { Chat } = ChatData.getState()
  const index = Chat.findIndex((item: any) => item._id == id)
  if (index !== -1)
    Chat[index] = {
      ...Chat[index],
      unreadCount: 0
    }
}

export function DeletedMsg(id: any, type?: any, channelid?: any) {
  let { messages }: any = useSocketStore.getState()
  let { Chat }: any = ChatData.getState()
  const value = type === 'channel' ? Chat : messages
  const index = messages.findIndex((item: any) => item.messageInfo?._id == id)
  const indexChat = Chat.findIndex((item: any) => item?._id == id)
  const indexLastmsgChat = Chat.findIndex((item: any) => item?._id == channelid)
  if (type === 'channel') {
    if (indexChat > -1 && indexChat < Chat.length) {
      if (indexChat === 0) {
        const updatedMessages = Chat.shift()
        ChatData.setState({ Chat: updatedMessages })
      } else {
        const updatedMessages = [
          ...Chat.slice(0, indexChat),
          ...Chat.slice(indexChat + 1, Chat.length),
        ]
        ChatData.setState({ Chat: updatedMessages })
      }


    }
  } else {
    if (index > -1 && index < messages.length) {
      const updatedMessages = [
        ...messages.slice(0, index),
        ...messages.slice(index + 1, messages.length),
      ]
      useSocketStore.setState({ messages: updatedMessages })

      const updatedChannelLastmsg = Chat.map((channel: any, i: any) => {
        if (i === indexLastmsgChat) {
          const isLastIndex = index === messages.length - 1;
          const contentSource = isLastIndex
            ? messages[index - 1]?.messageInfo?.content
            : messages[messages.length - 1]?.messageInfo?.content;

          return {
            ...channel,
            messages: [
              {
                ...channel.messages[0],
                message: [
                  {
                    ...channel.messages[0].message[0],
                    content: contentSource,
                  }
                ],
              }
            ],
          };
        }
        return channel;
      });

      ChatData.setState({ Chat: updatedChannelLastmsg });


      ChatData.setState({ Chat: updatedChannelLastmsg });

    }
    if (indexChat > -1 && indexChat < Chat.length) {
      const updatedMessages = [
        ...Chat.slice(0, indexChat),
        ...Chat.slice(indexChat, Chat.length - 1),
      ]
      ChatData.setState({ Chat: updatedMessages })
    }
  }
}
// if (index !== -1) {
//   const updatedMessages = [
//     ...messages.slice(0, index),
//     {
//       ...messages[index],
//       deletedAt: '1'
//     },
//     ...messages.slice(index + 1)
//   ];

//   useSocketStore.setState({ messages: updatedMessages })


//   console.log('finished updateing');
// }

export function OnlineFunction() {
  const { onlineUser }: any = useSocketStore.getState()
  const { onlineId } = ChatData.getState()
  const { setOnlineStatus }: any = SocketStore.getState()
  if (onlineUser && onlineId) {
    const status = Array.isArray(onlineUser) && onlineUser.find((online) => online === onlineId)
    if (status) {
      setOnlineStatus(true)
    } else {
      setOnlineStatus(false)
    }
  }
}
export const convertFileToBase64 = (file: any): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader: any = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      const base64String = reader.result as string;
      resolve(base64String);
    };
    reader.onerror = (error: any) => {
      reject(error);
    };
  });
};

export function urlToObject(url: string) {
  const queryString = url.split('?')[1];
  const urlParams = new URLSearchParams(queryString);
  const paramsObject: any = {};
  urlParams.forEach((value, key) => {
    paramsObject[key] = value;
  });
  return paramsObject;
}

export function metersToKilometers(meters: any) {
  const km = meters / 1000
  return km.toFixed(2);
}

export function openAndroidApp() {
  var now = new Date().getTime();
  var timeout = 2000;
  var isAppInstalled = true;

  // Try to open the app using the custom scheme
  setTimeout(function () {
    if (new Date().getTime() - now < timeout + 100) {
      isAppInstalled = false;  // App is not installed
    }
    if (!isAppInstalled) {
      // Redirect to Play Store if the app is not installed
      window.location.href = "https://play.google.com/";
    }
  }, timeout);

  // Attempt to open the app using the intent URL scheme
  window.location.href = "postier://open/";
}


export const fetchAddress = async (placeId: string) => {

  return new Promise<{ lat: number; lng: number; City: string }>((resolve, reject) => {
    const service = new window.google.maps.places.PlacesService(
      document.createElement("div")
    );

    service.getDetails({ placeId }, (place: any, status) => {

      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
       
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        const City: any = GetAreaName(place?.address_components)
        resolve({ lat, lng, City });
      } else {
        console.error("Place details request failed:", status);
        reject(new Error(`Place details request failed: ${status}`));
      }
    });
  });
};
function GetAreaName(addressComponents: any) {
  const adminAreaLevel3 = addressComponents.find((component: any) =>
    component.types.includes("administrative_area_level_3")
  );

  if (adminAreaLevel3) {
    return adminAreaLevel3.long_name;
  }

  const adminAreaLevel2 = addressComponents.find((component: any) =>
    component.types.includes("administrative_area_level_2")
  );

  if (adminAreaLevel2) {
    return adminAreaLevel2.long_name;
  }

  const adminAreaLevel1 = addressComponents.find((component: any) =>
    component.types.includes("administrative_area_level_1")
  );

  if (adminAreaLevel1) {
    return adminAreaLevel1.long_name;
  }

  const locality = addressComponents.find((component: any) =>
    component.types.includes("locality")
  );

  return locality ? locality.long_name : null;
}

export function hasTollGates(result: google.maps.DirectionsResult): boolean {
  return result.routes.some((route) =>
    route.legs.some((leg) =>
      leg.steps.some((step) => /Toll road/i.test(step.instructions))
    )
  );
}



export const decodePolyline = (polyline: any) => {
  
  if (!polyline || !window.google || !window.google.maps || !window.google.maps.geometry) return [];

  const decodedPath = window.google.maps.geometry.encoding.decodePath(polyline);
  return decodedPath.map((point) => ({
    lat: point.lat(),
    lng: point.lng(),
  }));
};

export function FormatDateTime(dateString: any) {
  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    return { date: null, time: null };
  }

  const formattedDate = `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}/${date.getFullYear()}`;

  // Extract time as hh:mm
  const formattedTime = TimeFormat(dateString);

  return { date: formattedDate, time: formattedTime };
}

export function debounce(func: (...args: any[]) => void, wait: number) {
  let timeout: NodeJS.Timeout;
  return (...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
  };
}


export const GetAddressFromLatLng = async (lat:any, lng:any) => {
  const key: any = process.env.NEXT_PUBLIC_MAP_ID
  const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${key}`);
  
  if (!response.ok) {
    console.error("Failed to fetch address:", response);
    return "";
  }
  const data = await response.json();
  if (data.status === "OK" && data.results.length > 0) {

    return {
      primaryAddress: data?.results[0]?.formatted_address,
      secondaryAddress: data?.results[0]?.formatted_address,
      latLng: data?.results[0]?.place_id,
      place_id:  data?.results[0]?.place_id
    }; 
  } else {
    console.error("No results found");
    return "";
  }
};

export function encodeObjectToBase64(obj:any) {
  const jsonString = JSON.stringify(obj); 
  return btoa(encodeURIComponent(jsonString)); 
}

export function decodeBase64ToObject(base64String:any) {
  const jsonString = decodeURIComponent(atob(base64String)); 
  return JSON.parse(jsonString); 
}

export function encodeBase64(input:any) {
  return btoa(input);
}

export function decodeBase64(encoded:any) {
  return atob(encoded);
}

export const createCustomIcon = (imageUrl:any) => {
  return {
      url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
          <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50">
              <circle cx="25" cy="25" r="24" stroke="blue" strokeWidth="3" fill="url(${imageUrl})" />
          </svg>
      `)}`,
      scaledSize: new window.google.maps.Size(50, 50),
      origin: new window.google.maps.Point(0, 0),
      anchor: new window.google.maps.Point(25, 25),
  };
};


export const generateStrongPassword = (length = 12) => {
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const symbols = "!@#$%^&*()-_=+[]{}|;:'\",.<>?/";

  const allChars = uppercase + lowercase + numbers + symbols;
  let password = "";

  // Ensure at least one of each required character type
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];

  // Fill the remaining length with random characters
  for (let i = 4; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }

  // Shuffle the password to make it unpredictable
  password = password.split("").sort(() => Math.random() - 0.5).join("");

  return password;
};

export const priceFormat = (amount: number, minDig? : number) => {
  const formattedUSD = new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: minDig ? minDig : 0,
    maximumFractionDigits: 2,
  }).format(amount);
  return formattedUSD;
};