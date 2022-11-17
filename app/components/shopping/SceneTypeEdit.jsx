import React from 'react';
import {App, CTYPE, U, Utils} from "../../common";
import {Button, Card, Form, Input, Menu, message, Modal, Select, Switch, Table} from "antd";
import BreadcrumbCustom from "../../common/BreadcrumbCustom";
import {Link} from "react-router-dom";
import {PosterEdit} from "../../common/CommonEdit";
import "../../assets/css/common/common-edit.less";

const FormItem = Form.Item;
const id_div_sceneTypeEdit = 'sceneTypeEdit';

class SceneTypeEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sceneType: this.props.sceneType || {},
        }

    }

    coles = () => {
        Utils.common.closeModalContainer(id_div_sceneTypeEdit)
    }


    handleSubmit = () => {
        let {sceneType} = this.state;
        console.log(sceneType);
        if (U.str.isEmpty(sceneType.name)) {
            message.warning('请输入名称')
        } else if ((sceneType.name).length > 20) {
            message.warning('名称长度不能超过20')
        } else {
            App.api('adm/sceneType/save', {sceneType: JSON.stringify(sceneType)}).then(() => {
                message.success('保存成功');
                App.go(`/app/scene/type`);
                this.coles();
                this.props.loadData();
            })
        }

    }


    render() {
        let {sceneType} = this.state;
        let {products = [], icon, content, name, type, status, subHeading} = sceneType;
        return <Modal
            title="编辑分类"
            width={700}
            getContainer={() => Utils.common.createModalContainer('sceneTypeEdit')}
            visible={true}
            onOk={() => this.handleSubmit()}
            onCancel={() => this.coles()}
            okText="确认"
            cancelText="取消">
            <div className="common-edit-page">
                <FormItem
                    required={true}
                    {...CTYPE.formItemLayout} label='分类名称'>
                    <Input.TextArea rows={1} value={name} placeholder="输入分类名称" maxLength={100}
                                    onChange={(e) => {
                                        this.setState({
                                            sceneType: {
                                                ...sceneType,
                                                name: e.target.value
                                            }
                                        });
                                    }}/>
                </FormItem>

                <PosterEdit title='图片' type='sceneType' img={icon} required={true} syncPoster={(url) => {
                    sceneType.icon = url;
                    this.setState({
                        sceneType: sceneType
                    });
                }}/>
                <FormItem
                    required={false}
                    {...CTYPE.formItemLayout} label='分类副标题'>
                    <Input.TextArea rows={1} value={subHeading} placeholder="输入分类副标题" maxLength={100}
                                    onChange={(e) => {
                                        this.setState({
                                            sceneType: {
                                                ...sceneType,
                                                subHeading: e.target.value
                                            }
                                        });
                                    }}/>
                </FormItem>
            </div>

        </Modal>

    }
}

export default SceneTypeEdit;