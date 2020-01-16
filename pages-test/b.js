import React, { useState, useReducer, useEffect, useLayoutEffect, useContext, useRef, memo, useCallback } from 'react'
/* useLayoutEffect 在组件更新渲染到dom之前的操作，一般不用 */

/* 出现闭包的问题的话可以暂时用useRef去保存state的状态去解决 */
/* 很关键 要点 */

import { Button } from 'antd'

import MyContext from '../lib/my-context'

function countReducer(state, action) {
    switch (action.type) {
        case 'add':
            return state + 1
        case 'minus':
            return state - 1
        default:
            return 0;
    }
}


function MyCount({ test }) {
    // const [count, setCount] = useState(0)

    const [count, dispatchCount] = useReducer(countReducer, 0)

    const context = useContext(MyContext)

    const contextRef = useRef()

    useEffect(() => {
        console.log(contextRef)
        const interval = setInterval(() => {
            // setCount(c => c + 1)
            // dispatchCount({ type: 'minus' })
        }, 1000)
        return () => clearInterval(interval)
    }, [count])

    function add() {
        setCount(count + 1)
    }

    const recover = () => dispatchCount({ type: '' })

    const readd = () => dispatchCount({ type: 'add' })

    /* const add = () => setCount(count + 1) */

    return (
        <>
            <p>{test}</p>
            <span className="span-margin"></span>
            <p ref={contextRef}>{context}</p>
            <Memo />
            <Button onClick={readd}>Count加一</Button>
            <Button onClick={recover}>Count初始化</Button>
            <span>B{count}</span>
            <style jsx>{`
            .span-margin {
                display: block;
                margin-top: 10px;
            }
            `}</style>
        </>
    )
}

// 优化Hooks,利用memo把子组件方法给包裹起来
// 实现整体组件渲染不会影响到子组件内的方法调用响应
const Memo = memo(
    function Memo() {
        console.log('Memo is run')
        return (
            <p>this is Memo</p>
        )
    }
)

// 本页面再次刷新直接返回构建好的HTML，不再重组
MyCount.getInitialProps = async (ctx) => {

    return {}

}

export default MyCount