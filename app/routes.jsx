import React from 'react';
import { HashRouter, Redirect, Route, Switch } from 'react-router-dom';
import Page from './common/Page';
import Login from './components/login/Login';
import Dashboard from './components/dashboard/Dashboard';
import Index from './Index';

import Admins from './components/admin/Admins';
import AdminEdit from "./components/admin/AdminEdit";
import Roles from "./components/admin/Roles";
import RoleEdit from "./components/admin/RoleEdit";
import Merchants from "./components/merchant/Merchants";
import MerchantEdit from "./components/merchant/MerchantEdit";
import ProductBrands from "./components/brand/ProductBrands";
import ProductBrandsEdit from "./components/brand/ProductBrandsEdit";
import ProductCategories from "./components/category/ProductCategories";
import ProductTemplates from "./components/template/ProductTemplates";
import ProductTemplatesEdit from './components/template/ProductTemplatesEdit';
import UIs from "./components/ui/UIs";
import UIEdit from "./components/ui/UIEdit";
import Articles from "./components/article/articles";
import ArticleEdit from "./components/article/articleEdit";
import SceneShopping from "./components/shopping/SceneShopping";
import SceneShoppingEdit from "./components/shopping/SceneShoppingEdit";
import SceneType from "./components/shopping/SceneType";
import SceneTypeEdit from "./components/shopping/SceneTypeEdit";
import Coupons from "./components/coupon/Coupons";
import SecKills from "./components/secKill/SecKills";
import SecKillEdit from "./components/secKill/SecKillEdit";

const routes = (
    <HashRouter>
        <Switch>
            <Route path='/' children={() => (
                <Page>
                    <Switch>

                        <Redirect exact from='/' to='/app/dashboard/index' />

                        <Route path='/' exact component={Index} />

                        <Route path='/login' exact component={Login} />

                        <Route path='/app' children={() => (
                            <Index>

                                <Route path='/app/dashboard/index' component={Dashboard} />

                                <Route path={'/app/admin/admins'} component={Admins} />

                                <Route path={'/app/admin/admin-edit/:id'} component={AdminEdit} />

                                <Route path={'/app/admin/roles'} component={Roles}/>

                                <Route path={'/app/admin/role-edit/:id'} component={RoleEdit}/>

                                <Route path={'/app/merchant/merchants'} component={Merchants} />

                                <Route path={'/app/merchant/merchant-edit/:id'} component={MerchantEdit} />

                                <Route path={'/app/merchant/product-brands'} component={ProductBrands} />

                                <Route path={'/app/product/brand-edit/:id'} component={ProductBrandsEdit} />

                                <Route path={'/app/product/categories'} component={ProductCategories} />

                                <Route path={'/app/product/templates'} component={ProductTemplates} />

                                <Route path={'/app/product/templates-edit/:id'} component={ProductTemplatesEdit} />

                                <Route path={'/app/setting/uis/:type'} component={UIs} />

                                <Route path={'/app/setting/ui-edit/:type/:id'} component={UIEdit} />

                                <Route path={'/app/article/articles'} component={Articles} />

                                <Route path={'/app/article/article-edit/:id'} component={ArticleEdit} />

                                <Route path={'/app/marketing/sceneShopping'} component={SceneShopping}/>

                                <Route path={'/app/marketing/sceneShopping-edit/:id'} component={SceneShoppingEdit}/>

                                <Route path={'/app/scene/type'} component={SceneType}/>

                                <Route path={'/app/scene/type-edit/:id'} component={SceneTypeEdit}/>

                                <Route path={'/app/coupon/coupon'} component={Coupons}/>

                                <Route path={'/app/product/secKills'} component={SecKills}/>

                                <Route path={'/app/secKill/:id'} component={SecKillEdit}/>


                            </Index>
                        )} />
                    </Switch>
                </Page>
            )}>
            </Route>
        </Switch>
    </HashRouter>
);


export default routes;
