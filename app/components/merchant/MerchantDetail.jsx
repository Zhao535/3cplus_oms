import React from 'react';
import { Divider, Dropdown, Form, Icon, Menu, message, Modal, Table, Tag } from 'antd';
import '../../assets/css/common/common-list.less';
import '../../assets/css/merchant/merchant-detail.less'
import { App, U, Utils } from "../../common";
import MerchantUtils from "./MerchantUtils";
import ProductUtils from "../product/ProductUtils";

const id_div = 'div-dialog-merchant-detail';
const FormItem = Form.Item;
const MenuItem = Menu.Item;

export default class MerchantDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            validThru: new Date().getTime(),
            merchantId: this.props.merchantId,
            merchant: {},
            admins: [],
            categories: [],
            productCategorySequences: [],
            location: {},
            duration: '',
        };
    }

    componentDidMount() {
        this.reloadData()
    }

    reloadData = () => {
        this.loadData();
        ProductUtils.loadProductCategories(this);
    }

    updateStatus = (id, status) => {
        let opt = status === 1 ? '封禁商户' : '解封商户';
        let _status = status === 1 ? 2 : 1;
        Modal.confirm({
            title: `确认${opt}操作?`,
            onOk: () => {
                App.api('/adm/merchant/changeStatus', { id }).then(() => {
                    let { merchant } = this.state;
                    merchant.status = _status;
                    this.setState({ merchant });
                    message.success(`${opt}成功`);
                });
            },
            onCancel() {
            }
        });
        this.loadData();
    };

    updateMerchantAdminStatus = (id, status) => {
        let opt = status === 1 ? '禁用管理员' : '启用管理员';
        let _status = status === 1 ? 2 : 1;
        Modal.confirm({
            title: `确认${opt}操作?`,
            onOk: () => {
                App.api('/adm/merchantAdmin/changeStatus', { id }).then(() => {
                    message.success(`${opt}成功`);
                    this.loadData();
                });
            },
            onCancel() {
            }
        });
        this.loadData();
    };


    close = () => {
        Utils.common.closeModalContainer(id_div);
    };

    loadData = () => {
        let { merchantId } = this.state;
        App.api('/adm/merchant/item', { id: merchantId }).then(result => {
            this.setState({
                merchant: result,
            });
        });
    };


    render() {
        let { categories = [], merchant = {}, productCategories = [], } = this.state;
        let { id, logo, name, status, expiredAt, location = {}, merchantAdmin = [], sequences = [] } = merchant;

        let { detail, poiaddress, poiname } = location;
        let now = new Date().getTime();
        let restDay = (expiredAt - now) / 86400000;

        return <Modal title={'商户详情'}
            getContainer={() => Utils.common.createModalContainer(id_div)}
            visible={true}
            width={'800px'}
            footer={null}
            onCancel={this.close}
        >
            <div className='merchant-detail'>
                <img src={logo} />

                <div className='merchant-detail-right'>
                    <li><span>商户ID</span><p>{id}</p></li>
                    <li><span>商户名称</span><p>{name}</p></li>
                    {status !== 3 ?
                        <li><span>商户状态</span>{status === 1 ? <p>正常</p> : <p style={{ color: 'red' }}>封禁</p>}
                            <a onClick={() => this.updateStatus(id, status)}>{status === 1 ? "封禁商户" : "解封商户"}</a></li> :
                        <li><span>商户状态</span><p style={{ color: 'red' }}>欠费</p></li>}

                    <li><span>到期时间</span><p>{U.date.format(new Date(expiredAt), 'yyyy/MM/dd HH:mm')}</p><p
                        className='res'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;剩余{parseInt(restDay)}天</p>
                        <a onClick={() => {
                            MerchantUtils.merchantRenew(id, this.reloadData);
                        }}>续期</a></li>
                    <li><span>地址</span><p>{poiaddress + "  " + poiname + "  " + detail}</p></li>
                </div>
            </div>
            <Divider>账户详情</Divider>
            <div className='account'>
                <li><span>￥5</span><p>今日收入</p></li>
                <li><span>￥20</span><p>本月收入</p></li>
                <li><span>￥13</span><p>总收入</p></li>
                <li><span>￥14</span><p>账户余额</p></li>
            </div>
            <Divider>经营范围</Divider>
            <div className='productCategorySequences'>
                {sequences.map((sequence, index) => {
                    return <Tag key={index} >{ProductUtils.getCategoryName(productCategories, sequence, false)}</Tag>
                })}
            </div>

            <Divider>管理员</Divider>
            <div className='merchant-admins'>
                <Table
                    pagination={false}
                    size={"small"}
                    columns={[{
                        title: '序号',
                        dataIndex: 'index',
                        align: 'center',
                        width: 50,
                        render: (str, item, index) => index + 1
                    }, {
                        title: '手机号',
                        dataIndex: 'mobile',
                        align: 'center',
                        render: (mobile) => {
                            return <span>{mobile}</span>;
                        }
                    }, {
                        title: '名称',
                        dataIndex: 'name',
                        align: 'center',
                        render: (name) => {
                            return <a
                                style={{ wordWrap: 'break-word', wordBreak: 'break-word' }}>{name}</a>;
                        }
                    }, {
                        title: '状态',
                        dataIndex: 'status',
                        align: 'center',
                        render: (status) => {
                            return <div>{status === 1 ? "正常" : <p style={{ color: 'red', margin: '0px' }}>禁用</p>}</div>;
                        }
                    }, {
                        title: '操作',
                        dataIndex: 'opt',
                        align: 'center',
                        width: 100,
                        render: (obj, admin) => {
                            console.log(admin);
                            let { id, status, mobile } = admin;
                            return <Dropdown overlay={
                                <Menu>
                                    <Menu.Item key="0">
                                        <a onClick={() => {
                                            this.updateMerchantAdminStatus(id, status);
                                        }}>{status === 1 ? "禁用" : "启用"}</a>
                                    </Menu.Item>

                                    <Menu.Item key="1">
                                        <a onClick={() => {
                                            MerchantUtils.resetMerchantAdminPwd(mobile)
                                        }}>重置密码</a>
                                    </Menu.Item>
                                </Menu>
                            } trigger={['click']}>
                                <a className="ant-dropdown-link">操作 <Icon type="down" />
                                </a>
                            </Dropdown>;
                        }
                    }]}
                    rowKey={(item) => item.id}
                    dataSource={merchantAdmin}
                />

            </div>

        </Modal>

    }
}