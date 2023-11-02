// import 'regenerator-runtime';
// import CacheHelper from './utils/cache-helper';

// // Daftar asset yang akan di-caching
// const assetsToCache = [
//   './',
//   './icons/icon-72x72.png',
//   './icons/icon-96x96.png',
//   './icons/icon-128x128.png',
//   './icons/icon-144x144.png',
//   './icons/icon-152x152.png',
//   './icons/icon-192x192.png',
//   './icons/icon-384x384.png',
//   './icons/icon-512x512.png',
//   './index.html',
//   './favicon.png',
//   './app.bundle.js',
//   './app.webmanifest',
//   './sw.bundle.js',
// ];

// self.addEventListener('install', (event) => {
//   console.log('Installing Service Worker ...');

//   // TODO: Caching App Shell Resource
//   event.waitUntil(CacheHelper.cachingAppShell([...assetsToCache]));
// });

// self.addEventListener('activate', (event) => {
//   console.log('Activating Service Worker ...');

//   // TODO: Delete old caches
//   event.waitUntil(CacheHelper.deleteOldCache());
// });

// self.addEventListener('fetch', (event) => {
//   console.log(event.request);

//   // TODO: Add/get fetch request to/from caches
//   event.respondWith(CacheHelper.revalidateCache(event.request));
// });

import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute, Route } from 'workbox-routing';
import { StaleWhileRevalidate } from 'workbox-strategies';

// Do precaching
precacheAndRoute(self.__WB_MANIFEST);

const themoviedbApi = new Route(
  ({ url }) => url.href.startsWith('https://api.themoviedb.org/3/'),
  new StaleWhileRevalidate({
    cacheName: 'themoviedb-api',
  }),
);

const themoviedbImageApi = new Route(
  ({ url }) => url.href.startsWith('https://image.tmdb.org/t/p/w500/'),
  new StaleWhileRevalidate({
    cacheName: 'themoviedb-image-api',
  }),
);

registerRoute(themoviedbApi);
registerRoute(themoviedbImageApi);

self.addEventListener('install', () => {
  console.log('Service Worker: Installed');
  self.skipWaiting();
});

self.addEventListener('push', (event) => {
  console.log('Service Worker: Pushed');

  const dataJson = event.data.json();
  const notification = {
    title: dataJson.title,
    options: {
      body: dataJson.options.body,
      icon: dataJson.options.icon,
      image: dataJson.options.image,
    },
  };

  event.waitUntil(self.registration.showNotification(notification.title, notification.options));
});

self.addEventListener('notificationclick', (event) => {
  const clickedNotification = event.notification;
  clickedNotification.close();
  const chainPromise = async () => {
    console.log('Notification has been clicked');
    await self.clients.openWindow('https://www.dicoding.com/');
  };
  event.waitUntil(chainPromise());
});
