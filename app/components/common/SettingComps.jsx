import React from 'react'
import { Icon, Input, message, Modal, Select, Button } from 'antd'
import SettingUtils from "./SettingUtils";
import '../../assets/css/common/common-edit.less'
import '../../assets/css/common/common-list.less'
import { App, CTYPE, Utils, U } from "../../common";

const Option = Select.Option;
const InputSearch = Input.Search;

const id_div_banner = 'div-dialog-banenr-edit';

class BannerEdit extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            actions: SettingUtils.linkActions,
            banner: this.props.banner,
            list: [],
            UIType: this.props.UIType || 1,
        };
    }

    componentWillReceiveProps(newProps) {
        this.setState({
            banner: newProps.banner
        });
    }

    syncImg = (url) => {
        let banner = this.state.banner;
        this.setState({
            banner: {
                ...banner,
                img: url
            }
        });
    };

    syncPayload = (items) => {
        let banner = this.state.banner;
        this.setState({
            banner: {
                ...banner,
                payload: items[0]
            }
        });
    };

    doSave = () => {

        let banner = this.state.banner;
        let { img, act, payload = {} } = banner;

        if (U.str.isEmpty(img)) {
            message.warn('请上传图片');
            return;
        }

        if (act === 'LINK' && U.str.isEmpty(payload.url)) {
            message.warn('请填写跳转地址');
            return;
        }

        if (act !== 'NONE' && act !== 'LINK' && !payload.id) {
            message.warn('请选择关联明细');
            return;
        }

        this.props.syncBanner(banner);
        this.close();

    };

    pick = (act, item) => {
        let isMerchant = act === 'MERCHANT';
        let isProduct = act === 'PRODUCT';
        let isSecKill = act = "SECKILL";

        if (isMerchant) {
            SettingUtils.merchantPicker([item], this.syncPayload, false);
        } else if (isProduct) {
            SettingUtils.productPicker([item], this.syncPayload)
        } else if (isSecKill) {
            SettingUtils.seckillPicker([item], this.syncPayload,false);
        }
    };

    close = () => {
        Utils.common.closeModalContainer(id_div_banner);
    };

    render() {
        let { banner, actions = [], list = [], UIType } = this.state;
        let { act = 'NONE', payload = { id: 0, title: '', url: '' }, img, type } = banner;
        let showLink = act === 'LINK';
        let showPicker = act !== 'NONE' && act !== 'LINK';

        let isBanner = type === 'BANNER';
        let isAd = type === 'AD';

        let txt = '轮播图';
        let ratio;
        if (isBanner) {
            if (UIType === 1) {
                ratio = CTYPE.imgeditorscale.square;
            } else {
                ratio = CTYPE.imgeditorscaleCourse.square;
            }
        }

        if (isAd) {
            txt = '广告位';
            ratio = CTYPE.imgeditorscale.rectangle_ad;
        }

        return <Modal
            getContainer={() => Utils.common.createModalContainer(id_div_banner)}
            visible={true}
            title={`编辑${txt}`}
            width='1000px'
            maskClosable={false}
            onCancel={this.close}
            onOk={this.doSave}>

            <div className="common-edit-page">

                <div className="form">

                    {(isAd || isBanner) && <div className="line">
                        <div className="p required">图片</div>
                        <div
                            className={ratio === 1 ? 'upload-img-square' : (ratio === 0.29 ? 'upload-img-ad' : 'upload-img-h')}
                        >
                            {img && <img src={img} className="img" />}
                        </div>
                        <span style={{ marginTop: '50px', marginLeft: '10px' }}>
                            建议上传图片尺寸{(UIType === 1) && isBanner && '345 * 345'}{(UIType !== 1) && isBanner && '345 * 200'}{isAd && '345 * 100'}，.jpg、.png格式，文件小于1M
                            <div><Button type="primary" onClick={() => Utils.common.showImgEditor(ratio, img, this.syncImg)}><Icon type="file-add" />选择图片</Button></div>
                        </span>
                    </div>}

                    <div className="line">
                        <div className='p'>跳转类型</div>
                        <Select
                            showSearch
                            style={{ width: 600 }}
                            optionFilterProp="children"
                            value={act}
                            onChange={(act) => {
                                this.setState({
                                    banner: {
                                        ...banner,
                                        act,
                                    }
                                })
                            }}
                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                            {actions.map((act) => {
                                return <Option key={act.key}><span
                                    className={act.disabled ? 'font-red' : ''}>{act.name}</span></Option>
                            })}
                        </Select>
                    </div>

                    {showPicker && <div className="line">
                        <div className='p'>关联明细</div>

                        {!payload.id && <a onClick={() => {
                            this.pick(act, {});
                        }}>选择</a>}
                        {payload.id > 0 && <span>{payload.title}&nbsp;&nbsp;<a onClick={() => {
                            this.pick(act, payload);
                        }}>修改</a></span>}

                    </div>}

                    {showLink && <div className="line">
                        <div className="p required">链接</div>
                        <Input.TextArea className=" textarea" placeholder="输入跳转链接"
                            value={payload.url}
                            onChange={(e) => {
                                this.setState({
                                    banner: {
                                        ...banner,
                                        payload: { url: U.str.trim(e.target.value) }
                                    }
                                })
                            }} />
                    </div>}
                </div>
            </div>
        </Modal>
    }
}


