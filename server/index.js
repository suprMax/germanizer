const app = require('express')();
const config = require('uni-config');
const { middleware: gracefulMiddleware, start: gracefulStart } = require('gracefultools');

const setRequestHandlers = () => {
  app.use(require('express-domain-middleware'));
  app.use(gracefulMiddleware());
  app.use(require('middleware-sanitizeurl')({ log: true }));
  app.use(require('morgan')(config.debug ? 'dev' : 'combined'));

  // Static middleware is not needed in production, but still loaded for debug purposes,
  // E.g. running production mode locally
  if (config.sandbox) {
    app.use(require('serve-favicon')(`${__dirname}/../public/favicon.ico`));
    app.use(require('serve-static')(`${__dirname}/../public`, { redirect: false }));
  }

  app.use(require('middleware-trailingslash')());
  app.use(require('./middleware/locals')());
  if (config.debug) app.use(require('connect-livereload')());

  require('./controllers')(app);

  if (config.debug) app.use(require('errorhandler')({ dumpExceptions: true, showStack: true }));
};

const startListening = () => {
  const host = process.env.HOST;
  const port = parseInt(process.env.PORT, 10) || 3000;

  // usually sitting behind nginx
  app.enable('trust proxy');
  app.disable('x-powered-by');

  app.set('port', port);
  app.set('views', `${__dirname}/../templates`);
  app.set('view engine', 'pug');
  if (config.debug) app.set('json spaces', 2);

  setRequestHandlers();

  gracefulStart(app, { host, port });
};

module.exports = startListening;
