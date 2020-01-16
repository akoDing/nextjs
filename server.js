const Koa = require('koa')
const Router = require('koa-router')
const next = require('next')
const session = require('koa-session')
const Redis = require('ioredis')
const koaBody = require('koa-body')

const auth = require('./server/auth')
const api = require('./server/api')
const atob = require('atob')

const RedisSessionStore = require('./server/session-store')

// 是否处于开发状态
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

// 创建redis的链接
const redis = new Redis()

//设置node.js全局增加一个atob方法
global.atob = atob

app.prepare().then(() => {
    const server = new Koa()
    const router = new Router()

    // 用来给cookie加密
    server.keys = ['ding develop Github App']
    server.use(koaBody())

    const SESSION_CONFIG = {
        key: 'jid',
        // store: {}
        // 设置自动清空时间
        // maxAge: 10 * 1000,
        store: new RedisSessionStore(redis)
    }

    server.use(session(SESSION_CONFIG, server))

    server.use(async (ctx, next) => {
        /* console.log(ctx.cookies.get('id'))

        // 获取用户数据
        ctx.session = ctx.session || {}
        ctx.session.user = {
            username: 'akoding'
        } */

        /*   if (!ctx.session.user) {
              ctx.session.user = {
                  name: 'akoding'
              }
          } else { */
        // console.log('session is:', ctx.session)
        // }

        await next()
    })

    // 配置处理github oauth的登录
    auth(server)
    api(server)

    router.get('/a/:id', async (ctx) => {
        const id = ctx.params.id
        await handle(ctx.req, ctx.res, {
            pathname: '/a',
            query: { id }
        })
        // 不再沿用koa的body的返回机制
        ctx.respond = false
    })

    router.get('/api/user/info', async (ctx) => {
        // 中间件路由返回session中的用户信息数据
        const user = ctx.session.userInfo
        if (!user) {
            ctx.status = 401
            ctx.body = 'Need Login'
        } else {
            ctx.body = user
            ctx.set('Content-Type', 'application/json')
        }
    })

    router.get('/set/user', async (ctx) => {
        // ctx.respond = false
        ctx.session.user = {
            name: 'akoding'
        }
        ctx.body = 'set session success'
    })

    router.get('/delete/user', async (ctx) => {
        // ctx.respond = false
        ctx.session = null
        ctx.body = 'delete session success'
    })

    // 使用路由
    server.use(router.routes())
    // 中间件
    server.use(async (ctx, next) => {

        // 设置cookies
        // ctx.cookies.set('id', 'userid:xxx')

        ctx.req.session = ctx.session
        await handle(ctx.req, ctx.res)
        ctx.respond = false
    })

    server.listen(3000, () => {
        console.log('Koa服务启动成功')
    })
})
