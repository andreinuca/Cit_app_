//      Registering Cit_ServiceWorker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/cit_sworker.js')
        .then(reg => console.log('service worker registered'))
        .catch(err => console.log('service worker not registered', err));
}