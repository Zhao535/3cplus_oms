import React from 'react'
import App from '../../common/App.jsx'
import Utils from '../../common/Utils.jsx'
import {Form, Icon, Input, message, Modal, notification} from 'antd';

import CTYPE from "../../common/CTYPE";
import '../../assets/css/common/common-list.less'

const FormItem = Form.Item;
const id_div = 'div-dialog-mod-pwd';

class ModAdminPwd extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            flag: true
        };
    }

    updatePassword = () => {
        this.props.form.validateFields((err, formitem) => {
            if (err) {
                Object.keys(err).forEach(key => {
                    message.warning(err[key].errors[0].message);
                });
            } else {
                let {password, repeatPassword} = formitem;
                if (password !== repeatPassword) {
                    message.warn("请检查输入的新密码是否一致");
                    return;
                }
                this.setState({loading: true});
                App.api('adm/admin/change_password', {
                    repeatPassword: formitem.repeatPassword,
                    oldPassword: formitem.oldPassword
                }).then(res => {
                    this.setState({loading: false});
                    this.close();
                    notification.success({message: "修改密码", description: "操作成功,请重新登录"});
                    App.logout();
                    App.go("/login");
                }, () => this.setState({loading: false}))
            }
        });
    };

    close = () => {
        Utils.common.closeModalContainer(id_div)
    };

    render() {

        let {flag} = this.state;

        const {getFieldDecorator} = this.props.form;

        return <Modal title={'修改密码'}
                      getContainer={() => Utils.common.createModalContainer(id_div)}
                      visible={true}
                      width={'600px'}
                      confirmLoading={this.state.loading}
                      onOk={this.updatePassword}
                      onCancel={this.close}>
            <Form>

                <FormItem
                    {...CTYPE.dialogItemLayout}
                    label={(
                        <span>当前密码</span>
                    )}
                    hasFeedback>
                    {getFieldDecorator('oldPassword', {
                        rules: [{
                            type: 'string',
                            required: true,
                            message: '请输入当前密码',
                            whitespace: true,
                        }],
                    })(
                        <Input type={flag ? 'password' : 'txt'} addonBefore={<span><Icon onClick={() => {
                            this.setState({
                                flag: !flag,
                            })
                        }} type={flag ? "lock" : "unlock"}/></span>}/>
                    )}
                </FormItem>

                <FormItem
                    {...CTYPE.dialogItemLayout}
                    label={(
                        <span>新密码</span>
                    )}
                    hasFeedback>
                    {getFieldDecorator('password', {
                        rules: [{
                            type: 'string',
                            message: '长度6-18，只能包含小写英文字母、数字、下划线，且以字母开头',
                            pattern: /^[a-zA-Z]\w{5,17}$/,
                            required: true,
                            whitespace: true,
                        }],
                    })(
                        <Input type={flag ? 'password' : 'txt'} addonBefore={<span><Icon onClick={() => {
                            this.setState({
                                flag: !flag,
                            })
                        }} type={flag ? "lock" : "unlock"}/></span>}/>
                    )}
                </FormItem>

                <FormItem
                    {...CTYPE.dialogItemLayout}
                    label={(
                        <span>确认新密码</span>
                    )}
                    hasFeedback>
                    {getFieldDecorator('repeatPassword', {
                        rules: [{
                            type: 'string',
                            message: '长度6-18，只能包含小写英文字母、数字、下划线，且以字母开头',
                            pattern: /^[a-zA-Z]\w{5,17}$/,
                            required: true,
                            whitespace: true,
                        }],
                    })(
                        <Input type={flag ? 'password' : 'txt'} addonBefore={<span><Icon onClick={() => {
                            this.setState({
                                flag: !flag,
                            })
                        }} type={flag ? "lock" : "unlock"}/></span>}/>
                    )}
                </FormItem>

            </Form>
        </Modal>
    }
}

export default Form.create()(ModAdminPwd);
