import React from "react";
import { CommonPeriodSelector } from "../../components/common/CommonComponents";
import { CTYPE, Utils, App } from "../../common";
import { Input, Modal, Form, message } from "antd";


const FormItem = Form.Item;

const id_div = 'renew';
export default class Renew extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      duration: '1D',
      id: this.props.id,
    }

  }


  submit = () => {
    let { id, duration } = this.state;
    Modal.confirm({
      title: '确认续费吗？',
      onOk: () => {
        App.api(`adm/merchant/renewal`, { id, duration }).then(() => {
          message.success("续费成功")
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
    let { duration } = this.state;
    return <Modal
      title="账户续费"
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
        label="续费时长" required={true}>
        <CommonPeriodSelector periods={CTYPE.expirePeriods} period={duration} withForever={false}
          syncPeriod={(val) => {
            this.setState({ duration: val })
          }} />
      </FormItem>

    </Modal>

  }
}
