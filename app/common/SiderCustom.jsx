import React, {Component} from 'react';
import {Icon, Layout, Menu} from 'antd';
import {Link} from 'react-router-dom';
import {Utils, CTYPE} from "./index";

const {Sider} = Layout;
const SubMenu = Menu.SubMenu;

const panes = [{title: '规格1', key: '',}]

class SiderCustom extends Component {
    state = {
        collapsed: false,
        mode: 'inline',
        openKey: '',
        selectedKey: '',
        firstHide: false
    };

    componentDidMount() {
        this.setMenuOpen();
    }

    componentWillReceiveProps(nextProps) {
        this.onCollapse(nextProps.collapsed);
    }

    getPostion = (str, cha, num) => {
        let x = str.indexOf(cha);
        for (let i = 0; i < num; i++) {
            x = str.indexOf(cha, x + 1);
        }
        return x;
    };

    setMenuOpen = () => {

        let path = window.location.hash.split('#')[1];

        //兼容三层目录,三级页不修改，刷新时定位到一级
        let key = path.substr(0, path.lastIndexOf('/'));
        if (key.split('/').length > 3) {
            if (this.state.openKey)
                return;
            key = key.substring(0, this.getPostion(key, '/', 2));
        }

        this.setState({
            openKey: key,
            selectedKey: path
        });
    };

    onCollapse = (collapsed) => {
        this.setState({
            collapsed,
            firstHide: collapsed,
            mode: collapsed ? 'vertical' : 'inline'
        });
    };

    menuClick = e => {
        this.setState({
            selectedKey: e.key
        });

    };
    openMenu = v => {
        this.setState({
            openKey: v[v.length - 1],
            firstHide: false
        });
    };

    render() {

        let {
            ROLE_LIST,
            ROLE_EDIT,

            ADMIN_LIST,

            ARTICLE_ALL,
            ARTICLE_LIST,
            ARTICLE_EDIT,

            BANNER_EDIT

        } = Utils.adminPermissions;

        let withAdmin = ADMIN_LIST || ROLE_LIST || ROLE_EDIT;

        let withContent = ARTICLE_ALL || ARTICLE_EDIT || ARTICLE_LIST || BANNER_EDIT;

        let {firstHide, selectedKey, openKey} = this.state;

        return (
            <Sider
                trigger={null}
                breakpoint="lg"
                collapsed={this.props.collapsed}
                style={{overflowY: 'auto'}}>
                <div className={this.props.collapsed ? 'logo logo-s' : 'logo'}/>
                <Menu
                    onClick={this.menuClick}
                    theme="dark"
                    mode="inline"
                    selectedKeys={[selectedKey]}
                    openKeys={firstHide ? null : [openKey]}
                    onOpenChange={this.openMenu}>
                    <Menu.Item key="/app/dashboard/index">
                        <Link to={'/app/dashboard/index'}><Icon type="home"/><span
                            className="nav-text">首页</span></Link>
                    </Menu.Item>


                    <SubMenu key='/app/merchant'
                             title={<span><Icon type="shop"/><span
                                 className="nav-text">商户管理</span></span>}>
                        <Menu.Item key={CTYPE.link.merchant.key}><Link
                            to={CTYPE.link.merchant.path}>{CTYPE.link.merchant.txt}</Link></Menu.Item>
                    </SubMenu>

                    <SubMenu key='/app/merchant-categories'
                             title={<span><Icon type="appstore"/><span
                                 className="nav-text">产品管理</span></span>}>
                        <Menu.Item key={CTYPE.link.product_brands.key}><Link
                            to={CTYPE.link.product_brands.path}>{CTYPE.link.product_brands.txt}</Link></Menu.Item>
                        <Menu.Item key={CTYPE.link.product_templates.key}><Link
                            to={CTYPE.link.product_templates.path}>{CTYPE.link.product_templates.txt}</Link></Menu.Item>
                        <Menu.Item key={CTYPE.link.product_categories.key}><Link
                            to={CTYPE.link.product_categories.path}>{CTYPE.link.product_categories.txt}</Link></Menu.Item>

                    </SubMenu>

                    <SubMenu key='/app/setting'
                             title={<span><Icon type="setting"/><span
                                 className="nav-text">基础配置</span></span>}>
                        <Menu.Item key={CTYPE.link.setting_ui.key}><Link
                            to={CTYPE.link.setting_ui.path}>{CTYPE.link.setting_ui.txt}</Link></Menu.Item>
                    </SubMenu>

                    <SubMenu key='/app/content'
                             title={<span><Icon type="file"/><span
                                 className="nav-text">内容配置</span></span>}>
                        <Menu.Item key={CTYPE.link.articles.key}><Link
                            to={CTYPE.link.articles.path}>{CTYPE.link.articles.txt}</Link></Menu.Item>
                    </SubMenu>

                    <SubMenu key='/app/marketing'
                             title={<span><Icon type="shopping"/><span
                                 className="nav-text">营销</span></span>}>
                        <Menu.Item key={CTYPE.link.marketing.key}><Link
                            to={CTYPE.link.marketing.path}>{CTYPE.link.marketing.txt}</Link></Menu.Item>

                        <Menu.Item key={CTYPE.link.scene.key}><Link
                            to={CTYPE.link.scene.path}>{CTYPE.link.scene.txt}</Link></Menu.Item>
                        <Menu.Item key={CTYPE.link.coupon.key}><Link
                            to={CTYPE.link.coupon.path}>{CTYPE.link.coupon.txt}</Link></Menu.Item>
                        <Menu.Item key={CTYPE.link.secKills.key}><Link
                            to={CTYPE.link.secKills.path}/>{CTYPE.link.secKills.txt}</Menu.Item>
                    </SubMenu>

                    {withAdmin && <SubMenu key='/app/admin'
                                           title={<span><Icon type="usergroup-add"/><span
                                               className="nav-text">管理&权限</span></span>}>
                        {ADMIN_LIST && <Menu.Item key={CTYPE.link.admin_admins.key}><Link
                            to={CTYPE.link.admin_admins.path}>{CTYPE.link.admin_admins.txt}</Link></Menu.Item>}
                        {ROLE_LIST && <Menu.Item key={CTYPE.link.admin_roles.key}><Link
                            to={CTYPE.link.admin_roles.path}>{CTYPE.link.admin_roles.txt}</Link></Menu.Item>}
                    </SubMenu>}


                </Menu>
            </Sider>
        );
    }
}

export default SiderCustom;
