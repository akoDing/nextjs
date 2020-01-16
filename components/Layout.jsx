import { useState, useCallback } from 'react'
import Link from "next/link";
import axios from "axios";
import { withRouter } from "next/router";

import { Layout, Icon, Input, Avatar, Tooltip, Dropdown, Menu } from 'antd'
const { Header, Content, Footer } = Layout

import Container from './Container'

import getConfig from 'next/config'
const { publicRuntimeConfig } = getConfig()

import { connect } from 'react-redux'
import { userLogout } from '../store/store';

const githubIconStyle = {
    color: 'white',
    fontSize: 40,
    display: 'block',
    paddingTop: 10,
    marginRight: 20
}
const footerStyle = {
    textAlign: 'center'
}

const Comp = ({ color, children, style }) => <div style={{ color, ...style }}> {children}</div >

const MyLayout = ({ children, user, logout, router }) => {
    const urlQuery = router.query && router.query.query;

    const [search, setSearch] = useState(urlQuery || "")

    const handleSearchChange = useCallback((event) => {
        setSearch(event.target.value)
    }, [setSearch])

    const handleOnSearch = useCallback(() => {
        router.push(`/search?query=${search}`)
    }, [search])

    const handleLogout = useCallback(() => {
        logout()
    }, [logout])

    const handleGotoAuth = useCallback(e => {
        e.preventDefault();
        axios
            .get(`/prepare-auth?url=${router.asPath}`)
            .then(resp => {
                if (resp.status === 200) {
                    location.href = publicRuntimeConfig.OAUTH_URL;
                } else {
                    console.log("prepare auth failed", resp);
                }
            })
            .catch(err => {
                console.log("prepare auth failed", err);
            });
    }, []);

    const userDropdown = (
        <Menu>
            <Menu.Item>
                <a href="javascript:void(0)" onClick={handleLogout}>
                    登 出
                </a>
            </Menu.Item>
        </Menu>
    )

    return (
        <Layout>
            <Header>
                <Container renderer={<div className="header-inner" />}>
                    <div className="header-left">
                        <div className="logo">
                            <Link href="/">
                                <a>
                                    <Icon type="github" style={githubIconStyle}></Icon>
                                </a>
                            </Link>
                        </div>
                        <div>
                            <Input.Search placeholder="搜索仓库" value={search} onChange={handleSearchChange} onSearch={handleOnSearch} />
                        </div>
                    </div>
                    <div className="header-right">
                        <div className="user">
                            {user && user.id ? (
                                <Dropdown overlay={userDropdown}>
                                    <a href="/">
                                        <Avatar size={40} src={user.avatar_url} />
                                    </a>
                                </Dropdown>
                            ) : (
                                    <Tooltip title="点击登录">
                                        <a href={`/prepare-auth?url=${router.asPath}`}/*  onClick={handleGotoAuth} */>
                                            <Avatar size={40} icon="user" />
                                        </a>
                                    </Tooltip>
                                )}
                        </div>
                    </div>
                </Container>
            </Header>
            <Content>
                <Container /* renderer={<Comp color="red" />} */>
                    {children}
                </Container>
            </Content>
            <Footer style={footerStyle}>
                Develop  by DHY@
                <a href="https://music.163.com/#/djradio?id=348455050">music</a>
            </Footer>
            <style jsx>{`
            .header-inner {
                display: flex;
                justify-content: space-between;
            }
            .header-left {
                display: flex;
                justify-content: flex-start;
            }
            `}</style>
            <style jsx global>{`
                #__next {
                    height: 100%;
                }
                .ant-layout {
                    min-height: 100%;
                }
                .ant-layout-header {
                    padding-left: 0;
                    padding-right: 0;
                }
                .ant-layout-content {
                    background: #fff;
                }
            `}</style>
        </Layout>
    )
}

// 从redux中取到状态（connect）
export default connect(
    function mapState(state) {
        return {
            user: state.user
        }
    },
    function mapReducer(dispatch) {
        return {
            logout() {
                dispatch(userLogout());
            }
        }
    }
)(withRouter(MyLayout))