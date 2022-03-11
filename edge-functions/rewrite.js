function handler(event) {
  // Rewrite request URI to serve the same file
  event.request.uri = '/test_site/test.html';
  return event.request;
}
