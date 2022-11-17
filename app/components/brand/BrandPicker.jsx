import React from "react";
import {App, CTYPE, U, Utils} from "../../common";
import {Col, Input, Modal, Row, Table, Tag} from "antd";
import BrandUtils from "./BrandUtils";
import ProductUtils from "../product/ProductUtils";

const InputSearch = Input.Search

const id_div_brand = 'div-dialog-brand-picker';

export default class BrandPicker extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            items: this.props.items,
            list: [],
            pagination: {pageSize: CTYPE.pagination.pageSize, current: 1, total: 0},
            loading: false,
            productCategories: [],
        };
    }

    componentDidMount() {
        this.loadData();
        ProductUtils.loadProductCategories(this, true);
    }

    loadData = () => {
        let {pagination = {}, name} = this.state;
        this.setState({loading: true});
        App.api('adm/product/brands', {
            qo: JSON.stringify({
                name,
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
        Utils.common.closeModalContainer(id_div_brand);
    };

    singleClick = (item) => {
        console.log(item);
        let {items = []} = this.state;
        items.push(item);
        this.setState({
            items
        });
        this.props.syncItems(items);
    };

    render() {

        let {items = [], list = [], pagination, loading, productCategories} = this.state;

        return <Modal
            getContainer={() => Utils.common.createModalContainer(id_div_brand)}
            visible={true}
            title={'请选择品牌'}
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
                                    name: e.target.value,
                                })
                            }}
                            onSearch={this.loadData}
                            placeholder="输入关键字查询"/>
                    </Col>
                </Row>
                <Table
                    columns={[
                        ...BrandUtils.basicColumn(productCategories),
                        {
                            title: '操作',
                            dataIndex: 'option',
                            className: 'txt-center',
                            render: (obj, brand, index) => {
                                let has = items.find(item => item.id === brand.id) || {};
                                return <span>
                                    {!has.id && <a onClick={() => {
                                        this.singleClick(brand)
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