import React, { useEffect } from 'react'
import Router, { withRouter } from 'next/router'
import { Button, Icon, Tabs, Affix } from "antd"
import getConfig from "next/config"
import { connect } from "react-redux"
import LRU from 'lru-cache'

import Repo from "../components/Repo"

const api = require('../lib/api')

import { cacheArray } from '../lib/repo-basic-cache'

const { publicRuntimeConfig } = getConfig()


const cache = new LRU({
    maxAge: 1000 * 10
})


let cacheduserRepos, cacheduserStaredRepos
// 判断是否是服务端渲染
const isServer = typeof window === 'undefined'

const Index = ({ userRepos, userStaredRepos, user, router }) => {
    // console.log(user)
    // console.log(userRepos)
    // console.log(router.query.tabKey)
    const tabKey = router.query.tabKey || '1'

    const handleTabChange = (activeKey) => {
        Router.push(`/?tabKey=${activeKey}`)
    }

    // 页面进入副作用函数，【】不依赖任何参数
    useEffect(() => {
        if (!isServer) {
            if (userRepos) {
                cache.set('userRepos', userRepos)
            }
            if (userStaredRepos) {
                cache.set('userStaredRepos', userStaredRepos)
            }
        }
    }, [userRepos, userStaredRepos])

    useEffect(() => {
        if (!isServer) {
            cacheArray(userRepos)
            cacheArray(userStaredRepos)
        }
    })

    if (!user || !user.id) {
        return (
            <div className="root">
                <p>您还没有登录</p>
                <Button type="primary" href={publicRuntimeConfig.OAUTH_URL}>
                    点击登录
                </Button>
                <style jsx>{`
                .root {
                    height: 400px;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                }
                p {
                    font-size: 22px;
                }
                `}</style>
            </div>
        )
    }

    return (
        <div className="root">
            {/* DOM悬浮固定位置 */}
            <Affix offsetTop={20}>
                <div className="user-info">
                    <img src={user.avatar_url} alt="user avatar" className="avatar" />
                    <span className="login">{user.login}</span>
                    <span className="name">{user.name}</span>
                    <span className="bio">{user.bio}</span>
                    <p className="email">
                        <Icon type="mail" style={{ marginRight: 10 }}></Icon>
                        <a href={`mailto:${user.email}`}>{user.email}</a>
                    </p>
                </div>
            </Affix>
            <div className="user-repos">
                <Tabs defaultActiveKey={tabKey} onChange={handleTabChange} animated={false}>
                    <Tabs.TabPane tab="你的仓库" key="1">
                        {userRepos.map(repo => {
                            return <Repo repo={repo} key={repo.id} />;
                        })}
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="关注的仓库" key="2">
                        {userStaredRepos.map(repo => {
                            return <Repo repo={repo} key={repo.id} />;
                        })}
                    </Tabs.TabPane>
                </Tabs>
            </div>
            <style jsx>{`
            .root {
                display: flex;
                align-items: flex-start;
                padding: 20px 0;
            }
            .user-info {
                width: 200px;
                margin-right: 40px;
                flex-shrink: 0;
                display: flex;
                flex-direction: column;
            }
            .login {
                font-weight: 800;
                font-size: 20px;
                margin-top: 20px;
            }
            .name {
                font-size: 16px;
                color: #777;
            }
            .bio {
                margin-top: 20px;
                color: #333;
            }
            .avatar {
                width: 100%;
                border-radius: 5px;
            }
            .user-repos {
                flex-grow: 1;
            }
          `}</style>
        </div>
    )
}

Index.getInitialProps = async ({ ctx, reduxStore }) => {
    const user = reduxStore.getState().user;
    if (!user || !user.id) {
        return {
            isLogin: false
        };
    }


    if (!isServer) {
        if (cache.get('userRepos') && cache.get('userStaredRepos')) {
            return {
                userRepos: cache.get('userRepos'),
                userStaredRepos: cache.get('userStaredRepos'),
                isLogin: true
            }
        }
    }

    console.log('send axios')
    const userRepos = await api.request(
        {
            url: "/user/repos"
        },
        ctx.req,
        ctx.res
    );
    const userStaredRepos = await api.request(
        {
            url: "/user/starred"
        },
        ctx.req,
        ctx.res
    );

    return {
        userRepos: userRepos.data,
        userStaredRepos: userStaredRepos.data,
        isLogin: true
    }
}

const mapState = state => {
    return {
        user: state.user
    };
};

export default withRouter(connect(mapState)(Index))
