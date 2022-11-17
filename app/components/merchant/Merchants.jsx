import React from 'react';
import BreadcrumbCustom from "../../common/BreadcrumbCustom";
import {CTYPE, U, Utils} from "../../common";
import {Avatar, Button, Card, Dropdown, Icon, Menu, Table, Modal, Pagination, message,} from "antd";
import AdminUtils from "../admin/AdminUtils";
import App from "../../common/App";
import MerchantUtils from "../../components/merchant/MerchantUtils"

class Merchants extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            list: [],
            pagination: {
                pageSize: 10,
                current: 1,
                total: 0,
            },
            loading: false

        }
    }

    componentDidMount() {
        this.loadData()
    }

    loadData = () => {
        this.setState({loading: true})
        let {pagination = {}} = this.state;
        let {current, pageSize} = pagination;
        App.api(`adm/merchant/items`, {
            qo: JSON.stringify({pageSize: pageSize, PageNumber: current})
        }).then((res) => {
            let pagination = Utils.pager.convert2Pagination(res);
            this.setState(
                {
                    list: res.content,
                    pagination: pagination,
                    loading: false,
                }
            )
        })
    }

    edit = admin => {
        App.go(`/app/merchant/merchant-edit/${admin.id}`)
    };

    changeStatus = (merchant) => {
        let {id, status} = merchant;
        Modal.confirm({
            title: "提示",
            content: (status !== 1 ? "确认上架" : "确认下架"),
            onOk: () => {
                App.api(`adm/merchant/changeStatus`, {id: id}).then(() => {
                    this.loadData()
                    message.success(status !== 1 ? "上架成功" : "下架成功")

                })
            },
            onCancel: () => {

            }


        })

    }


    render() {
        let {list = [], loading, pagination = {}} = this.state;
        let {current, total} = pagination;
        return <div>
            <BreadcrumbCustom first={CTYPE.link.merchant.txt}/>

            <Card title={<Button type="primary" icon="user-add" onClick={() => {
                this.edit({id: 0})
            }}>添加商户</Button>}>
                <Table
                    columns={[
                        ...MerchantUtils.basicColumns,
                        {
                            title: '操作',
                            dataIndex: 'option',
                            className: 'txt-center',
                            render: (obj, merchant, index) => {
                                let {status} = merchant;
                                return <Dropdown overlay={<Menu>
                                    <Menu.Item key="1">
                                        <a onClick={() => this.edit(merchant)}>编辑</a>
                                    </Menu.Item>
                                    <Menu.Item key="2">
                                        <a onClick={() => this.changeStatus(merchant)}>{status === 1 ? '下架' : '上架'}</a>
                                    </Menu.Item>
                                </Menu>} trigger={['click']}>
                                    <a className="ant-dropdown-link">
                                        操作 <Icon type="down"/>
                                    </a>
                                </Dropdown>
                            }

                        }]}
                    rowKey={(item) => item.id}
                    dataSource={list}
                    pagination={false}
                    size={"small"}
                    loading={loading}/>
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

export default Merchants;