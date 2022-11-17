import React from 'react';
import {U, CTYPE, Utils} from "../../common";
import App from "../../common/App";
import BreadcrumbCustom from "../../common/BreadcrumbCustom";
import {Button, Card, Dropdown, Icon, Menu, Pagination, Table} from "antd";
import CouponUtils from "../coupon/CouponUtils";

class Coupons extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            pagination: {
                current: 1,
                pageSize: CTYPE.pagination.pageSize,
                total: 0,
            },
            coupons: [],
            loading: false,

        }
    }

    componentDidMount() {
        this.loadData();
    }

    loadData = () => {
        this.setState({loading: true})
        let {pagination = {}} = this.state;
        let {current = 1, pageSize = 10} = pagination;
        App.api(`adm/coupon/coupons`, {
            qo: JSON.stringify({
                pageNumber: current,
                pageSize: pageSize
            })
        }).then((result) => {
            this.setState({
                pagination: Utils.pager.convert2Pagination(result),
                coupons: result.content,
                loading: false
            });
        })
    }

    handleTableChange = (pagination) => {
        this.setState({pagination}, this.loadData)
    }

    render() {
        let {coupons = [], pagination = {}, loading} = this.state;
        let {current, pageSize, total} = pagination;
        const coupon = {};
        return <div>
            <BreadcrumbCustom first={CTYPE.link.coupon.txt}/>
            <Card>
                <div>
                    <Button type={"primary"} onClick={() => {
                        CouponUtils.couponEdit(coupon, this.loadData)
                    }}>创建优惠券</Button>
                </div>
                <Table columns={[{
                    title: '序号',
                    dataIndex: 'index',
                    align: 'center',
                    render: (text, item, index) => index + 1
                }, {
                    title: '使用范围',
                    dataIndex: 'payload',
                    className: 'txt-center',
                    render: (obj, item, index) => {
                        let {type = 0, category = {}, product = {}} = obj;
                        return <div>
                            {type === 1 && '全场使用'}
                            {type === 2 && `仅限${category.name}类使用`}
                            {type === 3 && `仅限${product.name}商品使用`}
                        </div>
                    }
                }, {
                    title: '优惠规则',
                    dataIndex: 'rule',
                    className: 'txt-center',
                    render: (obj, item, index) => {
                        let {rule = {}} = item;
                        console.log(item);
                        let {type = 0, values = []} = rule;
                        return <div>
                            {type === 1 && `满${U.price.cent2yuan(values[0], true)}减${U.price.cent2yuan(values[1], true)}`}
                            {type === 2 && `每${U.price.cent2yuan(values[0], true)}减${U.price.cent2yuan(values[1], true)}`}
                            {type === 3 && `直减${U.price.cent2yuan(values[0], true)}`}
                        </div>
                    }
                }, {
                    title: '有效期',
                    dataIndex: 'duration',
                    className: 'txt-center',
                    render: (obj) => {
                        return <div>
                            {obj}天
                        </div>
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
                    render: (obj, item, index) => {
                        return <Dropdown overlay={<Menu>
                            <Menu.Item key="1">
                                <a onClick={() => CouponUtils.couponEdit(item, this.loadData)}>编辑</a>
                            </Menu.Item>
                        </Menu>} trigger={['click']}>
                            <a className="ant-dropdown-link">
                                操作 <Icon type="down"/>
                            </a>
                        </Dropdown>
                    }
                }
                ]}
                       rowKey={(coupons) => coupons.id}
                       dataSource={coupons}
                       loading={loading}
                       pagination={{...pagination, ...CTYPE.commonPagination}}
                       onChange={this.handleTableChange}
                />

            </Card>
        </div>

    }
}

export default Coupons;