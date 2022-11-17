import React from 'react';
import {Button, Card, Cascader, Form, Icon, Input, InputNumber, message, Switch, TreeSelect} from 'antd';
import {App, CTYPE, U, Utils} from "../../common";
import {Link} from 'react-router-dom';
import BreadcrumbCustom from "../../common/BreadcrumbCustom";
import {PosterEdit} from "../../common/CommonEdit"
import {ProductEdit} from "../../common/ProductEdit"

import {CommonPeriodSelector} from "../../components/common/CommonComponents";
import ProductUtils from "../product/ProductUtils";

const {Meta} = Card;
const FormItem = Form.Item;
const {SHOW_PARENT}=TreeSelect;

export default class MerchantEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: parseInt(this.props.match.params.id),
            merchant: {
                duration: '1Y'
            },
            merchantAdmin: {},
            regions: [],
            loading: false,
            productCategories: []
        };
    }

    componentDidMount() {
        this.loadData();
        Utils.addr.loadRegion(this);
        ProductUtils.loadProductCategories(this, false)
    }

    loadData = () => {
        let {id} = this.state;
        if (id) {
            App.api('/adm/merchant/item', {id}).then(merchant => {
                this.setState({merchant: merchant});
            });
        }
    };

    handleSubmit = () => {
        let {merchant , merchantAdmin} = this.state;
        let {name, mobile, logo, imgs = []} = merchant;
        if (U.str.isEmpty(name)) {
            message.warn('请添加商户名');
        } else if (name.length < 5 || name.length > 40) {
            message.warn('商户名长度必须大于5个小于40个字符');
        } else if (U.str.isEmpty(mobile)) {
            message.warn('请添加商户手机号');
        } else if (U.str.isEmpty(logo)) {
            message.warn('请添加商户logo');
        } else if (U.str.isEmpty(imgs)) {
            message.warn('请添加图片组`');
        } else {
            this.setState({loading: true});
            App.api('/adm/merchant/save', {
                merchant: JSON.stringify(merchant),
                merchantAdmin: JSON.stringify(merchantAdmin)
            }).then(() => {
                message.success('保存成功');
                this.setState({loading: false});
                App.go('/app/merchant/merchants');
            }, () => this.setState({loading: false}));
        }
    };

    doImgOpt = (index, opt, img) => {
        let {merchant = {}} = this.state;
        let {imgs = []} = merchant;

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

        this.setState({
            merchant: {
                ...merchant,
                imgs
            }
        });
    };

    syncLocation = (loc, _code) => {
        let {merchant = {}} = this.state;
        let {latlng = {}, poiaddress, poiname, code} = loc;
        let {location = {}} = merchant;
        location = {
            ...location,
            lat: latlng.lat,
            lng: latlng.lng,
            poiaddress, poiname, code: _code || code
        };

        this.setState({
            merchant: {
                ...merchant,
                location
            }
        });

    };

    render() {
        let {merchant = {}, loading, merchantAdmin, regions = [], productCategories = []} = this.state;
        let {mobile, duration = '1Y', logo, imgs = [], id, name, location = {}, sequences = []} = merchant;
        let {poiaddress = '', poiname = '', code, detail} = location;
        let codes = Utils.addr.getCodes(code);
        return <div className='common-edit-page'>
            <BreadcrumbCustom
                first={<Link to={CTYPE.link.merchant.path}>{CTYPE.link.merchant.txt}</Link>}
                second={id ? '编辑商户管理员' : '新建商户管理员'}/>

            <Card extra={<Button type="primary" icon="save" loading={loading} onClick={() => {
                this.handleSubmit();
            }}>保存</Button>}>
                <FormItem
                    required={true}
                    {...CTYPE.formItemLayout} label='商户名称'>
                    <Input.TextArea rows={1} placeholder="输入商户名称" maxLength={40}
                                    value={name}
                                    onChange={(e) => {
                                        this.setState({
                                            merchant: {
                                                ...merchant,
                                                name: e.target.value
                                            }
                                        });
                                    }}/>
                </FormItem>

                <PosterEdit title='商户logo' type='s' img={logo} required={true} syncPoster={(url) => {
                    merchant.logo = url;
                    this.setState({
                        merchant: merchant
                    });
                }}/>
                <FormItem required={true}  {...CTYPE.formItemLayout} label={'经营范围'}>
                    <TreeSelect style={{width: '273px'}} placeholder={'请选择分类'} treeCheckable allowClear={true}
                                showCheckedStrategy={SHOW_PARENT}
                                value={sequences}
                                treeData={productCategories} onChange={(value) => {
                        sequences=value;
                        console.log(value)
                        console.log(sequences)
                        this.setState({
                            merchant: {
                                ...merchant,
                                sequences: sequences
                            }
                        })
                    }}/>
                </FormItem>
                <FormItem required={true}
                          {...CTYPE.formItemLayout}
                          label='地图选址'>
                    <Input value={poiaddress + '' + poiname} disabled={true}
                           addonAfter={<Icon type="environment" onClick={() => {
                               Utils.common.locationPicker(this.syncLocation);
                           }}/>}/>
                </FormItem>

                <FormItem required={true}
                          {...CTYPE.formItemLayout}
                          label='区域'>
                    <Cascader style={{width: '300px'}}
                              value={codes}
                              options={regions}
                              placeholder="请选择省市区"
                              onChange={(codes) => {
                                  location.code = codes[2];
                                  this.setState({
                                      merchant: {
                                          ...merchant, location,
                                      }
                                  });
                              }}/>
                </FormItem>

                <FormItem required={true}
                          {...CTYPE.formItemLayout}
                          label='详细地址'>
                    <Input value={detail} onChange={(e) => {
                        location.detail = e.target.value;
                        this.setState({
                            merchant: {
                                ...merchant, location,
                            }
                        });
                    }}/>

                </FormItem>

                <FormItem
                    required={true}
                    {...CTYPE.formItemLayout} label='店铺联系方式'>
                    <Input placeholder="请输入手机号" maxLength={40}
                           value={mobile}
                           onChange={(e) => {
                               this.setState({
                                   merchant: {
                                       ...merchant,
                                       mobile: e.target.value
                                   }
                               });
                           }}/>
                </FormItem>

                <FormItem
                    required={true}
                    {...CTYPE.formItemLayout} label='店铺形象图'>
                    <div className='imgs-opt-block'>

                        {imgs.map((img, index) => {
                            return <Card key={index} className='img-card-edit'
                                         cover={<img src={img}/>}
                                         actions={[
                                             <Icon type="left" key="left"
                                                   onClick={() => this.doImgOpt(index, 'left')}/>,
                                             <Icon type="delete" key="delete"
                                                   onClick={() => this.doImgOpt(index, 'remove')}/>,
                                             <Icon type="right" key="right"
                                                   onClick={() => this.doImgOpt(index, 'right')}/>
                                         ]}
                            />
                        })}

                        {imgs.length < 6 &&
                        <Card cover={<div className='up-icon'/>}
                              className={'img-card-add'} onClick={() => {
                            Utils.common.showImgEditor(CTYPE.imgeditorscale.rectangle_h, null, (img) => this.doImgOpt(0, 'add', img));
                        }}>
                            <Meta description='尺寸750*422,小于1M .jpg、.png格式'/>
                        </Card>}

                    </div>
                </FormItem>

                <FormItem
                    required={true}
                    {...CTYPE.formItemLayout}
                    label='套餐时长'>
                    <CommonPeriodSelector periods={CTYPE.expirePeriods} period={duration} withForever={false}
                                          syncPeriod={(val) => {
                                              this.setState({
                                                  merchant: {
                                                      ...merchant,
                                                      duration: val
                                                  }
                                              });
                                          }}/>
                </FormItem>


                {!id && <div>
                    <FormItem
                        required={true}
                        {...CTYPE.formItemLayout} label='管理员名称'>
                        <Input.TextArea rows={1} placeholder="输入管理员名称" maxLength={140}
                                        value={merchantAdmin.name}
                                        onChange={(e) => {
                                            this.setState({
                                                merchantAdmin: {
                                                    ...merchantAdmin,
                                                    name: e.target.value
                                                }
                                            });
                                        }}/>
                    </FormItem>
                    <FormItem
                        required={true}
                        {...CTYPE.formItemLayout} label='管理员手机号'>
                        <Input.TextArea rows={1} placeholder="输入管理员手机号" maxLength={11}
                                        value={merchantAdmin.mobile}
                                        onChange={(e) => {
                                            this.setState({
                                                merchantAdmin: {
                                                    ...merchantAdmin,
                                                    mobile: e.target.value
                                                }
                                            });
                                        }}/>
                    </FormItem>
                    <FormItem
                        required={true}
                        {...CTYPE.formItemLayout} label='登录密码'>
                        <Input type={'password'} rows={1} placeholder="输入密码" maxLength={20}
                                        value={merchantAdmin.password}
                                        onChange={(e) => {
                                            this.setState({
                                                merchantAdmin: {
                                                    ...merchantAdmin,
                                                    password: e.target.value
                                                }
                                            });
                                        }}/>
                    </FormItem>
                </div>}


            </Card>
        </div>;

    }
}
