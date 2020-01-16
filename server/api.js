const { requestGithub } = require("../lib/api");
const github_base_url = "https://api.github.com";
/* module.exports = server => {
    server.use(async (ctx, next) => {
        const path = ctx.path;
        const method = ctx.method;
        console.log(path)
        if (path.startsWith("/github/")) {
            const session = ctx.session;
            const githubAuth = session || session.githubAuth;
            const headers = {};
            if (githubAuth && githubAuth.access_token) {
                headers[
                    "Authorization"
                ] = `${githubAuth.token_type} ${githubAuth.access_token}`;
            }
            console.log(ctx.url.replace("/github/", "/"))
            const result = await requestGithub(
                method,
                ctx.url.replace("/github/", "/"),
                ctx.request.body || {},
                headers
            );
            ctx.status = result.status
            ctx.body = result.data
        } else {
            await next()
        }
    });
}; */

module.exports = server => {
    server.use(async (ctx, next) => {
        const path = ctx.path;
        const method = ctx.method;
        // console.log('路径' + path)
        if (path.startsWith("/github/")) {
            console.log('路径G---------->' + path)
            console.log('node----------->' + ctx.url)
            const session = ctx.session;
            const githubAuth = session || session.githubAuth;
            // const githubPath = `${github_base_url}${ctx.url.replace('/github/', '/')}`
            console.log('githubPath----------->' + ctx.url.replace("/github/", "/"))
            const token = githubAuth && githubAuth.access_token
            let headers = {}
            if (token) {
                headers['Authorization'] = `${githubAuth.token_type} ${token}`
            }
            const result = await requestGithub(
                method,
                ctx.url.replace("/github/", "/"),
                ctx.request.body || {},
                headers
            );
            ctx.status = result.status
            ctx.body = result.data
        } else {
            await next()
        }
    })
}