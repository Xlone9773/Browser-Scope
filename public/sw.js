self.addEventListener('install', function() {
    self.skipWaiting();
});

self.addEventListener('activate', function(event) {
    event.waitUntil(clients.claim());
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  const actionId = event.action;
  const data = event.notification.data || {};
  
  if (!actionId) {
    // default click
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
        if (windowClients.length > 0) {
            for (let client of windowClients) {
              client.postMessage({ type: 'NOTIFICATION_CLICK', data: data });
              return client.focus();
            }
        } else if (data.url) {
            return clients.openWindow(data.url);
        }
      })
    );
    return;
  }
  
  // Action button clicked
  const actionConfig = data.actions && data.actions[actionId];
  if (actionConfig) {
      if (actionConfig.type === 'url' && actionConfig.payload) {
          event.waitUntil(clients.openWindow(actionConfig.payload));
      } else if (actionConfig.type === 'alert') {
          event.waitUntil(
              clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
                  if (windowClients.length > 0) {
                      for (let client of windowClients) {
                          client.postMessage({ type: 'NOTIFICATION_ACTION', action: actionId, title: actionConfig.title, data: data });
                          return client.focus();
                      }
                  }
              })
          );
      } else if (actionConfig.type === 'close') {
          // just let it close, which happens automatically
      }
  }
});
