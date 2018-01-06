const Koa = require('koa');
const parse = require('co-busboy');
const sendToWormhole = require('stream-wormhole');

(async () => {
    new Koa()
        .use(async ctx => {
            if (!ctx.is('multipart/*')) {
                ctx.status = 400;
                return;
            }

            const parts = parse(ctx);
            let part;
            while (part = await parts()) { // await parts() will block after parse the file
                if (part.length) {
                    console.log('key: ' + part[0]);
                    console.log('value: ' + part[1]);
                } else {
                    console.log(part.filename);
                    console.log('send to wormhole');
                    await sendToWormhole(part);
                    console.log('send to wormhole done');
                }
            }
            console.log('done');
            ctx.body = 'done';
        })
        .listen(3000);
})().catch(e => {
    console.error(e.stack);
    process.exit(-1);
});