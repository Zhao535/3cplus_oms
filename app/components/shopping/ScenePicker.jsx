import React from 'react';
import {App, CTYPE, U, Utils} from "../../common";
import {Avatar, Col, Input, Modal, Row, Table, Tag} from "antd";
import ShoppingUtils from "./ShoppingUtils";

const InputSearch = Input.Search
const id_div_scene = 'div-dialog-scene-picker';

export default class ScenePiker extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            items: this.props.items,
            pagination: {pageSize: CTYPE.pagination.pageSize, current: 1, total: 0},
            list: [],
            qo: {},

        }

    }

    componentDidMount() {
        this.loadData();
    }

    loadData = () => {
        let {qo, pagination} = this.state;
        let {current, pageSize} = pagination;
        qo.pageNumber = current;
        qo.pageSize = pageSize;
        console.log(qo)
        App.api(`adm/sceneShopping/items`, {qo: JSON.stringify(qo)}).then((res) => {
            let pagination = {} = Utils.pager.convert2Pagination(res);
            this.setState({list: res.content, pagination: pagination})
        })

    }

    handleTableChange = (pagination) => {
        this.setState({
            pagination: pagination
        }, () => this.loadData());
    };

    close = () => {
        Utils.common.closeModalContainer(id_div_scene);
    }

    singleClick = (item) => {
        let {items = []} = this.state;
        items.push(item);
        this.setState({
            items
        });
        this.props.syncItems(items);
    };


    render() {
        let {items = [], list = [], pagination, qo} = this.state;
        return <Modal
            getContainer={() => Utils.common.createModalContainer(id_div_scene)}
            visible={true}
            title={'请选择情景'}
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
                                    qo: {
                                        ...qo,
                                        title: e.target.value,
                                    }

                                })
                            }}
                            onSearch={this.loadData}
                            placeholder="输入关键字查询"/>
                    </Col>
                </Row>
                <Table columns={[{
                    title: '序号',
                    dataIndex: 'id',
                    className: 'txt-center',
                    render: (col, row, i) => i + 1
                }, {
                    title: '标题',
                    dataIndex: 'title',
                    className: 'txt-center'
                }, {
                    title: '封面',
                    dataIndex: 'img',
                    className: 'txt-center',
                    render: (img) => {
                        return <Avatar shape="square" src={img} size={40}/>
                    }
                }, {
                    title: '商品',
                    dataIndex: 'product',
                    className: 'txt-center',
                    render: (product, scene, indesx) => {
                        let {products = []} = scene;
                        return <a onClick={() => {
                            ShoppingUtils.sceneDrawer(scene)
                        }}>【{products.length}】</a>
                    }
                }, {
                    title: '分类',
                    dataIndex: 'type',
                    className: 'txt-center',
                    render: (type, scene, indesx) => {
                        return <Tag>{type}</Tag>
                    }
                }, {
                    title: '状态',
                    dataIndex: 'status',
                    className: 'txt-center',
                    render: ((obj, brand, index) => {
                        let {status} = brand;
                        return <div><Tag
                            color={(status === 1) ? "blue" : "red"}> {Utils.common.byte2status(status)}</Tag></div>
                    })
                }, {
                    title: '创建时间',
                    dataIndex: 'createdAt',
                    className: 'txt-center',
                    render: ((obj, scene, index) => {
                        let {createdAt} = scene;
                        return <div>{U.date.format(new Date(createdAt), 'yyyy-MM-dd HH:mm:ss')} </div>
                    })
                }, {
                    title: '操作',
                    dataIndex: 'option',
                    className: 'txt-center',
                    render: (obj, scene, index) => {
                        let has = items.find(item => item.id === scene.id) || {};
                        return <span>
                                    {!has.id && <a onClick={() => {
                                        this.singleClick(scene)
                                    }}>选择</a>}
                            </span>
                    }

                }
                ]} rowKey={(item) => item.id}
                       dataSource={list}
                       pagination={{...pagination, ...CTYPE.commonPagination}}
                       onChange={(pagination) => {
                           this.handleTableChange(pagination)
                       }}
                />

            </div>

        </Modal>


    }
}
