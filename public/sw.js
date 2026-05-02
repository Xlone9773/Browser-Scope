self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  const action = event.action;
  
  if (action === 'alert') {
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then(windowClients => {
        for (let client of windowClients) {
          client.postMessage({ type: 'NOTIFICATION_ACTION', action: action, data: event.notification.data });
          return client.focus();
        }
      })
    );
  } else if (action === 'url') {
    event.waitUntil(
      clients.openWindow(event.notification.data?.url || '/')
    );
  } else {
    // default click
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then(windowClients => {
        for (let client of windowClients) {
          client.postMessage({ type: 'NOTIFICATION_CLICK', data: event.notification.data });
          return client.focus();
        }
      })
    );
  }
});
