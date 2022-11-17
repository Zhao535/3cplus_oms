import React from 'react';
import {App, Utils, CTYPE, U} from "../../common";
import BreadcrumbCustom from "../../common/BreadcrumbCustom";
import {
    Button,
    Card,
    DatePicker,
    Descriptions,
    Form,
    Input,
    InputNumber,
    message,
    Pagination,
    Select,
    Table
} from "antd";
import ProductUtils from "../product/ProductUtils";

const {RangePicker} = DatePicker;

const FormItem = Form.Item;
const {Option} = Select;

class SecKillEdit extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            id: parseInt(this.props.match.params.id) || 0,
            secKill: {},
        }
    }

    componentDidMount() {
        this.loadData();
    }

    loadData = () => {
        let {id} = this.state;
        if (id) {
            App.api(`/adm/secKill/secKill`, {id: id}).then((result) => {
                this.setState({secKill: result, product: result.product});
            })
        }
    }

    syncItems = (items) => {
        let {secKill = {}} = this.state;
        let product = items[0];
        let {specs = []} = product;
        let secKillSpec = [];
        specs.map((spec, index) => {
            let {sno = ''} = spec;
            let skSpec = {sno, price: 0, num: 0}
            secKillSpec.push(skSpec);
        })
        this.setState({
                secKill: {
                    ...secKill,
                    product,
                    productId: product.id,
                    secKillSpec,
                }
            }
        )
    };

    submit = () => {
        let {secKill = {}} = this.state;
        let {title = '', startAt, endAt, productId, secKillSpec = [], product} = secKill;
        let {specs = []} = product;
        let isEmptySpec = true;
        let isLessThanOriPrice = true;
        if (title.length < 4 || title.length > 30) {
            message.info('请检查标题,长度不可小于4个或大于30个字符')
        }
        if (!startAt) {
            message.info('请检查开始时间')
        }
        if (!endAt) {
            message.info('请检查结束时间')
        }
        secKillSpec.map((spec, index) => {
            let {num = 0, sno = '', price = 0} = spec;
            let sp = specs.find(s => s.sno === sno) || {};
            if (num > 0) {
                isEmptySpec = false;
            }
            if (price > sp.price) {
                isLessThanOriPrice = false;
            }
        })
        if (isEmptySpec) {
            message.info('至少有一个规格数量不为0')
        }
        if (!isLessThanOriPrice) {
            message.info('秒杀价不可大于原价')
        }
        App.api(`adm/secKill/save`, {secKill: JSON.stringify(secKill)}).then(() => {
            message.success('保存成功');
            App.go(`/app/product/secKills`)
        })

    }


    render() {
        let {secKill = {}, id = 0} = this.state
        let {title, product = {}, secKillSpec = [], startAt, endAt,} = secKill;
        let {specs = [], name = ''} = product;
        return (
            <div>
                <BreadcrumbCustom first='编辑秒杀'/>
                <Card extra={<Button icon={"save"} type="primary" onClick={() => {
                    this.submit()
                }}>保存</Button>}>
                    <FormItem
                        required={true}
                        {...CTYPE.formItemLayout} label='活动标题'>
                        <Input.TextArea style={{width: '350px'}} maxLength={50} rows={1} value={title}
                                        placeholder="请输入活动标题" onChange={(e) => {
                            this.setState({
                                secKill: {
                                    ...secKill,
                                    title: e.target.value,
                                }
                            })
                        }}/>
                    </FormItem>
                    <FormItem
                        required={true}
                        {...CTYPE.formItemLayout} label='时间段'>
                        <RangePicker showTime={true} onChange={(dates, dateStrings) => {
                            this.setState({
                                secKill: {
                                    ...secKill,
                                    startAt: U.date.str2date(dateStrings[0]),
                                    endAt: U.date.str2date(dateStrings[1])
                                }
                            })
                        }}/>
                    </FormItem>
                    <FormItem required={true}
                              {...CTYPE.formItemLayout} label='秒杀商品'>
                        <Button icon={"file-add"} type="primary" onClick={() => {
                            ProductUtils.productPicker([], this.syncItems, false)
                        }}>关联商品</Button>
                    </FormItem>
                    {specs.length > 0 && <React.Fragment>
                        <FormItem required={true}
                                  {...CTYPE.formItemLayout} label='商品名称'>
                            {name}
                        </FormItem>
                        <FormItem required={false}
                                  {...CTYPE.formItemLayout} label='详情'>

                            <Table bordered={false} columns={[
                                {
                                    title: '图片',
                                    dataIndex: 'imgs',
                                    className: 'txt-center',
                                    render: (obj) => {
                                        let img = obj[0];
                                        return <img style={{width: '60px', height: '60px'}} src={img}/>
                                    }
                                },
                                {
                                    title: '规格名称',
                                    dataIndex: 'params',
                                    className: 'txt-center',
                                    render: (obj, item) => {
                                        let {params = []} = item;
                                        return <div><span>{params[0].value}{params.length > 1 && params[1].value}</span>
                                        </div>
                                    }
                                }, {
                                    title: '价格',
                                    dataIndex: 'price',
                                    className: 'txt-center',
                                    render: (obj) => {
                                        return <span>{U.price.cent2yuan(obj)}</span>
                                    }
                                }, {
                                    title: '库存',
                                    dataIndex: 'stock',
                                    className: 'txt-center',
                                    render: (stock, item) => {
                                        return <div>{stock}</div>
                                    }
                                }, {
                                    title: '秒杀价',
                                    dataIndex: 'secKillPrice',
                                    className: 'txt-center',
                                    render: (obj, item) => {
                                        let {stock = 0, sno = ''} = item;
                                        let spec = secKillSpec.find(s => s.sno === sno) || {};
                                        let {price = 0} = spec;
                                        let index = U.array.getIndex(secKillSpec, spec);
                                        return <InputNumber value={U.price.cent2yuan(price)} min={0} onChange={(e) => {
                                            spec.price = U.price.yuan2cent(e);
                                            if (!spec) {
                                                spec.sno = sno;
                                            }
                                            secKillSpec = U.array.replace(secKillSpec, index, spec);
                                            this.setState({
                                                secKill: {
                                                    ...secKill,
                                                    secKillSpec,
                                                }
                                            })
                                        }}/>
                                    }
                                },
                                {
                                    title: '数量',
                                    dataIndex: 'num',
                                    className: 'txt-center',
                                    render: (obj, item) => {
                                        let {stock = 0, sno = ''} = item;
                                        let spec = secKillSpec.find(s => s.sno === sno) || {};
                                        let {num = 0} = spec;
                                        let index = U.array.getIndex(secKillSpec, spec);
                                        return <InputNumber value={num} min={0} max={stock} onChange={(e) => {
                                            if (spec) {
                                                spec.sno = sno;
                                            }
                                            spec.num = e;
                                            secKillSpec = U.array.replace(secKillSpec, index, spec);
                                            this.setState({
                                                secKill: {
                                                    ...secKill,
                                                    secKillSpec,
                                                }
                                            })
                                        }}/>
                                    }
                                }
                            ]} dataSource={specs} pagination={false} size={"small"}/>
                        </FormItem>
                    </React.Fragment>}
                </Card>
            </div>
        );
    }

}

export default SecKillEdit;