import React from 'react';
import { Button, Form, Input, Modal, Radio, InputNumber, message } from "antd";
import { App, CTYPE, Utils } from "../../common";
import CategoryUtils from "../category/CategoryUtils";
import ProductUtils from '../product/ProductUtils';

const FormItem = Form.Item;
const id_dev = "coupon_edit";
const RadioGroup = Radio.Group;
class CouponEdit extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            coupon: this.props.coupon,
        }
    }

    componentDidMount() {
        this.dealData()
    }

    dealData = () => {
        let { coupon = {} } = this.state;
        let { rule = {} } = coupon;
        if (!rule.values) {
            this.setState({
                coupon: {
                    ...coupon,
                    rule: {
                        ...rule,
                        values: ["0", "0"]
                    }
                }
            })
        }
    }

    handleSubmit = () => {
        let { coupon = {} } = this.state;
        let { payload = {}, rule = {}, duration } = coupon;
        let { values = [] } = rule;
        let { type, category = {}, product = {} } = payload;
        if (type === 2 && Object.keys(category).length === 0) {
            message.warning("请选择优惠券分类")
            return;
        }
        if (type === 3 && Object.keys(product).length === 0) {
            message.warning("请选择优惠商品");
            return;
        }
        if (!rule.type) {
            message.warning("请选择减免类型");
            return;
        }
        if (duration <= 0) {
            message.warning("请输入优惠券过期限时时长");
            return;
        }
        if (rule.type === 1 || rule.type === 2) {
            if (values[0] <= 0 || values[1] <= 0) {
                message.warning("请输入满减价格")
                return;
            }
            if (values[0] <= values[1]) {
                message.warning("满(每)减优惠价格不符合要求")
                return;
            }
        }
        if (rule.type === 3) {
            if (values[0] <= 0) {
                message.warning("直减优惠价格不符合要求")
                return;
            }
        }

        App.api(`adm/coupon/save_coupon`,
            {
                coupon:
                    JSON.stringify(coupon)
            }).then(() => {
                message.success("优惠券新建成功");
                this.close();
                this.props.loadData()
            })
    }

    close = () => {
        Utils.common.closeModalContainer(id_dev)
    }

    changePayloadType = (value) => {
        let { coupon = {} } = this.state;
        let { payload = {} } = coupon;
        payload["type"] = value;
        this.setState({
            coupon: {
                ...coupon,
                payload: payload
            }
        })
    }

    changePayloadCategory = (category) => {
        let { coupon = {} } = this.state;
        let { payload = {} } = coupon;
        payload["category"] = category;
        this.setState({
            coupon: {
                ...coupon,
                payload: payload
            }
        })
    }

    changePayLoadProduct = (product) => {
        let { coupon = {} } = this.state;
        let { payload = {} } = coupon;
        payload["product"] = product[0];
        this.setState({
            coupon: {
                ...coupon,
                payload: payload
            }
        })
    }
    changeRuleType = (value) => {
        let { coupon = {} } = this.state;
        let { rule = {} } = coupon;
        rule["type"] = value;
        rule["values"] = (value === 1 || value === 2) ? ["", ""] : [""],
            this.setState({
                coupon: {
                    ...coupon,
                    rule: rule
                }
            })
    }

    render() {
        let { coupon = {} } = this.state;
        let { payload = {}, rule = {}, createdAt, duration = 0 } = coupon;
        let { type, category = {}, product = {} } = payload;
        let { values = ["", ""] } = rule;
        console.log(coupon);
        return <Modal
            width={700}
            title={'编辑优惠券'}
            getContainer={() => Utils.common.createModalContainer(id_dev)}
            visible={true}
            onOk={() => this.handleSubmit()}
            onCancel={() => {
                this.close()
            }}
            okText="确认"
            cancelText="取消">
            <FormItem
                required={true}
                {...CTYPE.formItemLayout} label='适用范围'>
                <Radio.Group value={type} onChange={(e) => { this.changePayloadType(e.target.value) }}>
                    <Radio value={1}>通用券</Radio>
                    <Radio value={2}>分类券</Radio>
                    <Radio value={3}>商品券</Radio>
                </Radio.Group>
            </FormItem>

            {type === 2 && <FormItem
                required={true}
                {...CTYPE.formItemLayout} label='适用内容'>
                <Button type="primary" onClick={() => {
                    CategoryUtils.categoryCouponPicker(category, this.changePayloadCategory)
                }}>设置内容</Button>
            </FormItem>}

            {type === 3 && <FormItem
                required={true}
                {...CTYPE.formItemLayout} label='适用内容'>
                <Button type="primary" onClick={() => {
                    ProductUtils.productPicker([product], this.changePayLoadProduct, false)
                }}>设置内容</Button>
            </FormItem>}

            <FormItem
                required={true}
                {...CTYPE.formItemLayout} label='使用规则'>
                <Radio.Group value={rule.type} onChange={(e) => { this.changeRuleType(e.target.value) }}>
                    <Radio value={1}>满减</Radio>
                    <Radio value={2}>每减</Radio>
                    <Radio value={3}>直减</Radio>
                </Radio.Group>
            </FormItem>
            {(rule.type === 1 || rule.type === 2) && <FormItem
                required={true}
                {...CTYPE.formItemLayout} label='方案'>
                <span style={{ paddingLeft: "5px", paddingRight: "5px" }}>{rule.type === 1 ? "满" : "每"}</span><InputNumber min={0} value={values[0] / 100} onChange={(value) => {
                    coupon.rule.values[0] = value * 100
                    this.setState({ coupon })
                }} />
                <span style={{ paddingLeft: "5px", paddingRight: "5px" }}>减</span><InputNumber min={0} value={values[1] / 100} onChange={(value) => {
                    coupon.rule.values[1] = value * 100
                    this.setState({ coupon })
                }} />
            </FormItem>
            }

            {rule.type === 3 && <FormItem
                required={true}
                {...CTYPE.formItemLayout} label='方案'>
                <span style={{ paddingLeft: "5px", paddingRight: "5px" }}>直减</span><InputNumber min={0} value={values[0] / 100} onChange={(value) => {
                    coupon.rule.values[0] = value * 100
                    this.setState({ coupon })
                }} />
            </FormItem>
            }

            <FormItem
                required={true}
                {...CTYPE.formItemLayout} label='有效期'>
                <InputNumber min={0} value={duration} onChange={(value) => {
                    this.setState({
                        coupon: {
                            ...coupon,
                            duration: value,
                        }
                    })
                }} /><span style={{ paddingLeft: "5px" }}>天</span>
            </FormItem>


        </Modal>
    }


}

export default CouponEdit;