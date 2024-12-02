type Handler = (ctx: any, next: any) => Promise<void>;

/**
 * Lazy route routes to consumer fewer cpu and memory

 usage

 mainRoutes.all('/graphql', lazyRoute(import('./mainGraphQL'), 'mainGraphQL'));
 */
export function lazyRoute<T = Handler>(
  moduleImp: Promise<{ default: T } | T>,
  name: string,
  fallback?: T,
): Handler {
  let resolvedHandler: T | undefined;

  // preload handlers in production
  if (process.env.NODE_ENV !== 'development') {
    // Preload the handler eagerly in production
    moduleImp
      .then((module) => {
        // eslint-disable-next-line
        console.log('lazyRoute preload: ', name);
        resolvedHandler = module[name] as T;
      })
      .catch((error) => {
        // eslint-disable-next-line
        console.error(`Failed to preload handler:`, error);
        if (!fallback) {
          throw new Error(`Fallback is required in production for lazyRoute.`);
        }
        resolvedHandler = fallback;
      });
  }

  const lazyHandler = async (ctx, next) => {
    // eslint-disable-next-line
    console.log('lazyRoute handler: ', name, resolvedHandler);
    if (typeof resolvedHandler === 'function') {
      return resolvedHandler(ctx, next);
    }

    console.log('lazyRoute resolvedHandler: ', resolvedHandler, process.env.NODE_ENV, moduleImp);
    if (process.env.NODE_ENV === 'development') {
      try {
        console.log('lazyRoute try: ', moduleImp);
        const module = await moduleImp;
        console.log('lazyRoute module: ', module);

        resolvedHandler = module[name] as T;
      } catch (error) {
        console.log( 'lazyRoute error: ', error);
        if (!fallback) {
          throw error;
        }
        resolvedHandler = fallback;
      }
    } else {
      if (!fallback) {
        throw new Error(`Fallback is required in production for lazyRoute`);
      }
      resolvedHandler = fallback;
    }

    // eslint-disable-next-line
    console.log('lazyRoute resolvedHandler: ', resolvedHandler);
    if (typeof resolvedHandler === 'function') {
      return resolvedHandler(ctx, next);
    } else {
      throw new Error(`Lazy-loaded module at is not a valid Koa handler`);
    }
  };

  Object.defineProperty(lazyHandler, 'name', { value: `lazyRoute<${name}>` });

  return lazyHandler;
}
