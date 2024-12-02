import { createServer } from 'http';
import app from './app';

const runServer = async () => {
  let requestListener = app.callback();
  const server = createServer(requestListener);

  server.listen(4444, () => {
    console.log(`Server started on port :4444`);
  });

  if (module.hot) {
    module.hot.accept();

    module.hot.accept(['./app'], () => {
      console.log('🔁  HMR Reloading `./app`...');
      // replace request handler of server
      server.removeListener('request', requestListener);
      const newApp = require('./app');

      requestListener = newApp.default.callback();

      server.on('request', requestListener);
    });

    module.hot.dispose(() => {
      console.log('hmr dispose');
      server.close();
    });
  }
}

(async () => {
  await runServer();
})();