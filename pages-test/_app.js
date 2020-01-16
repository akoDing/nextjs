import App, { Container } from 'next/app'
import 'antd/dist/antd.css'
import { Button } from 'antd'
// 引入react-redux的链接构建
import { Provider } from 'react-redux'
// import store from '../store/store'

import testHoc from '../lib/test-hoc'
import withRedux from '../lib/with-redux'

import MyContext from '../lib/my-context'

import Layout from '../components/Layout'

class MyApp extends App {

    state = {
        context: 'value'
    }

    static async getInitialProps(ctx) {
        const { Component } = ctx
        let pageProps = {}
        if (Component.getInitialProps) {
            pageProps = await Component.getInitialProps(ctx)
        }
        return { pageProps }
    }

    render() {
        const { Component, pageProps, reduxStore } = this.props

        // console.log(Component)
        return (
            <Provider store={reduxStore}>
                {/*   <Container>  */}
                <Layout>
                    <MyContext.Provider value={this.state.context}>
                        <Component {...pageProps} />
                        {/* <br />
                    <Button onClick={() => { this.setState({ context: `${this.state.context}11111` }) }}>update context</Button> */}
                    </MyContext.Provider>
                </Layout>
                {/*       </Container>  */}
            </Provider>
        )
    }
}


export default withRedux(MyApp)