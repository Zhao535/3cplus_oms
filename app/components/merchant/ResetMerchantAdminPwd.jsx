import React from "react";
import { CTYPE, Utils, App, U } from "../../common";
import { Input, Modal, Form, message } from "antd";


const FormItem = Form.Item;

const id_div = 'reset_merchant_admin_pwd';
export default class Renew extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

      mobile: this.props.mobile,
    }

  }


  submit = () => {
    let { mobile, newPassword } = this.state;
    if (U.str.isEmpty(newPassword) || newPassword.length < 6) {
      message.warning("新密码长度不得小于六位数")
      return;
    }
    Modal.confirm({
      title: '确认重置管理员密码吗？',
      onOk: () => {
        App.api(`/adm/merchantAdmin/reset_password`, { mobile, newPassword }).then(() => {
          message.success("密码修改成功")
          this.close()
          this.props.reloadData()
        })
      },
      onCancel() {
      },
    })

  }

  close = () => {
    Utils.common.closeModalContainer(id_div);
  };


  render() {
    let { newPassword, password } = this.state;
    return <Modal
      title="重置密码"
      visible={true}
      getContainer={() => Utils.common.createModalContainer(id_div)}
      onCancel={this.close}
      onOk={this.submit}
      width={'800px'}
      okText="确认"
      cancelText="取消"
    >
      <FormItem
        {...CTYPE.formItemLayout}
        label="新密码" required={true}>
        <Input type="password" placeholder={"请输入新密码"} value={newPassword} onChange
          ={(e) => {
            this.setState({ newPassword: e.target.value })
          }} />
      </FormItem>

      <FormItem
        {...CTYPE.formItemLayout}
        label="请再次确认密码" required={true}>
        <Input type="password" placeholder={"确认密码"} value={password} onChange
          ={(e) => {
            this.setState({ password: e.target.value })
          }} />
      </FormItem>

    </Modal>

  }
}
