import React, {Component} from 'react';
import {Utils} from "../../common";
import {Drawer, Tabs, Descriptions} from "antd"

const {TabPane} = Tabs;

const id_div = 'sceneDrawer'

class SceneDrawer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            scene: this.props.scene || {}
        }
    }


    close = () => {
        Utils.common.closeModalContainer(id_div)
    }


    render() {
        let {scene = {}} = this.state
        let {products=[]} = scene;
        let {content, specs = [], params = [],name} =products[0];
        return (
            <Drawer
                title={name}
                placement="right"
                getContainer={() => Utils.common.createModalContainer(id_div)}
                width={700}
                className='product-drawer'
                closable={true}
                onClose={() => this.close()}
                visible={true}>
                <ul>
                    <li>
                        <div className='header'>产品名称:{name}</div>

                    </li>
                    <li>
                        <div className='header'>产品规格:</div>
                        <div className='content'>

                            <Tabs type="card">

                                {specs.map((spec, index) => {

                                    let {imgs = [], params = [], stock, price, sno} = spec;

                                    return <TabPane tab={`规格 ${index + 1}`} key={index.toString()}>

                                        <Descriptions title="图片">
                                            <Descriptions.Item label=''>
                                                <div className='imgs'>
                                                    {imgs.map((img, index2) => {
                                                        return <img style={{width:'100px',height:'100px'}} key={index2} src={img} onClick={() => {
                                                            Utils.common.showImgLightbox(imgs, index2);
                                                        }}/>
                                                    })}
                                                </div>
                                            </Descriptions.Item>

                                        </Descriptions>


                                        <Descriptions title="其他">
                                            <Descriptions.Item label="金额">{price}</Descriptions.Item>
                                        </Descriptions>

                                    </TabPane>
                                })}
                            </Tabs>
                        </div>
                    </li>
                    <li>
                    </li>
                    <li>

                    </li>
                </ul>
            </Drawer>

        );
    }
}

export default SceneDrawer;