import React from 'react'
import { useEffect } from 'react'
import axios from 'axios'

import Head from 'next/head'
import Link from 'next/link'
import Router from 'next/router'
import Nav from '../components/nav'
import { Button } from 'antd'

import { connect } from 'react-redux'
import store from '../store/store'
import { add } from '../store/store'

import getConfig from 'next/config'

const { publicRuntimeConfig } = getConfig()

const Index = ({ counter, username, rename, add }) => {

  // 所有的路由钩子名称，写在了一个数组中
  const events = [
    'routeChangeStart',
    'routeChangeComplete',
    'routeChnageError',
    'beforeHistoryChange',
    'hashChangeStart',
    'hashChangeComplete'
  ]

  // 通过一个高阶函数在钩子触发后执行自定义的逻辑，这里直接输出了钩子名称和钩子函数的参数
  function makeEvent(type) {
    return (...args) => {
      console.log(type, ...args)
    }
  }

  //通过forEach遍历 绑定钩子事件
  events.forEach(event => {
    Router.events.on(event, makeEvent(event))
  })

  function goToTestA() {
    /* 动态路由传参 */
    /* 第二个参数路由映射，重命名 */
    Router.push({
      pathname: '/a',
      query: {
        id: 2
      }
    }, '/a/2')

  }

  useEffect(() => {
    axios.get('/api/user/info').then(res => console.log(res))
  }, [])

  // 页面每次进入直接响应
  useEffect(() => {
    console.log('come into indexPage')
  }, [])

  return (
    <>
      {/* link模式跳转 */}
      {/* as路由映射，重命名 */}
      {/* <Link href="/a?id=1" as="/a/1"><Button>click</Button></Link> */}
      {/*  Router模式跳转 */}
      {/* <Button onClick={goToTestA}>clickRouter</Button> */}
      <span>Index</span>
      <br />
      <span>Store Counter: {counter}</span>
      <br />
      <span>Store Username: {username}</span>
      <br />
      <input value={username} onChange={(e) => rename(e.target.value)} />
      <br />
      <br />
      <Button onClick={() => add(counter)}>do add</Button>
      <a href={publicRuntimeConfig.OAUTH_URL}>去登录</a>
    </>
  )

}

Index.getInitialProps = async ({ reduxStore }) => {
  reduxStore.dispatch(add(3))
  return {}
}

// 从redux中取到状态（connect）
export default connect(
  function mapStateToProps(state) {
    return {
      counter: state.count.count,
      username: state.user.username
    }
  },
  function mapDispatchToProps(dispatch) {
    return {
      add: (num) => dispatch({ type: 'ADD', num }),
      rename: (name) => dispatch({ type: 'UPDATE_USERNAME', name }),
    }
  }
)(Index)
