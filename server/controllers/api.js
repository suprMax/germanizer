const debug = require('debug')('germanizer:controllers:api');
const BaseController = require('express-base-class');

const { random } = require('../modules/utils');
const { isValidType } = require('../modules/validations');
const { parseType } = require('../modules/parsers');
const { formatError } = require('../modules/error');
const dictionary = require('../../dictionary');

const handleError = (res, text) => {
  debug(text);
  res.status(400).send({ error: text });
};

class ApiController extends BaseController {
  checkQuery({ query }, res, next) {
    const { type } = query;
    if (!isValidType(type)) return handleError(res, '`type` query parameter invalid or missing');
    next();
  }

  respond({ query }, res) {
    const result = parseType(query.type).map((type) => ({ type, data: random(dictionary[type]) }));
    res.send({ result });
  }

  catchAll(req, res) {
    res.status(404).send(formatError('Page doesn\'t exist'));
  }

  attachRoutes() {
    const { checkQuery, respond, catchAll } = this;
    this.get('/api/dictionary', checkQuery, respond);
    this.get('/api/*', catchAll);
  }
}

module.exports = new ApiController();
