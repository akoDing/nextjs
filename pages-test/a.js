import React from 'react'

// 组件懒加载
import dynamic from 'next/dynamic'
// 子组件拿到动态路由的参数
import { withRouter } from 'next/router'

import Link from 'next/link'

import styled from 'styled-components'
// import monent from 'moment'

// dynamic 组件懒加载模式
const Comp = dynamic(import('../components/comp'))

const color = 'pink'
const Title = styled.h1`
color: blue;
font-size: 40px;
`
const A = ({ router, name, time, test }) => {
    // console.log(router)
    return (
        <>
            <p>TESThOC: ------->{test}</p>
            <Title>this is title {time}</Title>
            <Comp />
            <Link href="#aaa">
                <a className="link">
                    xxx{router.query.id}{name}
                </a>
            </Link>
            {/* 加上global全局样式 */}
            <style jsx>{`
            a {
                color: blue;
              }
            .link {
                color: ${color};
              }
            `}</style>
        </>
    )
}

// 本页面再次刷新直接返回构建好的HTML，不再重组
A.getInitialProps = async (ctx) => {
    // 单独在组件中引入某些特定的模块
    const moment = await import('moment')

    const promise = new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                name: 'jokcy',
                time: moment.default(Date.now() - 60 * 1000).fromNow()
            })
        }, 1000)
    })

    return await promise

}


export default withRouter(A)