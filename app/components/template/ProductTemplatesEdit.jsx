import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { CTYPE, U, Utils } from "../../common";
import BreadcrumbCustom from "../../common/BreadcrumbCustom";
import '../../assets/css/common/common-edit.less'
import { Button, Card, Icon, TreeSelect, Form, Input, Tabs, Switch, InputNumber, message } from "antd";
import App from "../../common/App";
import ProductUtils from "../product/ProductUtils";
import HtmlEditor from "../../common/HtmlEditor";
import CategoryUtils from '../category/CategoryUtils';


const FormItem = Form.Item;
const { TabPane } = Tabs;
const InputGroup = Input.Group;
const { Meta } = Card;
const { SHOW_PARENT } = TreeSelect;


class ProductTemplatesEdit extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: parseInt(this.props.match.params.id),//  this.props.match.params.id是String 需要parseInt
            template: {
                specs: [{
                    imgs: [],
                    params: [{ label: '', value: '' }]
                }],
                params: [{ label: '', value: '' }],
            },
            activeKey: '0',
            productCategories: [],
        }
    }

    componentDidMount() {
        this.loadData();
        ProductUtils.loadProductCategories(this, true);
    }

    // dealData = () => {
    //     let { productCategories = [] } = this.state;
    //     console.log(productCategories);
    //     let categoryList = CategoryUtils.categorys2List(productCategories);
    //     this.setState({ categoryList })
    // }

    loadData = () => {
        let { id } = this.state;
        console.log(id)
        {

            id !== 0 &&
                App.api(`adm/product/template`, { id: id }).then((template) => {
                    template["categoryId"] = template.sequence;
                    this.setState({
                        template: template
                    })
                })

        }

    }

    doImgOpt = (index, opt, img) => {
        console.log(img)
        let { template = {}, activeKey } = this.state;
        let { specs = [] } = template;
        let { imgs = [] } = specs[parseInt(activeKey)];

        if (opt === 'left') {
            if (index === 0) {
                message.warn('已经是第一个');
                return;
            }
            imgs = U.array.swap(imgs, index, index - 1);
        } else if (opt === 'right') {
            if (index === imgs.length - 1) {
                message.warn('已经是最后一个');
                return;
            }
            imgs = U.array.swap(imgs, index, index + 1);
        } else if (opt === 'remove') {
            imgs = U.array.remove(imgs, index);
        } else if (opt === 'add') {
            imgs.push(img);
        }

        specs[parseInt(activeKey)].imgs = imgs;

        this.setState({
            template: {
                ...template,
                specs
            }
        });
    };


    paneContent = (currSpec) => {
        let { activeKey, template } = this.state;
        let { specs = [] } = template;
        let spec = specs[parseInt(activeKey)] || {};
        let { imgs = [], params = [] } = currSpec;
        return <div>
            <Card>
                <div className='imgs-opt-block'>
                    {imgs.map((img, index) => {
                        return <Card key={index} className='img-card-edit'
                            cover={<img src={img} />}
                            actions={[
                                <Icon type="left" key="left"
                                    onClick={() => this.doImgOpt(index, 'left', img)} />,
                                <Icon type="delete" key="delete"
                                    onClick={() => this.doImgOpt(index, 'remove', img)} />,
                                <Icon type="right" key="right"
                                    onClick={() => this.doImgOpt(index, 'right', img)} />
                            ]}
                        />
                    })}

                    {imgs.length < 6 &&
                        <Card cover={<div className='up-icon' />}
                            className={'img-card-add'} onClick={() => {
                                Utils.common.showImgEditor(CTYPE.imgeditorscale.square, null, (img) => this.doImgOpt(0, 'add', img));
                            }}>
                            <Meta description='尺寸750*422,小于1M .jpg、.png格式' />
                        </Card>}

                </div>
            </Card>
            <Card title={'*属性'} size={"small"} style={{ margin: '10px 0', width: '100%' }}>
                {params.map((param, index) => {
                    let { label, value } = param;
                    return <div key={index}>
                        <InputGroup>
                            <Input onChange={(e) => {
                                specs[parseInt(activeKey)].params[index].label = e.target.value;
                                this.setState({
                                    template: {
                                        ...template,
                                        specs
                                    }
                                })
                            }
                            } placeholder={'属性名'} value={label} style={{ width: '150px' }} />
                            <Input onChange={(e) => {
                                specs[parseInt(activeKey)].params[index].value = e.target.value;
                                this.setState({
                                    template: {
                                        ...template,
                                        specs
                                    }
                                })
                            }}
                                placeholder={'属性内容'} value={value} style={{ width: '500px' }} />
                            {params.length === 2 ?
                                <Button
                                    onClick={() => {
                                        params = U.array.remove(params, index)
                                        spec.params = params;
                                        specs[parseInt(activeKey)] = spec;
                                        this.setState({
                                            template: {
                                                ...template,
                                                specs: specs
                                            }
                                        })
                                    }}
                                    icon={'minus'} style={{ color: '#fff', background: '#ff4d4f' }} /> : <Button
                                    onClick={() => {
                                        params.push({ label: '', value: '' });
                                        spec.params = params;
                                        specs[parseInt(activeKey)] = spec;
                                        this.setState({
                                            template: {
                                                ...template,
                                                specs: specs || []
                                            }
                                        })
                                    }}
                                    icon={'plus'} type={"primary"} />}
                        </InputGroup>
                    </div>
                })
                }
            </Card>

            <Card title={'*其他'} size={"small"} style={{ margin: '10px 0', width: '100%' }}>
                <FormItem required={true} {...CTYPE.formItemLayout} label='建议售价'>
                    <InputNumber value={U.price.cent2yuan(specs[parseInt(activeKey)].price)} onChange={(e) => {
                        specs[parseInt(activeKey)].price = U.price.yuan2cent(e);
                        this.setState({
                            template: {
                                ...template,
                                specs
                            }
                        })
                    }} style={{ width: '100px' }} />
                </FormItem>
                <FormItem required={true} {...CTYPE.formItemLayout} label='编号'>
                    <Input value={specs[parseInt(activeKey)].sno} onChange={(e) => {
                        specs[parseInt(activeKey)].sno = e.target.value;
                        this.setState({
                            template: {
                                ...template,
                                specs
                            }
                        })

                    }}
                        style={{ width: '100px' }} />
                </FormItem>
            </Card>
        </div>
    }


    onEdit = (targetKey, action) => {
        let { template = {}, activeKey } = this.state;
        let { specs = [] } = template;
        if (action === 'add') {
            specs.push({
                imgs: [],
                params: [{ label: '', val: '' }]
            });
        } else if (action === 'remove') {
            specs = U.array.remove(specs, parseInt(activeKey));
            activeKey = 0;
        }
        this.setState({
            template: {
                ...template,
                specs
            }, activeKey
        });
    };

    onSubmit = () => {
        let { template } = this.state;

        let { title, content, specs = [], params = [], categoryId } = template;

        if (U.str.isEmpty(title)) {
            message.warning('请输入名称')
        } else if (U.str.isEmpty(content)) {
            message.warning('请输入内容')

        } else if (!categoryId) {
            message.warning("请选择分类")
        } else {
            App.api(`adm/product/saveProductTemplate`, {
                template: JSON.stringify({
                    ...template,
                    sequence: categoryId,
                })
            }).then(() => {
                App.go(`/app/product/templates`)
            })
        }
    }


    render() {
        let { id, template = {}, activeKey, productCategories = [] } = this.state;
        let { specs = [], params = [], categoryId, title, content, status } = template;

        let currSpec = specs[parseInt(activeKey)];

        return <div className={'common-edit-page'}>
            <BreadcrumbCustom
                first={<Link to={CTYPE.link.product_templates.path}>{CTYPE.link.product_templates.txt}</Link>}
                second={id !== 0 ? "编辑模板" : "新建模板"}
            />
            <Card
                extra={<Button onClick={() => this.onSubmit()}
                    type={"primary"}><Icon type={'file-add'} />保存</Button>}>
                <FormItem required={true} {...CTYPE.formItemLayout} label='分类'>
                    <TreeSelect treeData={productCategories} treeDefaultExpandAll={true} allowClear={true} treeCheckable={false}
                        showCheckedStrategy={SHOW_PARENT}
                        style={{ width: '500px' }} value={categoryId} onChange={value => this.setState({
                            template: {
                                ...template,
                                categoryId: value
                            }
                        })}
                    />
                </FormItem>
                <FormItem required={true} {...CTYPE.formItemLayout} label='名称'>
                    <Input value={title} onChange={(e) => {
                        this.setState({
                            template: {
                                ...template,
                                title: e.target.value
                            }
                        })
                    }} />
                </FormItem>


                <FormItem required={true} {...CTYPE.formItemLayout} label='产品规格'>
                    <Tabs
                        onChange={(activeKey) => {
                            this.setState({ activeKey })
                        }}
                        activeKey={activeKey.toString()}
                        type="editable-card"
                        onEdit={this.onEdit}
                    >{specs.map((spec, index) => {
                        return <TabPane tab={`规格${index + 1}`} key={index} closable={specs.length > 1}>
                            {this.paneContent(currSpec)}
                        </TabPane>
                    })
                        }</Tabs>
                </FormItem>
                <FormItem required={true} {...CTYPE.formItemLayout} label='产品参数'>
                    <Card style={{ width: '800px' }}> {params.map((param, index) => {
                        return <div className={'param'} key={index}>
                            <InputGroup>
                                <Input onChange={(e) => {
                                    params[index].label = e.target.value;
                                    this.setState({
                                        template: {
                                            ...template,
                                            params
                                        }
                                    })
                                }}
                                    placeholder={'属性名'} value={param.label} style={{ width: '150px' }} />
                                <Input onChange={(e) => {
                                    params[index].value = e.target.value;
                                    this.setState({
                                        template: {
                                            ...template,
                                            params
                                        }
                                    })
                                }} placeholder={'属性内容'} value={param.value} style={{ width: '500px' }} />
                                {params.length > 1 &&
                                    <Button onClick={() => {
                                        console.log("-----")
                                        params = U.array.remove(params, index)
                                        this.setState({
                                            template: {
                                                ...template,
                                                params: params
                                            }
                                        })
                                    }}
                                        icon="minus" type={'button'}
                                        style={{ width: '32px', height: '32px', color: '#fff', background: '#ff4d4f' }} />}
                                {params.length === (index + 1) &&
                                    <Button onClick={() => {
                                        console.log('+++++')
                                        params.push({ label: '', value: '' })
                                        this.setState({
                                            template: {
                                                ...template,
                                                params: params
                                            }
                                        })
                                    }}
                                        icon="plus" type="primary" style={{ width: '32px', height: '32px' }} />}
                            </InputGroup>
                        </div>
                    })}
                    </Card>
                </FormItem>
                <FormItem required={false} {...CTYPE.formItemLayout} label='产品介绍'>
                    <HtmlEditor content={content} syncContent={(content) => {
                        this.setState({
                            template: {
                                ...template,
                                content: content
                            }
                        })

                    }} />
                </FormItem>


            </Card>
        </div>
    }
}

export default ProductTemplatesEdit;