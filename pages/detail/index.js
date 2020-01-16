/* import Repo from '../../components/Repo'
import Link from 'next/link'
import api from '../../lib/api'

function makeQuery(queryObject) {
    const query = Object.entries(queryObject)
        .reduce((result, entry) => {
            result.push(entry.join("="));
            return result;
        }, [])
        .join("&");
    return `?${query}`;
}

const Detail = ({ repoBasic, router }) => {
    console.log(repoBasic)
    const query = makeQuery(router.query)

    return (
        <div className="root">
            <div className="repo-basic">
                <Repo repo={repoBasic} />
                <div className="tabs">
                    <Link href={`/detail${query}`}>
                        <a className="tab index">Readme</a>
                    </Link>
                    <Link href={`/detail/issues${query}`}>
                        <a className="tab issues">Issues</a>
                    </Link>
                </div>
            </div>
            <div>Readme</div>
            <style jsx>{`
               .root {
                   padding-top: 20px;
               }
               .repo-basic {
                    padding: 20px;
                    border: 1px solid #eee;
                    margin-bottom: 20px;
                    border-radius: 5px;
               }
               .tab + .tab {
                    margin-left: 20px;
               }
            `}</style>
        </div>
    )
}

Detail.getInitialProps = async ({ ctx }) => {
    const { owner, name } = ctx.query

    const repoBasic = await api.request({
        url: `/repos/${owner}/${name}`
    }, ctx.req, ctx.res)

    return {
        repoBasic: repoBasic.data,
    }
}

export default Detail */

import withRepoBasic from "../../components/with-repo-basic"
import api from '../../lib/api'

import dynamic from 'next/dynamic'

//异步加载组件，第二个参数配置加载前的显示
const MDRenderer = dynamic(
    () => import('../../components/MarkdownRenderer'),
    {
        loading: () => <p>loading</p>
    }
)


const Detail = ({ readme }) => {
    return (
        <MDRenderer content={readme.content} isBase64={true} />
    )
}

Detail.getInitialProps = async ({ ctx }) => {

    const { owner, name } = ctx.query

    const readmeResp = await api.request({
        url: `/repos/${owner}/${name}/readme`
    }, ctx.req, ctx.res)

    return {
        readme: readmeResp.data
    }

}
export default withRepoBasic(Detail, 'index')