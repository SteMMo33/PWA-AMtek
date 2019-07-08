/*
 * @license
 * Your First PWA Codelab (https://g.co/codelabs/pwa)
 * Copyright 2019 Google Inc. All rights reserved.
 */
'use strict';

const CACHE_NAME = 'static-cache-v1';
const DATA_CACHE_NAME = 'data-cache-v1';
const FILES_TO_CACHE = [
  // Se non abbiamo cache .. '/offline.html'
  '/',
  '/index.html',
  '/scripts/app.js',
  '/scripts/install.js',
  '/scripts/luxon-1.11.4.js',
  '/scripts/materialize.min.js',
  '/styles/inline.css',
  '/styles/materialize.min.css',
  '/images/add.svg',
  '/images/install.svg',
];

const thisApp = {
  ws : {}  // Websocket
}


// - Install
self.addEventListener('install', (evt) => {
  console.log('[ServiceWorker] Install');

  // Precache static resources here.
  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[ServiceWorker] Pre-caching offline page');
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});



// - Activate
self.addEventListener('activate', (evt) => {
  console.log('[ServiceWorker] Activate');

  //evt.waitUntil(
    /* tolgo per il momento la cache
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    }) */
  //)

  console.log("Pre socket ..")
    thisApp.ws = new WebSocket('ws://192.168.5.50:7681');
    // Connection opened
    thisApp.ws.addEventListener('open', function (event) {
      console.log("ws opened")
      thisApp.ws.send('Hello Server!');
      thisApp.ws.send("{ \"cmd\": \"product\"");
      self.postMessage({opcode:"wsopen"})
    })
    // Listen for messages
    thisApp.ws.addEventListener('message', function (event) {
      console.log('Message from server ', event.data);
    })
    thisApp.ws.addEventListener('close', function (event) {
      console.log("ws closed");
    }) 
  console.log("Post socket ..")

  self.clients.claim();
});


// - Fetch
self.addEventListener('fetch', (evt) => {
  console.log('[ServiceWorker] Fetch ', evt.request.url);
  console.log(evt);

  // CODELAB: Add fetch event handler here.
  /* Original code
  if (evt.request.mode !== 'navigate') {
    // Not a page navigation, bail.
    return;
  }
  evt.respondWith(
      fetch(evt.request)
          .catch(() => {
            return caches.open(CACHE_NAME)
                .then((cache) => {
                  return cache.match('offline.html');
                });
          })
  ); */
  
  //SM Nuova gestione con il recupero dei dati in cache
  /* if (evt.request.url.includes('openweathermap')) 
  {
    console.log('[Service Worker] Fetch (data)', evt.request.url);
    evt.respondWith(
        caches.open(DATA_CACHE_NAME).then((cache) => {
          return fetch(evt.request)
              .then((response) => {
                // If the response was good, clone it and store it in the cache.
                if (response.status === 200) {
                  cache.put(evt.request.url, response.clone());
                }
                return response;
              }).catch((err) => {
                // Network request failed, try to get it from the cache.
                return cache.match(evt.request);
              });
        }));
    return;
  } */
  //evt.respondWith(
    /*
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(evt.request)
            .then((response) => {
              console.log("caches open match")
              return response || fetch(evt.request);
            });
      }) */


      // Test con JSON
    //  "{ \"name\":\"Prod name\", \"desc\":\"Description text\", \"price\":12.50 }"
  //);

  var resource = '"{ \"name\":\"Prod name\", \"desc\":\"Description text\", \"price\":12.50 }"';
  return new Response( resource,  { headers: { 'Content-Type': 'text/json' }} )
});


// - Message
self.addEventListener('message', function(event) {
  var promise = self.clients.matchAll()
  .then(function(clientList) {
    var senderID = event.source.id;
    clientList.forEach(function(client) {
      if (client.id === senderID) {
        return;
      }
      client.postMessage({
        client: senderID,
        message: event.data
      });
    });
  });
  if (event.waitUntil) {
    event.waitUntil(promise);
  }
})