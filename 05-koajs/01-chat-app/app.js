const path = require('path');
const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

let msg = null;
let ps = null;
let promiseResolve = null;
let promiseReject = null;

function hangRequest() {
  ps = new Promise((resolve, reject) => {
    promiseResolve = resolve;
    promiseReject = reject;
  });
}

hangRequest();

router.get('/subscribe', async (ctx, next) => {
  await ps
      .then(
          () => {
            ctx.body = msg;
          },
      )
      .then(() => hangRequest())
      .catch((error) => ctx.body = error.message);
});

router.post('/publish', async (ctx, next) => {
  msg = ctx.request.body.message;
  if (!msg) {
    promiseReject('Empty message not allowed');
    hangRequest();
    ctx.body = {
      error: 'Empty message',
    };
    return;
  }

  promiseResolve(msg);
  ctx.body = {
    message: ctx.request.body.message,
  };
});

app.use(router.routes());

module.exports = app;
