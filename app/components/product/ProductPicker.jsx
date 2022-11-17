import React from "react";
import { App, CTYPE, U, Utils } from "../../common";
import ProductUtils from "./ProductUtils";
import { Button, Col, Input, Modal, Row, Table, Tag } from "antd";
import SettingUtils from "../common/SettingUtils";

const id_div_product = 'div-dialog-product-picker';
const InputSearch = Input.Search

export default class ProductPicker extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

            items: this.props.items,
            multi: this.props.multi,
            productCategories: [],
            merchant: {},
            list: [],
            pagination: { pageSize: CTYPE.pagination.pageSize, current: 1, total: 0 },
            loading: false
        };
    }

    componentDidMount() {
        this.loadData();
        ProductUtils.loadProductCategories(this);
    }

    loadData = () => {
        let { merchant = {}, pagination = {}, name } = this.state;
        this.setState({ loading: true });
        App.api('adm/product/products', {
            qo: JSON.stringify({
                status: 1,
                name,
                merchantId: merchant.id,
                pageNumber: pagination.current,
                pageSize: pagination.pageSize
            })
        }).then((result) => {
            let { content = [] } = result;
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
        Utils.common.closeModalContainer(id_div_product);
    };

    singleClick = (item) => {
        this.props.syncItems([item]);
        this.close();
    };

    multiClick = (item) => {
        let { items = [] } = this.state;
        items.push(item);
        this.setState({
            items
        });
        this.props.syncItems(items);
    };

    setMerchant = (items) => {
        let { pagination = {}, name } = this.state;
        this.setState({
            name: '',
            merchant: items[0],
            pagination: {
                ...pagination,
                current: 1
            }
        }, () => {
            this.loadData();
        })
    };

    render() {

        let { productCategories = [], multi = false, items = [], list = [], pagination = {}, merchant = {}, loading } = this.state;


        return <Modal
            getContainer={() => Utils.common.createModalContainer(id_div_product)}
            visible={true}
            title={'请选择商品'}
            width='1000px'
            maskClosable={false}
            onCancel={this.close}
            footer={null}>
            <div className='common-list'>
                <Row style={{ padding: '10px 0' }}>
                    <Col span={12}>
                        <Button type='primary' onClick={() => {
                            SettingUtils.merchantPicker([{}], this.setMerchant, false);
                        }}>选择商家</Button>
                        {merchant.id && <span>当前商家：{merchant.name}</span>}
                    </Col>
                    <Col span={12}>
                        <InputSearch
                            onChange={(e) => {
                                this.setState({
                                    name: e.target.value,
                                })
                            }}
                            onSearch={this.loadData}
                            placeholder="输入关键字查询" />
                    </Col>
                </Row>

                <Table
                    columns={[{
                        title: '序号',
                        dataIndex: 'id',
                        className: 'txt-center',
                        width: '60px',
                        render: (col, row, i) => Utils.pager.getRealIndex(pagination, i)
                    }, {
                        title: '类别',
                        dataIndex: 'sequence',
                        className: 'txt-center',
                        width: '300px',
                        render: (sequence, item) => {
                            return <div><Tag>{ProductUtils.getCategoryName(productCategories, sequence, false)}</Tag>
                            </div>
                        }
                    }, {
                        title: '产品名称',
                        dataIndex: 'name',
                        className: 'txt-center',
                        render: (name) => {
                            return <div className='product-title'>{name}</div>
                        }
                    }, {
                        title: '图片',
                        dataIndex: 'imgs',
                        className: 'txt-center',
                        render: (txt, item, index) => {
                            let { specs = [] } = item;
                            let imgs = specs.length > 0 ? specs[0].imgs : [];
                            return <img key={imgs[0]} className='product-img' src={imgs[0]} />
                        }
                    }, {
                        title: '创建时间',
                        dataIndex: 'createdAt',
                        className: 'txt-center',
                        width: '180px',
                        render: (createdAt) => {
                            return U.date.format(new Date(createdAt), 'yyyy-MM-dd HH:mm')
                        }
                    }, {
                        title: '状态',
                        dataIndex: 'status',
                        className: 'txt-center',
                        width: '60px',
                        render: (status) => {
                            return <div className="status">
                                {status === 1 ? <span>上架</span> : <span className="warning">下架</span>}</div>
                        }
                    }, {
                        title: '操作',
                        dataIndex: 'option',
                        className: 'txt-center',
                        width: '90px',
                        render: (obj, product, index) => {
                            let has = items.find(item => item.id === product.id) || [];
                            let choosed = Object.keys(has).length > 0;

                            return <span>
                                {<a style={{ color: choosed ? "#ff0000" : "#1890FF", cursor: choosed ? "auto" : "pointer" }} onClick={() => {
                                    if (multi) {
                                        this.multiClick(product);
                                    } else {
                                        this.singleClick(product);
                                    }
                                }}>{choosed ? "已选择" : "选择"}</a>}
                            </span>
                        }

                    }]}
                    rowKey={(item) => item.id}
                    dataSource={list}
                    pagination={{ ...pagination, ...CTYPE.commonPagination }}
                    loading={loading} onChange={this.handleTableChange} />

            </div>
        </Modal>
    }
}