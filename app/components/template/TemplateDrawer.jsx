import React from 'react';
import {Utils} from "../../common";
import { Drawer, Tabs, Descriptions, Divider ,Button,Icon} from "antd";
import { SpecsTabs,HeaderContent} from "../common/Comps";

const {TabPane} = Tabs;

const id_div = 'TemplateDrawer'

export default class TemplateDrawer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            index: this.props.index,
            productList: this.props.productList,
            visible: true
        }
    }


    close = () => {
        this.setState({visible: false});
        setTimeout(() => {
          Utils.common.closeModalContainer(id_div);
        }, 400)
    }


    render() {
        let {productList = [], index = 0, visible} = this.state;
    let {params = [], specs = [], title = '', content} = productList[index] || {};
    const length = productList.length
    return <Drawer
      getContainer={() => Utils.common.createModalContainer(id_div)}
      title={title}
      placement="right"
      onClose={this.close}
      visible={visible}
      width={700}>
      <ul>
        <HeaderContent header={'产品名称'} content={title}/>
        <Divider/>
        <HeaderContent header={'产品规格'} content={<SpecsTabs specs={specs}/>}/>
        <Divider/>
        <HeaderContent header={'产品参数'} content={params.map((item, idxParam) => {
          let {label, value} = item;
          return <span key={idxParam}>{label}：{value}</span>
        })}/>
        <Divider/>
        <HeaderContent header={'产品介绍'} content={<div dangerouslySetInnerHTML={{__html: content}}/>}/>
      </ul>
      <div className='btm-bottom'>
        <Button onClick={this.close}>关闭</Button>
        {index > 0 && <Button type="primary" onClick={() => {
          this.setState({index: index - 1})
        }}><Icon type="left"/>上一个</Button>}
        {index < length - 1 && <Button type="primary" onClick={() => {
          this.setState({index: index + 1})
        }}>下一个<Icon type="right"/></Button>}
      </div>
    </Drawer>
    }
}
