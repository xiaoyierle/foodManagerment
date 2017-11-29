import React, { Component } from 'react';
import './App.css';
import {
    BrowserRouter as Router,Route,Redirect
}from "react-router-dom";
import Login from "./components/login/login";
import Register from "./components/register/register";
import UserInfo from "./components/user/user_info";
import PasswordChange from "./components/user/password_change";

import StoreAdd from "./components/store/add";
import StoreInfo from "./components/store/info";

import CateAdd from "./components/goods/add_cate";
import GoodsAdd from "./components/goods/add_goods";
import Cate from "./components/goods/cate";
import Goods from "./components/goods/goods";
class App extends Component {
    constructor(){
        super();
        this.state={
            auth:true,
        }
    }
    componentWillMount(){
        fetch('/get_auth',{
            credentials:'include'
        }).then(res=>res.json())
            .then(r=>{
                this.setState({auth:r})})
    }

  render() {
    return (
        <Router>
            <div>
                <Route path="/admin/login" component={Login}/>
                <Route path="/admin/register" component={Register}/>
                <Route path="/admin/" render={()=>(
                    <div>
                        {this.state.auth?(null):(<Redirect to="/admin/login"/>)}
                    </div>
                )}/>
                <Route path="/admin/user/info" component={UserInfo}/>
                <Route path="/admin/user/password_change" component={PasswordChange}/>
                <Route path="/admin/store/add" component={StoreAdd}/>
                <Route path="/admin/store/info" component={StoreInfo}/>
                <Route path="/admin/goods/cate_add" component={CateAdd}/>
                <Route path="/admin/goods/goods_add" component={GoodsAdd}/>
                <Route path="/admin/goods/cate_manager" component={Cate}/>
                <Route path="/admin/goods/goods_manager" component={Goods}/>
            </div>
        </Router>
    );
  }
}

export default App;
