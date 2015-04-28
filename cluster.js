var cluster = require('cluster');
var os = require('os');
var settings = require('./settings');

// 获取CPU 的数量
var numCPUs = os.cpus().length;
var workers = {};console.log('thread +'+1);
if (cluster.isMaster) {
	// 主进程分支
	cluster.on('death', function (worker) {
	// 当一个工作进程结束时，重启工作进程
	delete workers[worker.pid];
	worker = cluster.fork();
	workers[worker.pid] = worker;
	});console.log(worker)
	// 初始开启与CPU 数量相同的工作进程
	for (var i = 0; i < numCPUs; i++) {
	var worker = cluster.fork();
	workers[worker.pid] = worker;
	}
} else {
	// 工作进程分支，启动服务器
	var app = require('./app');
	app.listen(settings.webport);
}
// 当主进程被终止时，关闭所有工作进程
process.on('SIGTERM', function () {
for (var pid in workers) {
process.kill(pid);
}
process.exit(0);
});