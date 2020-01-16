const GITHUB_OAUTH_URL = 'https://github.com/login/oauth/authorize'
const SCOPE = 'user'
const CLIENT_ID = 'cae761634b0127740703'

module.exports = {
    github: {
        client_id: CLIENT_ID,
        client_secret: '9d5081188e6de991f5147c39ef78fb29640056fa',
        request_token_url: 'https://github.com/login/oauth/access_token',
    },
    GITHUB_OAUTH_URL,
    OAUTH_URL: `${GITHUB_OAUTH_URL}?client_id=${CLIENT_ID}&scope=${SCOPE}`
}
// 授权登录地址
// https://github.com/login/oauth/authorize?client_id=cae761634b0127740703
// 拿到权限的code
// code：4ea4d80c9ca99594f97b
// 拿到access_token  https://github.com/login/oauth/access_token
// access_token=6d4ffe04329a5e9e5b9bace797b839bc914fa09d&scope=repo%2Cuser&token_type=bearer
// 取到uesr数据
// https://api.github.com/user
// Authorization token