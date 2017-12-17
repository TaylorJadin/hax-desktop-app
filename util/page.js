const path = require('path');
const _ = require('underscore');
const fs = require('fs');

module.exports = {

  getPage(page) {
    page = _.isString() ? page : 'index.html';
    _path = path.join(process.cwd(), 'content', page);
    if (!fs.existsSync(_path)) return false;
    let file = fs.readFileSync(_path, 'utf8');
    return file;
  },

  savePage(page, content) {
    page = _.isString() ? page : 'index.html';
    _path = path.join(process.cwd(), 'content', page);
    if (!fs.existsSync(_path)) return false;
    try {
      fs.writeFileSync(_path, content, 'utf8');
      return true;
    } catch (error) {
      return false;
    }
  }

}