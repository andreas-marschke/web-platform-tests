// This is the (shared or dedicated) worker file for the
// worker-controlled-redirect test. It should be served by the corresponding
// .py file instead of being served directly.

function get_resources_path() {
  var url = new URL('.', self.location);
  while (!url.pathname.endsWith('/resources/')) {
    url = new URL('..', url);
  }
  return url;
}

const base_url = get_resources_path();

// This greeting text is meant to be injected by the python script that serves
// this file, to indicate how the script was served (from network or from
// service worker).
let greeting = '%GREETING_TEXT%';
if (!greeting)
  greeting = 'the shared worker script was served from network';

self.onconnect = function(e) {
  var port = e.ports[0];
  port.postMessage(greeting);

  port.addEventListener('message', function(e) {
    var target = new URL('simple.txt', base_url);
    fetch(target).then(r => r.text()).then(result => port.postMessage('fetched: ' + result));
  });

  port.start();
};
