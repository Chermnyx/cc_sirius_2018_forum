const DEBUG = process.env.NODE_ENV === 'development';
const STATIC_PATH = process.env.DOCKER ? '/static' : '/var/tmp/';
const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
const BIG_IMAGE_SIZE = 2048;
const SMALL_IMAGE_SIZE = 512;
const SMALL_JPEG_Q = 51;
const DB_URL = process.env.DOCKER
  ? 'mongodb://db:27017/cyber2ch'
  : 'mongodb://localhost:27017/cyber2ch';

const MAX_POST_SIZE = 1024;
const MAX_TITLE_LENGTH = 32;

const multer = require('multer');
const upload = multer({
  dest: STATIC_PATH + '/uploads',
  limits: { fileSize: MAX_UPLOAD_BYTES },
});

const objectIdRegex = /^[a-f\d]{24}$/i;

const PICS_ROUTE = '/pic';

module.exports = {
  DEBUG,
  STATIC_PATH,
  MAX_UPLOAD_BYTES,
  BIG_IMAGE_SIZE,
  SMALL_IMAGE_SIZE,
  SMALL_JPEG_Q,
  PICS_ROUTE,
  DB_URL,
  MAX_POST_SIZE,
  MAX_TITLE_LENGTH,
  upload,
  objectIdRegex,
};
