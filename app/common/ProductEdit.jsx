import React from "react";
import {Utils,U,CTYPE} from "./index";
import { Icon, message,Button,Card,} from 'antd';
import BreadcrumbCustom from "./BreadcrumbCustom";
import { Link } from 'react-router-dom';

export  class ProductEdit extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

            product: {},

        }
    }



    doImgOpt = (index, opt, img) => {
        let { product = {} } = this.state;
        let { imgs = [] } = product;



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
            product: {
                ...product,
                imgs
            }
        });
    };



    render() {

        let { product = {} } = this.state;
        let {
            imgs = []
        } = product;


        return <div className="common-edit-page">


            <Card extra={<Button type="primary" icon="save" onClick={() => {
                this.handleSubmit()
            }}>保存</Button>}>
                                <Card title={<span className='required'>图片组</span>} size='small'>
                                    <div className='imgs-opt-block'>

                                        {imgs.map((img, index) => {
                                            return <Card key={index} className='img-card-edit'
                                                         cover={<img src={img}/>}
                                                         actions={[
                                                             <Icon type="left" key="left"
                                                                   onClick={() => this.doImgOpt(index,  'left')}/>,
                                                             <Icon type="delete" key="delete"
                                                                   onClick={() => this.doImgOpt(index,  'remove')}/>,
                                                             <Icon type="right" key="right"
                                                                   onClick={() => this.doImgOpt(index,  'right')}/>
                                                         ]}
                                            />
                                        })}

                                        {imgs.length < 6 &&
                                        <Card cover={<div className='up-icon'/>}
                                              className={'img-card-add'} onClick={() => {
                                            Utils.common.showImgEditor(CTYPE.imgeditorscale.square, null, (img) => this.syncPoster(img, index));
                                        }}>
                                        </Card>}

                                    </div>
                                </Card>
            </Card>

        </div>
    }
}