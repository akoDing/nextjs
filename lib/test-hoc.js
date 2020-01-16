export default (Comp) => {
    function TestHocComp({ Component, pageProps, ...rest }) {

        // const name = name + 'Hoc'
        console.log(Component, pageProps)

        if (pageProps) {
            pageProps.test = 'XDD123'
        }


        return <Comp Component={Component} pageProps={pageProps} {...rest} />
    }

    TestHocComp.getInitialProps = Comp.getInitialProps

    return TestHocComp
}