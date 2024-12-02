export const statusGet = async (ctx) => {
  ctx.status = 200;
  ctx.body = 'working';
};