var path = require('path');

var bunyan = require('bunyan');
var manta = require('manta');
var restify = require('restify');

var log, server, client;
var base = process.argv[2];

log = new bunyan({ 'name': 'skitch-proxy' });
server = restify.createServer();
server.use(restify.acceptParser(server.acceptable));
server.on('after', restify.auditLogger({ log: log }));
server.put('/:file', function (req, res, next) {
	var name = req.params['file'];
	var upstream = path.join(base, name);
	if (!name) {
		next(new restify.BadRequestError('no name'));
		return;
	}

	log.info('uploading to %s', upstream);
	client.put(upstream, req, {}, function (err) {
		log.info('upstream put result');

		if (err) {
			next(err);
			return;
		}

		res.send(204);
		next();
	});
});
server.listen(9050, function() {
	log.info('listening at %s', server.url);
});

client = manta.createBinClient({
    'log': log,
});
process.removeAllListeners('uncaughtException');