const id_div_nav = 'div-dialog-nav-edit';

class NavEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            nav: this.props.nav
        }
    }

    syncImg = (url) => {
        let nav = this.state.nav;
        this.setState({
            nav: {
                ...nav,
                icon: url
            }
        });
    };

    doSave = () => {

        let nav = this.state.nav;
        let { icon, name, type } = nav;
        if (U.str.isEmpty(icon)) {
            message.warn('请上传图标');
            return;
        }

        if (U.str.isEmpty(name)) {
            message.warn('请填写名称');
            return;
        }

        if (U.str.isEmpty(type)) {
            message.warn('请选择类型');
            return;
        }
        this.props.syncBanner(nav);
        this.close();

    };

    close = () => {
        Utils.common.closeModalContainer(id_div_nav);
    };

    render() {
        let { nav = {} } = this.state;
        let { icon, name, type } = nav;

        let ratio = CTYPE.imgeditorscale.square;
        const style = { width: '100px', height: '100px' };
        return <Modal
            getContainer={() => Utils.common.createModalContainer(id_div_nav)}
            visible={true}
            title={`编辑二级导航`}
            width='1000px'
            maskClosable={false}
            onCancel={this.close}
            onOk={this.doSave}>
            <div className='common-edit-page'>
                <div className='form'>

                    <div className="line">
                        <div className="p required">图标</div>

                        <div className='upload-img-preview' style={style}
                            onClick={() => Utils.common.showImgEditor(ratio, icon, this.syncImg)}>
                            {icon && <img src={icon} className="img" />}
                        </div>
                    </div>

                    <div className="line">
                        <div className='p required'>名称</div>
                        <Input style={{ width: '200px' }} maxLength={10} value={name}
                            placeholder='请输入名称'
                            onChange={(e) => this.setState({
                                nav: {
                                    ...nav,
                                    name: e.target.value
                                }
                            })} />
                    </div>

                    <div className="line">
                        <div className='p required'>类型</div>
                        <Select style={{ width: '200px' }} value={type} placeholder='请选择导航类型'
                            onChange={(value) => this.setState({
                                nav: {
                                    ...nav,
                                    type: value
                                }
                            })}>
                            <Option value='case'>案例</Option>
                            <Option value='atlas'>灵感</Option>
                            <Option value='product'>商品</Option>
                            <Option value='article'>文章</Option>
                        </Select>
                    </div>
                </div>
            </div>
        </Modal>

    }

}


export {
    BannerEdit,
    NavEdit,
}
