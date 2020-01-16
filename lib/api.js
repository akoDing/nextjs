const axios = require("axios");
const github_base_url = "https://api.github.com";

async function requestGithub(method, url, data, headers) {
    return await axios({
        method,
        url: `${github_base_url}${url}`,
        data,
        headers
    });
}

const isServer = typeof window === "undefined";
async function request({ method = "GET", url, data = {}, headers }, req, res) {
    if (!url) {
        throw Error("url must provide");
    }
    console.log('isServer:------------->' + isServer)
    if (isServer) {
        const session = req.session;
        const githubAuth = session.githubAuth || {};
        const headers = {};
        if (githubAuth.access_token) {
            headers[
                "Authorization"
            ] = `${githubAuth.token_type} ${githubAuth.access_token}`;
        }
        return await requestGithub(method, url, data, headers);
    } else {
        console.log('isServer:------------->' + isServer)
        // /search/res to /github/search/res
        return await axios({
            method,
            url: `/github${url}`,
            data
        })
    }
}

module.exports = {
    request,
    requestGithub
}