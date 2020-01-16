import { useEffect, memo, isValidElement } from "react"
import { withRouter } from "next/router"
import Link from 'next/link'
import { Row, Col, List, Pagination } from 'antd'
import Repo from '../components/Repo'
const api = require('../lib/api')

import { cacheArray } from '../lib/repo-basic-cache'


const LANGUAGES = ['JavaScript', 'HTML', 'CSS', 'TypeScript', 'Java', 'Rust']
const SORT_TYPES = [
    {
        name: 'Best match'
    },
    {
        name: 'Most stars',
        value: 'stars',
        order: 'desc'
    },
    {
        name: 'Fewest stars',
        value: 'stars',
        order: 'asc'
    },
    {
        name: 'Most forks',
        value: 'forks',
        order: 'desc'
    },
    {
        name: 'Fewest forks',
        value: 'forks',
        order: 'asc'
    }
]
const selectedItemStyle = {
    borderLeft: `2px solid #e36209`,
    fontWight: 100
};
const per_page = 20
const isServer = typeof window === 'undefined'

function noop(page) {
    console.log(page);
}

/* const doSearch = (config) => {
    Router.push({
        pathname: '/search',
        query: config
    })
} */

// memo当传入的props不变的时候，组件不会重新渲染的
const FilterLink = memo(({ name, query, lang, sort, order, page }) => {
    let queryString = `?query=${query}`;
    if (lang) queryString += `&lang=${lang}`;
    if (sort) queryString += `&sort=${sort}&order=${order || "desc"}`;
    if (page) queryString += `&page=${page}`;

    queryString += `&per_page=${per_page}`
    return (<Link href={`/search${queryString}`}>
        {isValidElement(name) ? name : <a>{name}</a>}
    </Link>)
});

const Search = ({ router, repos }) => {
    // console.log(repos)
    // const { lang, sort, order, page, query } = router.query
    const { ...querys } = router.query;
    const { lang, sort, order, page } = router.query;

    useEffect(() => {
        if (!isServer) { cacheArray(repos.items) }
    })

    // console.log(query)
    /* const handleLanguageChange = (language) => {
        Router.push({
            pathname: '/search',
            query: {
                query,
                lang: language,
                sort,
                order
            }
        })
    } */

    /*     const handleSortChange = (sort) => {
            Router.push({
                pathname: '/search',
                query: {
                    query,
                    lang,
                    sort: sort.value,
                    order: sort.order
                }
            })
        } */

    return (
        <div className='root'>
            <Row gutter={20}>
                <Col span={6}>
                    <List
                        bordered
                        header={<span className='list-header'>语言</span>}
                        style={{ marginBottom: 20 }}
                        dataSource={LANGUAGES}
                        renderItem={item => {
                            const selected = lang === item;
                            return (
                                <List.Item style={selected ? selectedItemStyle : null}>
                                    {
                                        selected ?
                                            <span>{item}</span> :
                                            <FilterLink {...querys} lang={item} name={item} />
                                    }
                                </List.Item>
                            )
                        }
                        }
                    />
                    <List
                        bordered
                        header={<span className='list-header'>排序</span>}
                        dataSource={SORT_TYPES}
                        renderItem={item => {
                            let selected = false;
                            if (item.name === "Best Match" && !sort) {
                                selected = true;
                            } else if (item.value === sort && item.order === order) {
                                selected = true;
                            }
                            return (
                                <List.Item style={selected ? selectedItemStyle : null}>
                                    {
                                        selected ?
                                            <span>{item.name}</span> :
                                            <FilterLink
                                                {...querys}
                                                sort={item.value}
                                                order={item.order}
                                                name={item.name}
                                            />
                                    }
                                </List.Item>
                            )
                        }
                        }
                    />
                </Col>
                <Col span={18}>
                    <h3 className="repo-title">{repos.total_count}个仓库</h3>
                    {
                        repos.items.map(repo => <Repo repo={repo} key={repo.id} />)
                    }
                    <div className="pagination">
                        <Pagination
                            pageSize={per_page}
                            current={Number(page) || 1}
                            //github api 限制1000正常
                            total={1000}
                            // 必须要有onChange方法
                            onChange={noop}
                            itemRender={(page, type, ol) => {
                                const p =
                                    type === 'page' ? page : type === 'prev' ? page - 1 : page + 1
                                const name = type === 'page' ? page : ol
                                return <FilterLink {...querys} page={p} name={name} />
                            }}
                        />
                    </div>
                </Col>
            </Row>
            <style jsx>{`
            .root {
              padding: 20px 0;
            }
            .list-header {
              font-weight: 800;
              font-size: 16px;
            }
            .repos-title {
              border-bottom: 1px solid #eee;
              font-size: 24px;
              line-height: 50px;
            }
            .pagination {
              padding: 20px;
              text-align: center;
            }
            `}</style>
        </div>
    )
}

Search.getInitialProps = async ({ ctx }) => {

    const { query, sort, lang, order, page } = ctx.query

    if (!query) {
        return {
            repos: {
                total_count: 0
            }
        }
    }

    let queryString = `?q=${query}`
    if (lang) queryString += `+language:${lang}`
    if (sort) queryString += `&sort=${sort}&order=${order || 'desc'}`
    if (page) queryString += `&page=${page}`

    queryString += `&per_page=${per_page}`
    const result = await api.request(
        {
            url: `/search/repositories${queryString}`
        },
        ctx.req,
        ctx.res
    )

    return {
        repos: result.data
    }

}

export default withRouter(Search)