var sets = require('../sets');

var root=sets.virtualPath;
exports.authorize = function(req, res, next) {//req.session.user={id:'10000',name:'admin',pass:'admin'};
  if (!req.session||!req.session.user) {
    res.redirect(root+'admin/login');
  } else {
    next();
  }
}