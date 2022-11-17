import React from 'react';
import { App, U } from '../../common';
import { Avatar, message, Select, Spin } from 'antd';
import '../../assets/css/common/common-list.less';
import debounce from 'lodash/debounce';

const iconClose = require('../../assets/image/common/btn_close.png');

export default class SearchAdmin extends React.Component {

    constructor(props) {
        super(props);
        this.lastFetchId = 0;
        this.fetchAdmin = debounce(this.fetchAdmin, 800);
        this.state = {
            nameOrMobile: '',

            fetching: false,
            list: [],
            admin: {},
            adminId: 0
        };
    }

    fetchAdmin = (nameOrMobile) => {

        if (U.str.isEmail(nameOrMobile)) {
            message.info('请输入搜索内容');
            return;
        }

        this.lastFetchId += 1;
        const fetchId = this.lastFetchId;
        this.setState({
            list: [],
            fetching: true
        });

        App.api('adm/admin/admins', {
            adminQo: JSON.stringify({
                nameOrMobile
            })
        }).then((list) => {
            if (fetchId !== this.lastFetchId) {
                return;
            }
            this.setState({ list, fetching: false });
        });
    };

    render() {
        let { list = [], fetching, adminId, admin = {} } = this.state;

        let label = '请输入手机号码或姓名';
        if (adminId) {
            label = admin.name + ' ' + admin.mobile;
        }

        return <Select
            suffixIcon={adminId ? <img
                onClick={() => {
                    this.setState({
                        adminId: 0,
                        list: []
                    });
                    this.props.syncAdmin({ id: 0 });
                }}
                src={iconClose}
                style={{
                    width: '12px',
                    heigt: '12px'
                }}
            /> : <div />}
            filterOption={false}
            placeholder='输入姓名或手机号查找学员'
            notFoundContent={fetching ? <Spin size="small" /> : '暂无数据'}
            value={label}
            showSearch={true}
            onSearch={this.fetchAdmin}
            style={{
                width: '300px',
                marginRight: '20px'
            }}
            onChange={(adminId) => {
                adminId = parseInt(adminId);
                let admin = list.find(item => item.id === adminId);
                if (admin) {
                    this.setState({ admin, adminId, fetching: false });
                    this.props.syncAdmin(admin);
                }

            }}>
            {list.length > 0 && list.map((item) => {
                let { id, avatar, img, name, mobile, identity } = item;
                return <Select.Option key={id}>
                    <div className="search-admin-ll">
                        <Avatar size="large" className='avatar' icon="user" src={avatar || img} />
                        <div className="name-ll">
                            <div> {name} {mobile}</div>
                            <div>{identity}</div>
                        </div>
                    </div>
                </Select.Option>;
            })}
        </Select>;
    }
}


