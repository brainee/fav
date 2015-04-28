var log4js = require('log4js');

log4js.configure({
  "appenders": [
    {
      type: "console",
	  category: "logC"
    }
	// ,{
		// type: "file",
		// filename: "error.log",
		// category: [ 'logF','console' ]
	// }
    // ,{
      // "type": "smtp",
      // "recipients": "yongzheng@gaotime.com",
      // "sendInterval": 5,
      // "transport": "SMTP",
      // "SMTP": {
        // "host": "smtp.gmail.com",
        // "secureConnection": true,
        // "port": 465,
        // "auth": {
          // "user": "woshishenxiande@gmail",
          // "pass": "jibawohenni"
        // },
        // "debug": true
      // },
      // "category": "logM"
    // }
  ]
  //,replaceConsole: true
});
exports.logC=log4js.getLogger("logC");
exports.logF=log4js.getLogger("logF");
exports.logM=log4js.getLogger("logM");
//console.log('log start:');
this.logC.info("日志模块正常启动！");

