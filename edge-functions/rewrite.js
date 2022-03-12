/**
 * Introducing CloudFront Functions – Run Your Code at the Edge with Low Latency at Any Scale
 * https://aws.amazon.com/blogs/aws/introducing-cloudfront-functions-run-your-code-at-the-edge-with-low-latency-at-any-scale/
 * 
 * CAUTION:
 * Syntax has to be ECMAScript 5.1 compliant. For example, use 'var' instead of 'const'.
 */

function handler(event) {

  var request = event.request;
  var uri     = request.uri;
  var match1  = '/old_path/';  

  // Use .indexOf() for best performance. https://www.measurethat.net/Benchmarks/Show/4797/1/js-regex-vs-startswith-vs-indexof
  if (uri.indexOf(match1) === 0) {
    // substr() is faster than replace(). https://stackoverflow.com/questions/9586705/performance-about-replace-or-substr-in-javascript
    request.uri = '/new_path/' + uri.substr(match1.length);
  }

  return request;
}

module.exports = handler;
