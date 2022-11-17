import React from "react";
import {App, CTYPE, U, Utils} from "../../common";
import {Col, Input, Modal, Row, Table, Tag} from "antd";

const id_div_article = 'div-dialog-article-picker';
const InputSearch = Input.Search
export default class ArticlePicker extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            items: this.props.items,
            list: [],
            pagination: {pageSize: CTYPE.pagination.pageSize, current: 1, total: 0},
            loading: false
        };
    }

    componentDidMount() {
        this.loadData();
    }

    loadData = () => {
        let {pagination = {}, title} = this.state;
        this.setState({loading: true});
        App.api('/adm/article/items', {
            qo: JSON.stringify({
                title,
                pageNumber: pagination.current,
                pageSize: pagination.pageSize
            })
        }).then((result) => {
            let {content = []} = result;
            let pagination = Utils.pager.convert2Pagination(result);
            this.setState({
                list: content, pagination,
                loading: false
            });
        });
    };

    handleTableChange = (pagination) => {
        this.setState({
            pagination: pagination
        }, () => this.loadData());
    };

    close = () => {
        Utils.common.closeModalContainer(id_div_article);
    };

    singleClick = (item) => {
        let { items = [] } = this.state;
        console.log(item);
        items.push(item);
        this.setState({items});
        this.props.syncItems(items);
    };

    render() {

        let {items = [], list = [], pagination, loading} = this.state;
console.log(items);
        return <Modal
            getContainer={() => Utils.common.createModalContainer(id_div_article)}
            visible={true}
            title={'请选择文章'}
            width='1000px'
            maskClosable={false}
            onCancel={this.close}
            footer={null}>
            <div className='common-list'>
                <Row style={{padding: '10px 0'}}>
                    <Col span={12}>
                        <InputSearch
                            onChange={(e) => {
                                this.setState({
                                    title: e.target.value,
                                })
                            }}
                            onSearch={this.loadData}
                            placeholder="输入关键字查询"/>
                    </Col>
                </Row>
                <Table
                    columns={[{
                        title: '序号',
                        dataIndex: 'index',
                        align: 'center',
                        render: (text, item, index) => index + 1
                    }, {
                        title: '图片',
                        dataIndex: 'picture',
                        align: 'center',
                        render: (picture) => {
                            return <img key={picture} className='square-logo' src={picture}/>
                        }
                    }, {
                        title: '标题',
                        dataIndex: 'title',
                        width: 350,
                        render: (title) => {
                            return <div style={{wordWrap: 'break-word', wordBreak: 'break-word'}}>{title}</div>
                        }
                    }, {
                        title: '状态',
                        dataIndex: 'status',
                        className: 'txt-center',
                        render: (status) => {
                            switch (status) {
                                case 1:
                                    return <Tag color="#2db7f5">启用</Tag>;
                                case 2:
                                    return <Tag color="red">停用</Tag>;
                            }
                        }
                    }, {
                        title: '创建时间',
                        dataIndex: 'createdAt',
                        className: 'txt-center',
                        render: (createdAt) => {
                            return U.date.format(new Date(createdAt), 'yyyy-MM-dd HH:mm')
                        }
                    }, {
                        title: '操作',
                        dataIndex: 'option',
                        className: 'txt-center',
                        render: (obj, article, index) => {
                            let has = items.find(item => item.id === article.id) || {};
                            console.log(has);
                            return <span>
                                    {!has.id && <a onClick={() => {
                                        this.singleClick(article)
                                    }}>选择</a>}
                            </span>
                        }

                    }]}
                    rowKey={(item) => item.id}
                    dataSource={list}
                    pagination={{...pagination, ...CTYPE.commonPagination}}
                    loading={loading} onChange={this.handleTableChange}/>
            </div>
        </Modal>
    }
}
