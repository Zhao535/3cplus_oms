import React from 'react';
import {Button, Card, Cascader, Form, Input, message, Popover, Tabs} from 'antd';
import App from '../../common/App.jsx';
import {CTYPE, U} from "../../common";
import BreadcrumbCustom from '../../common/BreadcrumbCustom';
import {Link} from 'react-router-dom';
import '../../assets/css/common/common-edit.less';
import {PosterEdit} from "../../common/CommonEdit";
import {CommonPeriodSelector} from "../common/CommonComponents";
import Utils from "../../common/Utils";
import OSSWrap from "../../common/OSSWrap";

const FormItem = Form.Item;
const {TabPane} = Tabs;

const oemLogos = [{
    key: 'logoMobile',
    label: '手机登录logo',
    spec: '建议240*200',
    width: 120,
    height: 100,
    url: 'https://fs.huituozx.com/assets/image/oem/logo_mob.png'
}, {
    key: 'logoPC',
    label: 'PClogo',
    spec: '建议700*180',
    width: 350,
    height: 90,
    url: 'https://fs.huituozx.com/assets/image/oem/logo_pc.png'
}];

export default class SchoolEdit extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            id: parseInt(this.props.match.params.id),

            school: {},
            schoolAdmin: {},
            regions: [],
            loading: false,
            oemIndex: 0

        };
    }

    componentDidMount() {
        this.loadData();
        Utils.addr.loadRegion(this);
    }

    loadData = () => {
        let {id} = this.state;
        if (id !== 0) {
            App.api('oms/school/item', {id}).then((school) => {
                this.setState({school});
            });
        }
    };

    handleSubmit = () => {

        let {id, school = {}, schoolAdmin = {}} = this.state;

        let {name, logo = [], duration, location = {}} = school;
        let {mobile, password} = schoolAdmin;
        let {code, detail} = location;

        let create = id === 0;

        if (U.str.isEmpty(name)) {
            message.warn('请填写商户名称');
            return;
        }
        if (U.str.isEmpty(logo)) {
            message.warn('请上传图片');
            return;
        }
        if (U.str.isEmpty(school.mobile)) {
            message.warn('请输入学校联系方式');
            return;
        }
        if (U.str.isEmpty(code)) {
            message.warn('请选择地区');
            return;
        }
        if (!U.str.isChinaMobile(school.mobile)) {
            message.warn('请填写正确的手机号');
            return;
        }
        if (U.str.isEmpty(detail)) {
            message.warn('请输入详细地址');
            return;
        }

        if (create) {

            if (U.str.isEmpty(duration)) {
                school.duration = '1Y';
            }

            if (U.str.isEmpty(schoolAdmin.name)) {
                message.warn('请输入管理员姓名');
                return;
            }
            if (!U.str.isChinaMobile(mobile)) {
                message.warn('请填写正确的手机号');
                return;
            }
            if (!U.str.isPassWord(password)) {
                message.warn('请输入管理员密码,以字母开头，6到18位小写字母、数字、下划线');
                return;
            }
        }
        this.setState({loading: true});
        App.api(create ? 'oms/school/create' : 'oms/school/update', {
            school: JSON.stringify(school),
            schoolAdmin: JSON.stringify(schoolAdmin)
        }).then((res) => {
            message.success('已保存');
            window.history.back();
        }, () => this.setState({loading: false}));
    };

    handleNewImage = (e) => {

        let {uploading} = this.state;
        if (uploading) {
            message.loading('上传中');
            return;
        }
        let file = e.target.files[0];
        if (!file || file.type.indexOf('png') < 0) {
            message.error('文件类型不正确,请选择png格式图片');
            this.setState({
                uploading: false,
            });
            return;
        }
        this.setState({uploading: true});
        OSSWrap.upload(file).then((result) => {
            this.setState({uploading: false});
            let {school = {}, oemIndex} = this.state;
            let {oem = {}} = school;
            oem[oemLogos[oemIndex].key] = result.url;
            school.oem = oem;
            console.log(school);
            this.setState({school});
        }).catch((err) => {
            message.error(err);
        });
    };

    render() {

        let {id, school = {}, schoolAdmin = {}, regions = [], oemIndex} = this.state;

        let {name, logo, duration = '1Y', location = {}, oem = {}} = school;

        let {code, detail} = location;

        let codes = Utils.addr.getCodes(code);

        let {mobile, password} = schoolAdmin;

        let create = id === 0;

        return <div className="common-edit-page">

            <BreadcrumbCustom
                first={<Link to={CTYPE.link.school_schools.path}>{CTYPE.link.school_schools.txt}</Link>}
                second={id === 0 ? "创建学校" : "编辑学校"}/>


            <Card extra={<Button type="primary" icon="save" loading={this.state.loading} onClick={() => {
                this.handleSubmit();
            }}>保存</Button>}>

                <FormItem
                    required={true}
                    {...CTYPE.formItemLayout} label='学校名称'>
                    <Input placeholder="输入学校名称"
                           value={name} maxLength={20}
                           onChange={(e) => {
                               this.setState({
                                   school: {
                                       ...school,
                                       name: e.target.value
                                   }
                               });
                           }}/>
                </FormItem>

                <PosterEdit title='logo' type='s' img={logo} required={true} syncPoster={(url) => {
                    school.logo = url;
                    this.setState({
                        school
                    });
                }}/>

                <FormItem
                    required={true}
                    {...CTYPE.formItemLayout}
                    label="负责人姓名">
                    <Input value={school.leader} maxLength={10} style={{width: 200}} onChange={(e) => {
                        this.setState({
                            school: {
                                ...school,
                                leader: e.target.value
                            }
                        });
                    }}/>
                </FormItem>

                <FormItem
                    required={true}
                    {...CTYPE.formItemLayout}
                    label="负责人手机号">
                    <Input value={school.mobile} maxLength={11} style={{width: 200}} onChange={(e) => {
                        this.setState({
                            school: {
                                ...school,
                                mobile: e.target.value
                            }
                        });
                    }}/>
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
                                      school: {...school, location}
                                  });
                              }}/>
                </FormItem>


                <FormItem required={true}
                          {...CTYPE.formItemLayout}
                          label='详细地址'>
                    <Input value={detail} maxLength={40} placeholder="最多可输入40字" onChange={(e) => {
                        location.detail = e.target.value;
                        this.setState({
                            school: {
                                ...school,
                                location
                            }
                        });
                    }}/>

                </FormItem>

                {create && <React.Fragment>

                    <FormItem
                        required={true}
                        {...CTYPE.formItemLayout}
                        label='套餐时长'>
                        <CommonPeriodSelector periods={CTYPE.expirePeriods} period={duration} withForever={false}
                                              syncPeriod={(val) => {
                                                  this.setState({
                                                      school: {
                                                          ...school,
                                                          duration: val
                                                      }
                                                  });
                                              }}/>
                    </FormItem>

                    <FormItem
                        required={true}
                        {...CTYPE.formItemLayout}
                        label="管理员姓名">
                        <Input value={schoolAdmin.name} style={{width: 200}} onChange={(e) => {
                            this.setState({
                                schoolAdmin: {
                                    ...schoolAdmin,
                                    name: e.target.value
                                }
                            });
                        }}/>
                    </FormItem>
                    <FormItem
                        required={true}
                        {...CTYPE.formItemLayout}
                        label="管理员手机号">
                        <Input value={mobile} style={{width: 200}} maxLength={11} onChange={(e) => {
                            this.setState({
                                schoolAdmin: {
                                    ...schoolAdmin,
                                    mobile: e.target.value
                                }
                            });
                        }}/>
                    </FormItem>
                    <FormItem
                        required={true}
                        {...CTYPE.formItemLayout}
                        label="登录密码">
                        <Input value={password} style={{width: 200}} onChange={(e) => {
                            this.setState({
                                schoolAdmin: {
                                    ...schoolAdmin,
                                    password: e.target.value
                                }
                            });
                        }}/>
                    </FormItem>
                </React.Fragment>}

                <FormItem {...CTYPE.formItemLayout}
                          label='OEM'>
                    <Tabs activeKey={oemIndex.toString()} onChange={(index) => {
                        this.setState({oemIndex: parseInt(index)});
                    }}>
                        {oemLogos.map((oem, index) => {
                            let {label} = oem;
                            return <TabPane tab={label} key={index.toString()}/>;
                        })}
                    </Tabs>

                    <div className=''>
                        <div className='upload-logo'
                             style={{width: oemLogos[oemIndex].width, height: oemLogos[oemIndex].height}}>
                            <img src={oem[oemLogos[oemIndex].key]}
                                 style={{width: oemLogos[oemIndex].width, height: oemLogos[oemIndex].height}}/>
                            <input className="file"
                                   type='file' onChange={this.handleNewImage}/>
                        </div>
                        {oemLogos[oemIndex].spec}
                        &nbsp;&nbsp;&nbsp;
                        <Popover content={<div style={{background: 'rgba(0,0,0,.3)'}}>
                            <img src={oemLogos[oemIndex].url} style={{maxWidth: '300px'}}/>
                        </div>}
                                 title={`示例图片-${oemLogos[oemIndex].label}`}>
                            <a>查看示例</a>
                        </Popover>
                    </div>


                </FormItem>

            </Card>

        </div>;
    }
}
