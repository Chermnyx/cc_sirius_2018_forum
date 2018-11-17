const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const cfg = require('./cfg');
const errors = require('./errors');

mongoose.connect(cfg.DB_URL);
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('etag', false);
app.set('lastModified', false);
app.set('x-powered-by', false);

app.use(require('./views'));
app.use('/', express.static(`${__dirname}/../static`));

app.use((err, req, res, next) => {
  if (err && err.isJoi) {
    next(new errors.ValidationError(err));
  } else {
    next(err);
  }
});
app.use((err, req, res, next) => {
  if (err && err instanceof errors.ApiError) {
    res.status(400).json(err);
  } else {
    next(err);
  }
});

// prevent errors leak to client in production mode
if (!cfg.DEBUG) {
  app.use((err, req, res, next) => {
    if (err) {
      console.error(err);

      res.status(500).json({
        error: 'InternalError',
        message: '',
      });
    } else next();
  });
}

if (require.main === module) {
  const server = new (require('http')).Server(app);

  server.listen(
    Number(process.env.SERVER_PORT) || 3000,
    process.env.SERVER_ADDRESS || '0.0.0.0',
    () => {
      const { address, port } = server.address();
      console.info(
        `Listening on ${address}:${port} in ${process.env.NODE_ENV} mode`
      );
    }
  );
}
