const express = require('express');
const bodyParser = require('body-parser');

const cfg = require('./cfg');
const errors = require('./errors');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(require('./views'));
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
