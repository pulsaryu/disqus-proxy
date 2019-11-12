const Koa = require('koa');
const rq = require('request-promise-native');
const router = require('koa-router')();
const bodyParser = require('koa-bodyparser');
const log4js = require('log4js');
const cors = require('kcors');
const config = require('./config');

const app = new Koa();

if (config.api_key === '' || config.api_secret === '') {
  console.log(`Error occured in config: API Key not set`);
  return;
}


if (config.log === 'file') {
  log4js.configure({
    appenders: {
      'disqus-proxy': {
        type: 'file',
        filename: 'disqusProxy.log'
      }
    },
    categories: {
      default: {
        appenders: ['disqus-proxy'],
        level: 'info'
      }
    },
  });
}

const logger = log4js.getLogger('disqus-proxy');
app.use(bodyParser());
app.use(cors());

const req = {};

router.get('/api/getThreads', async (ctx) => {
  logger.info('Get Thread');
  let result;

  try {
    const url = ['https://disqus.com/api/3.0/threads/list.json?',
      'api_secret=',
      config.api_secret,
      '&forum=',
      config.username,
      '&thread:ident=',
      (config.testPage !== '' ? config.testPage : encodeURIComponent(ctx.request.query.identifier)),
    ].join('');

    logger.info(url);

    result = await rq(Object.assign(req, {
      method: 'GET',
      url,
      json: true,
    }));
  } catch (e) {
    ctx.body = e.error;
    logger.error(`Error when get thread:${JSON.stringify(e.error)}`);
    return;
  }
  logger.info(`Get thread successfully with response code: ${result.code}`);
  ctx.body = result;
});

router.get('/api/listPosts', async (ctx) => {
  logger.info('Get Posts');
  let result;
  try {
    const url = ['https://disqus.com/api/3.0/forums/listPosts.json?',
      'api_key=', config.api_key,
      (ctx.request.query.include === undefined) ? '' : ctx.request.query.include.split(',').map((e) => `@include=${e}`).join(''),
      '&forum=', config.username,
      '&limit=12'
    ].join('');

    logger.info(url);

    result = await rq(Object.assign(req, {
      method: 'GET',
      url,
      json: true,
    }));
  } catch (e) {
    ctx.body = e.error;
    logger.error(`Error when get comment:${JSON.stringify(e.error)}`);
    return;
  }
  logger.info(`Get comments successfully with response code: ${result.code}`);
  ctx.body = result;
});

router.get('/api/getComments', async (ctx) => {
  logger.info(`Get Comments with identifier: ${ctx.request.query.identifier}`);
  let result;

  try {
    const url = ['https://disqus.com/api/3.0/threads/listPosts.json?',
      'api_secret=',
      config.api_secret, '&forum=', config.username,
      '&limit=100',
      '&thread:ident=',
      (config.testPage !== '' ? config.testPage : encodeURIComponent(ctx.request.query.identifier)),
    ].join('');

    logger.info(url);

    result = await rq(Object.assign(req, {
      method: 'GET',
      url,
      json: true,
    }));
  } catch (e) {
    ctx.body = e.error;
    logger.error(`Error when get comment:${JSON.stringify(e.error)}`);
    return;
  }
  logger.info(`Get comments successfully with response code: ${result.code}`);
  ctx.body = result;
});

router.post('/api/createComment', async (ctx) => {
  logger.info('Create Comment');
  let result;
  try {
    logger.info(JSON.stringify(ctx.request.body));

    result = await rq(Object.assign(req, {
      url: 'https://disqus.com/api/3.0/posts/create.json',
      method: 'POST',
      form: Object.assign(ctx.request.body, {
        api_key: 'E8Uh5l5fHZ6gD8U3KycjAIAk46f68Zw7C6eW8WSjZvCLXebZ7p0r1yrYDrLilk2F',
      }),
      json: true,
    }));
  } catch (e) {
    logger.error(`Error when create comment:${JSON.stringify(e.error)}`);
    ctx.body = e.error;
    return;
  }
  ctx.body = result;
  logger.info(`Create comment successfully with response code: ${result.code}`);
});


router.post('/api/spamComments', async (ctx) => {
  logger.info('Spam Comment');
  let result;
  try {
    logger.info(JSON.stringify(ctx.request.body));

    result = await rq(Object.assign(req, {
      url: 'https://disqus.com/api/3.0/posts/spam.json',
      method: 'POST',
      form: Object.assign(ctx.request.body, {
        api_key: 'E8Uh5l5fHZ6gD8U3KycjAIAk46f68Zw7C6eW8WSjZvCLXebZ7p0r1yrYDrLilk2F',
      }),
      json: true,
    }));
  } catch (e) {
    logger.error(`Error when spam comment:${JSON.stringify(e.error)}`);
    ctx.body = e.error;
    return;
  }
  ctx.body = result;
  logger.info(`Create comment successfully with response code: ${result.code}`);
});


// TODO: Approve
// TODO: Spam
// TODO: Remove
// TODO: Vote
// TODO: Restore

app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(config.port);

console.log(`Disqus proxy server start at port: ${config.port}`);

if (config.log === 'file') {
  console.log('See disqus-proxy.log in current directory.');
  logger.info(`Server start at port: ${config.port}`);
}
