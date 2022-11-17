import React from 'react';
import BreadcrumbCustom from "../../common/BreadcrumbCustom";
import {App, CTYPE, U, Utils} from "../../common";
import {Link} from "react-router-dom";
import {Avatar, Button, Card, Dropdown, Icon, Menu, message, Modal, Pagination, Table} from "antd";
import MerchantUtils from "../merchant/MerchantUtils";
import Search from "antd/es/input/Search";

class Articles extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            qo: {},
            pagination: {
                current: 1,
                pageSize: 10,
                total: 0,
            },
            loading: false,
        }


    }

    componentDidMount() {
        this.loadData();
    }

    loadData = () => {
        this.setState({loading: true})
        let {qo, pagination} = this.state;
        qo.pageSize = pagination.pageSize;
        qo.pageNumber = pagination.current;
        App.api(`adm/article/items`, {qo: JSON.stringify(qo)}).then((res) => {
            this.setState({articles: res.content, pagination: Utils.pager.convert2Pagination(res), loading: false})
        })
    }

    edit = (id) => {
        App.go(`/app/article/article-edit/${id}`)
    }

    remove = (id) => {
        Modal.confirm({
            title: '确定要删除吗?',
            onOk() {
                App.api('adm/article/remove', {id: id}).then(() => {
                    message.success('已删除')
                })
            },
            onCancel() {
            },
        })
    }


    status = (article) => {
        Modal.confirm({
            title: article.status === 1 ? '确认下架？' : '确认上架?',
            onOk: () => {
                App.api('adm/article/changeStatus', {id: article.id}).then(() => {
                    message.success(article.status === 1 ? '下架成功' : '上架成功');
                    this.loadData();
                })
            },
            onCancel: () => {
            },
        })

    }


    render() {
        let {articles = [], pagination = {}, qo, loading} = this.state;
        let {current, total} = pagination;
        return <div>
            <BreadcrumbCustom first={<Link to={CTYPE.link.articles.path}>{CTYPE.link.articles.txt}</Link>}/>
            <Card title={<Button type="primary" icon="file-add" onClick={() => {
                this.edit(0)
            }}>添加文章</Button>}
                  extra={<Search placeholder={'输入标题查询'} onChange={(e) => this.setState({
                      qo: {
                          ...qo,
                          title: e.target.value
                      }
                  }, () => this.loadData())}/>}
            >
                <Table
                    columns={[{
                        title: '序号',
                        dataIndex: 'id',
                        className: 'txt-center',
                        render: (col, row, i) => i + 1
                    }, {
                        title: '图片',
                        dataIndex: 'picture',
                        className: 'txt-center',
                        render: (picture => {
                            return <Avatar shape="square" src={picture} size={40} icon="user"/>
                        })
                    }, {
                        title: '标题',
                        dataIndex: 'title',
                        className: 'txt-center',
                    }, {
                        title: '浏览量',
                        dataIndex: 'pageView',
                        className: 'txt-center',

                    }, {
                        title: '点赞量',
                        dataIndex: 'supportNum',
                        className: 'txt-center',

                    }, {
                        title: '收藏量',
                        dataIndex: 'collectNum',
                        className: 'txt-center'
                    }, {
                        title: '发布时间',
                        dataIndex: 'createdAt',
                        className: 'txt-center',
                        render: (createdAt) => {
                            return <span>{U.date.format(new Date(createdAt), 'yyyy-MM-dd HH:mm')}</span>
                        }
                    }, {
                        title: '状态',
                        dataIndex: 'status',
                        className: 'txt-center',
                        render: (status) => {
                            return <span>{Utils.common.byte2status(status)}</span>
                        }
                    }, {
                        title: '操作',
                        dataIndex: 'option',
                        className: 'txt-center',
                        render: (obj, article, index) => {
                            return <Dropdown overlay={<Menu>
                                <Menu.Item key="1">
                                    <a onClick={() => this.edit(article.id)}>编辑</a>
                                </Menu.Item>
                                <Menu.Divider/>
                                <Menu.Item key="2">
                                    <a onClick={() => this.status(article, index)}>{article.status === 1 ? '下架' : '上架'}</a>
                                </Menu.Item>
                                <Menu.Item key="3">
                                    <a onClick={() => this.remove(article.id, index)}>删除</a>
                                </Menu.Item>
                            </Menu>} trigger={['click']}>
                                <a className="ant-dropdown-link">
                                    操作 <Icon type="down"/>
                                </a>
                            </Dropdown>
                        }

                    }]}
                    rowKey={(item) => item.id}
                    dataSource={articles}
                    pagination={false}
                    loading={loading}
                    size={"small"}
                    bordered={false}
                />
                <Pagination style={{float: 'right'}} total={total} showSizeChanger
                            onShowSizeChange={(current, size) => {
                                this.setState({
                                    pagination: {
                                        ...pagination,
                                        current: current,
                                        pageSize: size
                                    }
                                })
                            }} current={current}
                            onChange={(current) => {
                                this.setState({
                                    pagination: {
                                        ...pagination,
                                        current: current
                                    }
                                })
                            }}/>
            </Card>
        </div>

    }
}

export default Articles;