'use strict';

var fs = require('fs'),
    path = require('path'),
    http = require('http');

var app = require('connect')();
var swaggerTools = require('swagger-tools');
var jsyaml = require('js-yaml');

// Load some small snippets for easy use
require('./snippets');

// swaggerRouter configuration
var options = {
  swaggerUi: path.join(__dirname, '/swagger.json'),
  controllers: path.join(__dirname, './controllers'),
  useStubs: process.env.NODE_ENV === 'development' // Conditionally turn on stubs (mock mode)
};

// The Swagger document (require it, build it programmatically, fetch it from a URL, ...)
var spec = fs.readFileSync(path.join(__dirname,'api/swagger.yaml'), 'utf8');
var swaggerDoc = jsyaml.safeLoad(spec);

// Initialize the Swagger middleware
swaggerTools.initializeMiddleware(swaggerDoc, function (middleware) {

  // Interpret Swagger resources and attach metadata to request - must be first in swagger-tools middleware chain
  app.use(middleware.swaggerMetadata());

  // Validate Swagger requests
  app.use(middleware.swaggerValidator());

  // Route validated requests to appropriate controller
  app.use(middleware.swaggerRouter(options));

  // Serve the Swagger documents and Swagger UI
  app.use(middleware.swaggerUi());

  createStatic({ dir: 'web/css' }, function (err, middleware) {
    if (err) throw err;
    app.use('/css', middleware);
    createStatic({ dir: 'web/js' }, function (err, middleware) {
      if (err) throw err;
      app.use('/js', middleware);
      createStatic({ dir: 'web/fonts' }, function (err, middleware) {
        if (err) throw err;
        app.use('/fonts', middleware);

        // Get Port for production
        var port = process.env.PORT || 8080;
        // Start the server
        http.createServer(app).listen(port, function () {
          console.log('Your server is listening on port %d (http://localhost:%d)', port, port);
          console.log('Swagger-ui is available on http://localhost:%d/docs', port);
        });
      });
    });
  });
});
