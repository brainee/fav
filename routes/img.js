/*
 * admin router.
 */
var sets = require('../sets');

exports.index= function(req, res, next) {
	res.redirect(sets.virtualPath+'api/getIcons');
};


