import createStore from '../store/store'
import { Component } from 'react'
const isServer = typeof window === 'undefined'
const __NEXT_REDUX_STORE__ = '__NEXT_REDUX_STORE__'

const getOrcreateStore = (initialState) => {
    if (isServer) {
        return createStore(initialState)
    }

    if (!window[__NEXT_REDUX_STORE__]) {
        window[__NEXT_REDUX_STORE__] = createStore(initialState)
    }
    return window[__NEXT_REDUX_STORE__]
}

export default (Comp) => {
    class WithReduxApp extends Component {
        constructor(props) {
            super(props)
            // console.log(props)
            this.reduxStore = getOrcreateStore(props.initialReduxState)
        }
        render() {
            const { Component, pageProps, ...rest } = this.props
            if (pageProps) {
                pageProps.test = 'XDD123'
            }
            return <Comp Component={Component} pageProps={pageProps} reduxStore={this.reduxStore} {...rest} />
        }
    }
    /*  function WithRedux({ Component, pageProps, ...rest }) {
 
         // const name = name + 'Hoc'
         console.log(Component, pageProps)
 
         if (pageProps) {
             pageProps.test = 'XDD123'
         }
 
 
         return <Comp Component={Component} pageProps={pageProps} {...rest} />
     } */

    WithReduxApp.getInitialProps = async (ctx) => {
        let reduxStore
        if (isServer) {
            // console.log(ctx)
            const { req } = ctx.ctx
            const session = req.session
            if (session && session.userInfo) {
                reduxStore = getOrcreateStore({
                    user: session.userInfo
                })
            } else {
                reduxStore = getOrcreateStore();
            }
        } else {
            reduxStore = getOrcreateStore();
        }



        // const reduxStore = getOrcreateStore()

        ctx.reduxStore = reduxStore

        let appProps = {}
        if (typeof Comp.getInitialProps === 'function') {
            appProps = await Comp.getInitialProps(ctx)
        }

        return {
            ...appProps,
            initialReduxState: reduxStore.getState(),
        }

    }

    return WithReduxApp
}