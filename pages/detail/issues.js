import withRepoBasic from "../../components/with-repo-basic";
import api from "../../lib/api";
import { Avatar, Button, Select, Spin } from "antd";
import { useState, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import { getlastUpDatedTime } from "../../lib/utils";
import SearchUser from "../../components/SearchUser";

const MDRenderer = dynamic(() => import("../../components/MarkdownRenderer"));

//缓存
const CACHE = {};

function IssueDetail({ issue }) {
    return (
        <div className="root">
            <MDRenderer content={issue.body} />
            <div className="action">
                <Button href={issue.html_url} target="_blank">
                    打开Issue讨论页面
          </Button>
            </div>
            <style jsx>{`
                .root {
                  background: #f1f1f1;
                  padding: 20px;
                }
                .action {
                  text-align: right;
                }
            `}</style>
        </div>
    );
}

function IssueItem({ issue }) {

    const [showDetail, setShowDetail] = useState(false);

    const toogleShowDetail = useCallback(() => {
        //逃避闭包
        setShowDetail(detail => !detail);
    }, []);


    return (
        <div>
            <div className="issue">
                <Button
                    type="primary"
                    size="small"
                    style={{ position: "absolute", right: 10, top: 10 }}
                    onClick={toogleShowDetail}
                >
                    {showDetail ? '影藏' : '查看'}
                </Button>
                <div className="avatar">
                    <Avatar src={issue.user.avatar_url} shape="square" size={50} />
                </div>
                <div className="main-info">
                    <h6>
                        <span>{issue.title}</span>
                        {issue.labels.map(label => (
                            <Label label={label} key={label.id} />
                        ))}
                    </h6>
                    <p className="sub-info">
                        <span>Update at {getlastUpDatedTime(issue.updated_at)}</span>
                    </p>
                </div>
                <style jsx>{`
                .issue {
                    display: flex;
                    position: relative;
                    padding: 10px;
                }
                .issue:hover {
                    background: #fafafa;
                }
                .issue + .issue {
                    border-top: 1px solid #eee;
                }
                .main-info > h6 {
                    max-width: 600px;
                    font-size: 16px;
                    padding-right: 40px;
                }
                .avatar {
                    margin-right: 20px;
                }
                .sub-info {
                    margin-bottom: 0;
                }
                .sub-info > span + span {
                    display: inline-block;
                    margin-right: 20px;
                    font-size: 12px;
                }
            `}</style>
            </div>
            {showDetail ? <IssueDetail issue={issue} /> : null}
        </div>
    )
}

//Label 组件
function Label({ label }) {
    return (
        <>
            <span className="label" style={{ backgroundColor: `#${label.color}` }}>
                {label.name}
            </span>
            <style jsx>{`
          .label {
            display: inline-block;
            line-height: 20px;
            margin-left: 15px;
            padding: 3px 10px;
            border-radius: 3px;
            font-size: 14px;
          }
        `}</style>
        </>
    );
}

function makeQuery(creator, state, labels) {
    let creatorStr = creator ? `creator=${creator}` : "";
    let stateStr = state ? `state=${state}` : "";
    let labelStr = "";
    if (labels && labels.length > 0) {
        labelStr = `labels=${labels.join(",")}`;
    }

    const arr = [];

    if (creatorStr) arr.push(creatorStr);
    if (stateStr) arr.push(stateStr);
    if (labelStr) arr.push(labelStr);

    return `?${arr.join("&")}`;
}

const Option = Select.Option;
const isServer = typeof window === "undefined";

const Issues = ({ initIssues, labels, owner, name }) => {

    useEffect(() => {
        if (!isServer) {
            CACHE[`${owner}/${name}`] = labels;
        }
    }, [owner, name, labels]);

    // console.log(labels)
    const [creator, setCreator] = useState();
    const handleCreatorChange = useCallback(value => {
        setCreator(value);
    }, []);

    const [state, setState] = useState();
    const handleStateChange = useCallback(value => {
        setState(value);
    }, []);

    const [label, setLabel] = useState([]);
    const handleLabelChange = useCallback(value => {
        setLabel(value);
    }, []);

    const [issues, setIssues] = useState(initIssues);
    const [fetching, setFetching] = useState(false);

    const handleSearch = useCallback(() => {
        setFetching(true);
        api
            .request({
                url: `/repos/${owner}/${name}/issues${makeQuery(creator, state, label)}`
            })
            .then(resp => {
                setFetching(false);
                setIssues(resp.data);
            })
            .catch(err => {
                setFetching(false);
                console.error(err);
            });
    }, [owner, name, creator, state, label]);


    return (
        <div className="root">
            <div className="search">
                <SearchUser onChange={handleCreatorChange} value={creator} />
                <Select
                    placeholder="状态"
                    onChange={handleStateChange}
                    value={state}
                    style={{ width: 200, marginLeft: 20 }}
                >
                    <Option value="all">all</Option>
                    <Option value="open">open</Option>
                    <Option value="closed">closed</Option>
                </Select>
                <Select
                    mode="multiple"
                    placeholder="Label"
                    onChange={handleLabelChange}
                    value={label}
                    style={{ flexGrow: 1, marginLeft: 20, marginRight: 20 }}
                >
                    {labels.map(la => (
                        <Option value={la.name} key={la.id}>
                            {la.name}
                        </Option>
                    ))}
                </Select>
                <Button type="primary" onClick={handleSearch} disabled={fetching}>
                    搜索
                </Button>
            </div>
            {fetching ? (
                <div className="loading">
                    <Spin />
                </div>
            ) : (
                    <div className="issues">
                        {issues.map(issue => (
                            <IssueItem issue={issue} key={issue.id} />
                        ))}
                    </div>
                )}
            <style jsx>{`
            .issues {
                border: 1px solid #eee;
                border-radius: 5px;
                margin-bottom: 20px;
                margin-top: 20px;
            }
            .search {
                display: flex;
            }
            .loading {
                height: 400px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            `}</style>
        </div>
    )
}

Issues.getInitialProps = async ({ ctx }) => {

    const { owner, name } = ctx.query;

    const full_name = `${owner}/${name}`;

    /*    const issuesResp = await api.request(
           {
               url: `/repos/${owner}/${name}/issues`
           },
           ctx.req,
           ctx.res
       )
   
       const labelsResp = await api.request(
           {
               url: `/repos/${owner}/${name}/labels`
           },
           ctx.req,
           ctx.res
       ) */

    const fetchs = await Promise.all([
        await api.request(
            {
                url: `/repos/${owner}/${name}/issues`
            },
            ctx.req,
            ctx.res
        ),
        CACHE[full_name] ? Promise.resolve({ data: CACHE[full_name] }) :
            await api.request(
                {
                    url: `/repos/${owner}/${name}/labels`
                },
                ctx.req,
                ctx.res
            )
    ])

    return {
        initIssues: fetchs[0].data,
        labels: fetchs[1].data,
        owner,
        name
    }

}
export default withRepoBasic(Issues, 'issues')