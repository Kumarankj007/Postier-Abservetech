// importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
// importScripts(
//     "https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js"
// );
// const firebaseConfig = {
//   apiKey: process.env.NEXT_PUBLIC_FB_APIKEY,
//   authDomain: process.env.NEXT_PUBLIC_FB_AUTH_DOMAIN,
//   projectId: process.env.NEXT_PUBLIC_FB_PROJECT_ID,
//   storageBucket: process.env.NEXT_PUBLIC_FB_STORAGE_BUCKETID,
//   messagingSenderId: process.env.NEXT_PUBLIC_FB_MESSAGING_SENDERID,
//   appId: process.env.NEXT_PUBLIC_FB_APPID,
//   measurementId: process.env.NEXT_PUBLIC_FB_MESSUREMENT_ID,
// }
// firebase.initializeApp(firebaseConfig);
// const messaging = firebase.messaging();
// messaging.onBackgroundMessage((payload) => {
//     // console.log(
//     //     "[firebase-messaging-sw.js] Received background message ",
//     //     payload
//     // );
//     const notificationTitle = payload.notification.title;
//     const notificationOptions = {
//         body: payload.notification.body,
//         icon: payload.notification.image
//     };
//     self.registration.showNotification(notificationTitle, notificationOptions);
// });