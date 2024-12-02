import Koa from 'koa';
import Router from '@koa/router';
import { statusGet } from './statusGet';
import { lazyRoute } from './lazyRoute';

const router = new Router();

router.get('/', (ctx) => {
  console.log('eager');
  ctx.body = 'Hello World!';
});

router.get('/status', statusGet);
router.get('/lazy-status', lazyRoute(import('./lazyStatusGet'), 'lazyStatusGet'));


const app = new Koa({
  proxy: true, // we are behind a proxy
});

app.use(router.routes()).use(router.allowedMethods());

export default app;