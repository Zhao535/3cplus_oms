import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.min.css'
import routers from './routes';
import {Provider} from 'mobx-react'
import {ConfigProvider} from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import Admin from 'components/admin/Admin';

if (module.hot)
    module.hot.accept();

const stores = {
    admin: new Admin()
};


ReactDOM.render(<ConfigProvider
    locale={zhCN}><Provider {...stores}>{routers}</Provider></ConfigProvider>, document.getElementById('root'));

