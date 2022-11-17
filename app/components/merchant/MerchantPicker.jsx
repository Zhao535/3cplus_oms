import React from 'react';
import {Avatar, Divider, Dropdown, Icon, Menu, Modal, Table, message, Form, Button, Tag, Row, Col, Input} from 'antd';
import '../../assets/css/common/common-list.less';
import {App, CTYPE, U, Utils} from "../../common";
import {CommonPeriodSelector} from "../common/CommonComponents";
import ProductUtils from "../product/ProductUtils";
import MerchantUtils from "./MerchantUtils";

const FormItem = Form.Item;
const id_div_merchant = 'div-dialog-merchant-picker';
const InputSearch = Input.Search

export default class MerchantPicker extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

            items: this.props.items,
            multi: this.props.multi,

            list: [],

            pagination: {pageSize: CTYPE.pagination.pageSize, current: 1, total: 0},
            loading: false
        };
    }

    componentDidMount() {
        this.loadData();
    }

    loadData = () => {
        let {pagination = {}, name} = this.state;
        this.setState({loading: true});
        App.api('adm/merchant/items', {
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

    singleClick = (item) => {
        this.props.syncItems([item]);
        this.close();
    };

    multiClick = (item) => {
        let {items = []} = this.state;
        items.push(item);
        this.setState({
            items
        });
        this.props.syncItems(items);
    };

    close = () => {
        Utils.common.closeModalContainer(id_div_merchant);
    };

    render() {

        let {items = [], multi = false, list = [], pagination, loading} = this.state;

        return <Modal
            getContainer={() => Utils.common.createModalContainer(id_div_merchant)}
            visible={true}
            title={'请选择商家'}
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
                        ...MerchantUtils.basicColumns,
                        {
                            title: '操作',
                            dataIndex: 'option',
                            className: 'txt-center',
                            render: (obj, merchant, index) => {
                                let has = items.find(item => item.id === merchant.id) || {};
                                merchant.title = merchant.name;
                                return <span>
                                    {!has.id && <a onClick={() => {
                                        if (multi) {
                                            this.multiClick(merchant);
                                        } else {
                                            this.singleClick(merchant);
                                        }
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
