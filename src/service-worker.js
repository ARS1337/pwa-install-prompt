/* eslint-disable no-restricted-globals */

// This service worker can be customized!
// See https://developers.google.com/web/tools/workbox/modules
// for the list of available Workbox modules, or add any other
// code you'd like.
// You can also remove this file if you'd prefer not to use a
// service worker, and the Workbox build step will be skipped.

import { clientsClaim } from "workbox-core";
import { ExpirationPlugin } from "workbox-expiration";
import { precacheAndRoute, createHandlerBoundToURL } from "workbox-precaching";
import { registerRoute, setCatchHandler } from "workbox-routing";
import { StaleWhileRevalidate, CacheFirst } from "workbox-strategies";
import { BroadcastUpdatePlugin } from "workbox-broadcast-update";

clientsClaim();

// Precache all of the assets generated by your build process.
// Their URLs are injected into the manifest variable below.
// This variable must be present somewhere in your service worker file,
// even if you decide not to use precaching. See https://cra.link/PWA
precacheAndRoute(self.__WB_MANIFEST);

// Set up App Shell-style routing, so that all navigation requests
// are fulfilled with your index.html shell. Learn more at
// https://developers.google.com/web/fundamentals/architecture/app-shell
const fileExtensionRegexp = new RegExp("/[^/?]+\\.[^/]+$");
registerRoute(
  // Return false to exempt requests from being fulfilled by index.html.
  ({ request, url }) => {
    // If this isn't a navigation, skip.
    if (request.mode !== "navigate") {
      return false;
    } // If this is a URL that starts with /_, skip.

    if (url.pathname.startsWith("/_")) {
      return false;
    } // If this looks like a URL for a resource, because it contains // a file extension, skip.

    if (url.pathname.match(fileExtensionRegexp)) {
      return false;
    } // Return true to signal that we want to use the handler.

    return true;
  },
  createHandlerBoundToURL(process.env.PUBLIC_URL + "/index.html")
);

// An example runtime caching route for requests that aren't handled by the
// precache, in this case same-origin .png requests like those from in public/
registerRoute(
  // Add in any other file extensions or routing criteria as needed.
  ({ url }) => {
    let isOriginSame = url.origin === self.location.origin;
    let cacheAllImages = ["png", "jpg", "jpeg", "bmp", "gif", "ico", "icon"];
    console.log("url", url);
    let valid = cacheAllImages.map((ext) => {
      if (url.pathname.endsWith(ext)) {
        return true;
      }
    });
    return isOriginSame && valid.includes(true);
  }, // Customize this strategy as needed, e.g., by changing to CacheFirst.
  new StaleWhileRevalidate({
    cacheName: "images",
    plugins: [
      // Ensure that once this runtime cache reaches a maximum size the
      // least-recently used images are removed.
      new ExpirationPlugin({ maxEntries: 50 }),
      new BroadcastUpdatePlugin(),
    ],
  })
);

//custom install flow

var deferredEvent ;

self.addEventListener("beforeinstallprompt", (event) => {
  console.log("beforeinstallprompt event listener");
  event.preventDefault();
  deferredEvent = event;
  console.log("event ",event)
  console.log("deferredEvent ",deferredEvent)
});

function showCustomInstall(){
  deferredEvent.prompt()
}

// This allows the web app to trigger skipWaiting via
// registration.waiting.postMessage({type: 'SKIP_WAITING'})
self.addEventListener("message", async (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
  if (event.data && event.data.type === "SHOW_CUSTOM_INSTALL") {
    showCustomInstall()
  }
});
// Any other custom service worker logic can go here.
self.addEventListener("install", (event) => {
  const files = ["/offline.html"]; // you can add more resources here
  event.waitUntil(
    self.caches.open("offline-fallbacks").then((cache) => cache.addAll(files))
  );
});

// Respond with the fallback if a route throws an error
setCatchHandler(async (options) => {
  const destination = options.request.destination;
  const cache = await self.caches.open("offline-fallbacks");
  if (destination === "document") {
    return (await cache.match("/offline.html")) || Response.error();
  }
  return Response.error();
});

// async function registerPeriodicSync() {
//   await registration.periodicSync.register('get-daily-news', {
//       minInterval: 24 * 60 * 60 * 1000
//   });
// }
self.addEventListener("fetch", (event) => {
  // console.log(`URL requested: ${event.request.url}`);
});



