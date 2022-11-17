import React from 'react';
import BreadcrumbCustom from "../../common/BreadcrumbCustom";
import {App, CTYPE, U, Utils} from "../../common";
import {Avatar, Button, Card, Divider, Icon, Modal, notification, Pagination, Table, Tag} from "antd";
import Search from "antd/es/input/Search";
import ProductUtils from "../product/ProductUtils";
import ShoppingUtils from "./ShoppingUtils";


class SceneShopping extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            scenes: [],
            pagination: {
                current: 1,
                pageSize: 10,
                total: 0,
            },
            qo: {},
            sceneTypes: [],
            loading: false,
        };

    }

    componentDidMount() {
        this.loadData();
        ShoppingUtils.loadSceneType(this);
    }


    loadData = () => {
        this.setState({loading: true});
        let {qo, pagination = {}} = this.state;
        let {current, pageSize} = pagination;
        qo.pageNumber = current;
        qo.pageSize = pageSize;
        console.log(qo)
        App.api(`adm/sceneShopping/items`, {qo: JSON.stringify(qo)}).then((res) => {
            let pagination = {} = Utils.pager.convert2Pagination(res);
            console.log(pagination)
            this.setState({scenes: res.content, pagination: pagination, loading: false})
        })
    }

    edit = (scene) => {
        App.go(`/app/marketing/sceneShopping-edit/${scene.id}`)
    }

    changeStatus = (scene) => {
        Modal.confirm({
            title: (scene.status === 1 ? '确认封禁' : '确认启用'),
            onOk: () => {
                App.api(`adm/sceneShopping/changeStatus`, {id: scene.id}).then(() => {
                    notification.open({
                        message: '提示:',
                        description: scene.status === 1 ? '停用成功' : '启用成功'
                    })
                    this.loadData({})
                })
            }

        })
    }


    render() {
        let {scenes = [], pagination = {}, sceneTypes = [],loading} = this.state
        let {current, total} = pagination;
        return <div>
            <BreadcrumbCustom first={CTYPE.link.marketing.txt}/>
            <Card>
                <div>
                    <Button onClick={() => this.edit({id: 0})} type={"primary"}><Icon
                        type={'plus-circle'}/>添加场景</Button>
                    <div className="clearfix-h20"/>
                    <Table columns={[
                        ...ShoppingUtils.basicColumns(sceneTypes),
                        {
                            title: '操作',
                            className: 'txt-center',
                            render: (obj, scene, index) => {
                                return <React.Fragment>
                                    <a onClick={() => this.edit(scene)}>编辑</a>
                                    <Divider type="vertical"/>
                                    <a onClick={() => this.changeStatus(scene)}>{scene.status === 1 ? '停用' : '启用'}</a>
                                </React.Fragment>
                            }
                        }
                    ]} rowKey={(item) => item.id}
                           dataSource={scenes}
                           pagination={false}
                           loading={loading}
                    />
                </div>
                <Pagination style={{float: 'right'}} total={total} showSizeChanger
                            onShowSizeChange={(current, size) => {
                                this.setState({
                                    pagination: {
                                        ...pagination,
                                        current: current,
                                        pageSize: size
                                    }
                                })
                            }} current={current}
                            onChange={(current) => {
                                this.setState({
                                    pagination: {
                                        ...pagination,
                                        current: current
                                    }
                                })
                            }}/>

            </Card>


        </div>;
    }
}

export default SceneShopping;