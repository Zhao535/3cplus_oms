import React from 'react';
import {App, CTYPE, U, Utils} from "../../common";
import BreadcrumbCustom from "../../common/BreadcrumbCustom";
import {Link} from "react-router-dom";
import {Button, Card, Input, Form, Switch, Tag, Select, message, Table, Dropdown, Menu} from "antd";
import SettingUtils from "../common/SettingUtils";
import {PosterEdit} from "../../common/CommonEdit";
import HtmlEditor from "../../common/HtmlEditor";
import "../../assets/css/common/common-edit.less";
import ProductUtils from "../product/ProductUtils";
import Sortable from 'sortablejs'

const FormItem = Form.Item;
const {Option} = Select;

class SceneShoppingEdit extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            id: parseInt(this.props.match.params.id),
            scene: {},
            sceneTypes: [],
            qo: {}
        }

    }

    componentDidMount() {
        this.loadData()
    }

    loadData = () => {
        let {id, qo} = this.state;

        id &&
        App.api(`adm/sceneShopping/item`, {id: id}).then((scene) => {
            this.setState({
                scene
            }, this.productsSortListener)
        })

        App.api(`adm/sceneType/items`, {qo: JSON.stringify(qo)}).then((res) => {
            this.setState({sceneTypes: res.content})
        })

    }

    handleSubmit = () => {
        let {scene} = this.state;
        let {products = []} = scene;
        if (U.str.isEmpty(scene.title)) {
            message.warning('请输入名称')
        } else if (U.str.isEmpty(scene.subHeading)) {
            message.warning('请输入简介')
        } else if ((scene.title).length > 20) {
            message.warning('名称长度不能超过20字符')
        } else if ((scene.subHeading).length > 140) {
            message.warning('简介长度不可大于140个字符')
        } else if (U.str.isEmpty(scene.img)) {
            message.warning('请上传封面')
        } else if (products.length < 1) {
            message.warning('请选择至少一件商品')
        } else {
            App.api('adm/sceneShopping/save', {scene: JSON.stringify(scene)}).then(() => {
                message.success('保存成功');
                App.go(`/app/marketing/sceneShopping`)
            })
        }

    }

    productsSortListener = () => {
        let {scene} = this.state;
        let {products = []} = scene;
        if (products.length > 0) {
            let ul_products = document.getElementById('products_sorter')
            let sortable = Sortable.create(ul_products, {
                dataIdAttr: 'data-id',
                store: {
                    get: () => {
                        let {scene = {}} = this.state;
                        let {products = []} = scene;
                        return products.map((s) => {
                            return JSON.stringify(s);
                        })
                    },
                    set: (sortable) => {
                        let {scene = {}} = this.state;
                        this.setState({
                            scene: {
                                ...scene,
                                products: sortable.toArray().map((s) => {
                                    return JSON.parse(s);
                                })
                            }
                        })

                    }
                },
                onEnd: () => {
                    setTimeout(() => {
                        let {scene = {}} = this.state;
                        let {products = []} = scene;
                        let sort = products.map((s) => {
                            return JSON.stringify(s);
                        });
                        sortable.sort(sort);
                    }, 10);
                },
            });

        }

    }

    syncItems = (items) => {
        let {scene} = this.state;
        this.setState({
                scene: {
                    ...scene,
                    products: items
                }

            }, this.productsSortListener
        )
    };

    render() {
        let {scene, sceneTypes = [],} = this.state;
        let {products = [], img, content, title, type, status, subHeading} = scene;
        return (
            <div className={'common-edit-page'}>
                <BreadcrumbCustom first={<Link to={CTYPE.link.marketing.path}>{CTYPE.link.marketing.txt}</Link>}
                                  second={scene.id ? '编辑场景' : '添加场景'}/>
                <Card extra={<Button type="primary" icon="save" onClick={() => {
                    this.handleSubmit();
                }}>保存</Button>}>
                    <FormItem
                        required={true}
                        {...CTYPE.formItemLayout} label='场景标题'>
                        <Input.TextArea rows={1} value={title} placeholder="输入场景标题" maxLength={140}
                                        onChange={(e) => {
                                            this.setState({
                                                scene: {
                                                    ...scene,
                                                    title: e.target.value
                                                }
                                            });
                                        }}/>
                    </FormItem>

                    <FormItem
                        required={true}
                        {...CTYPE.formItemLayout} label='简介'>
                        <Input.TextArea rows={1} value={subHeading} placeholder="输入场景简介" maxLength={140}
                                        onChange={(e) => {
                                            this.setState({
                                                scene: {
                                                    ...scene,
                                                    subHeading: e.target.value
                                                }
                                            });
                                        }}/>
                    </FormItem>

                    <PosterEdit title='封面图' type='scene' img={img} required={true} syncPoster={(url) => {
                        scene.img = url;
                        this.setState({
                            scene: scene
                        });
                    }}/>

                    <FormItem required={true} {...CTYPE.formItemLayout} label='选择类别'>


                        <Select value={type} onChange={(value) => {
                            this.setState({
                                scene: {
                                    ...scene,
                                    type: parseInt(value)
                                }
                            })
                        }}
                                style={{width: '200px'}}>
                            {sceneTypes.map((type, index) => {
                                return <Option key={type.id} value={type.id}>{type.name}</Option>
                            })}
                        </Select>
                    </FormItem>
                    <FormItem
                        required={true}
                        {...CTYPE.formItemLayout} label='关联商品'>
                        <Button type={"primary"} icon={'file-add'} onClick={() => {
                            ProductUtils.productPicker(products, this.syncItems, true)
                        }}>选择商品</Button>
                        {products.length > 0 && <Card style={{maxWidth: '800px', minWidth: '300px'}}>
                            <ul id='products_sorter'>
                                {products.map((product, index) => {
                                    let {name, specs = []} = product;
                                    let {imgs = []} = specs[0];
                                    return <li style={{display: 'flex', padding: '30px 0'}}
                                               key={index}
                                               data-id={JSON.stringify(product)}
                                    >
                                        <img src={imgs[0]} style={{width: '100px', height: '100px', flex: '0 0 auto'}}/>
                                        <div style={{flex: '1', textAlign: 'center', lineHeight: '100px'}}>{name}
                                            <a style={{float: 'right'}} onClick={() => {
                                                this.setState({
                                                    scene: {
                                                        ...scene,
                                                        products: U.array.remove(products, index)
                                                    }
                                                }, this.productsSortListener)
                                            }}>移除</a>
                                        </div>

                                    </li>
                                })}</ul>
                        </Card>}
                    </FormItem>


                    <FormItem
                        required={true}
                        {...CTYPE.formItemLayout} label='场景描述'>
                        <HtmlEditor content={content} syncContent={(content) => {
                            this.setState({
                                scene: {
                                    ...scene,
                                    content: content
                                }
                            })

                        }}/>

                    </FormItem>


                </Card>
            </div>
        );
    }
}

export default SceneShoppingEdit;