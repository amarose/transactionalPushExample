const installEvent = () => {
    self.addEventListener('install', () => {
      console.log('service worker installed');
    });
  };
  installEvent();
  
  const activateEvent = () => {
    self.addEventListener('activate', () => {
      console.log('service worker activated');
    });
  };
  activateEvent();
  importScripts('https://s-eu-1.pushpushgo.com/651ff5c87582a8ac33d89ec6/worker.js');