import React from "react";
import {
  InputNumber,
  Select,
  Input,
  Form,
  Tree,
  Card,
  Modal,
  message,
  TreeSelect,
  Button,
  Icon,
  Drawer,
  Tabs
} from "antd";
import PropTypes from 'prop-types';
import '../../assets/css/comps.scss';
import { App, U, Utils,CTYPE } from "../../common";


const {SHOW_PARENT} = TreeSelect;
const InputGroup = Input.Group
const {Option} = Select;
const FormItem = Form.Item;
const { TabPane } = Tabs;

class HeaderContent extends React.Component {
    static propTypes = {
      header: PropTypes.string.isRequired,
      content: PropTypes.any.isRequired
    }
  
    render () {
      let {header, content} = this.props;
      return <li className='header-content'>
        <div className='header'>{header}</div>
        <div className='content'>{content}</div>
      </li>
    }
}
class SpecsTabs extends React.Component {

    constructor (props) {
      super(props);
      this.state = {
        activeKey: '0',
      }
    }
  
    onChange = (key) => {
      this.setState({activeKey: key})
    }
  
    static propTypes = {
      specs: PropTypes.array.isRequired
    }
  
    render () {
      let {activeKey} = this.state;
      let {specs = []} = this.props;
      return <Tabs
        type="card"
        onChange={this.onChange}
        activeKey={activeKey}>
        {specs.map((item, idxSpecs) => {
          let {price, sno, imgs = [], params = []} = item;
          return <TabPane tab={`规格${idxSpecs + 1}`} key={idxSpecs}>
            <ul>
              <HeaderContent header={'图片'} content={
                imgs.map((img, idxImg) => {
                  return <img key={idxImg} src={img}/>
                })
              }/>
  
              <HeaderContent header={'属性'} content={params.map((item, idxParam) => {
                let {label, value} = item;
                return <span className='specs-span' key={idxParam}>{label}：{value}</span>
              })}/>
  
              <HeaderContent header={'其他'} content={<div className='specs-price'>
                <span>金额：{U.price.cent2yuan(price)}</span>
                <span>库存：</span>
                <span>编号：{sno}</span>
              </div>}/>
  
            </ul>
          </TabPane>
        })}
      </Tabs>
    }
  }


export {
    HeaderContent,SpecsTabs
  }