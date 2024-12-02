export const lazyStatusGet = async (ctx) => {
  ctx.status = 200;
  ctx.body = 'working';
};