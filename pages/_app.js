import App from 'next/app'
import 'antd/dist/antd.css'
// 引入react-redux的链接构建
import { Provider } from 'react-redux'

import Router from "next/router";
import Link from "next/link";

import withRedux from '../lib/with-redux'

import Layout from '../components/Layout'
import PageLoading from "../components/PageLoading";

import axios from 'axios'

class MyApp extends App {

    state = {
        context: "value",
        loading: false
    };
    startLoading = () => {
        this.setState({
            loading: true
        });
    };
    stopLoading = () => {
        this.setState({
            loading: false
        });
    };

    componentDidMount() {
        Router.events.on("routeChangeStart", this.startLoading);
        Router.events.on("routeChangeComplete", this.stopLoading);
        Router.events.on("routeChangeError", this.stopLoading);
        /* axios
            .get("/github/search/repositories?q=react")
            .then(resp => console.log(resp)); */
    }
    componentWillUnmount() {
        Router.events.off("routeChangeStart", this.startLoading);
        Router.events.off("routeChangeComplete", this.stopLoading);
        Router.events.off("routeChangeError", this.stopLoading);
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

        return (
            <Provider store={reduxStore}>
                {this.state.loading ? <PageLoading /> : null}
                <Layout>
                    {/*  <Link href="/"><a>Index</a></Link>
                    <Link href="/detail"><a>Detail</a></Link> */}
                    <Component {...pageProps} />
                </Layout>
            </Provider>
        )

    }
}


export default withRedux(MyApp)