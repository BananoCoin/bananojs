
const sleep = ( millis ) => {
	let start = Date.now() + millis;
	while (start < Date.now());
	return Promise.resolve();
}
const Error = require('./error.js');
exports.sleep = sleep;