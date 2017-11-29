import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {
    BrowserRouter as Router,Route,Link
}from "react-router-dom";
class A extends Component{
    render(){
        return(
            <div>
                this is A
            </div>
        )
    }
}
class B extends Component{
    render(){
        return(
            <div>
                this is B
            </div>
        )
    }
}

class App extends Component {
    constructor(){
        super();
        this.state={
            list:[],
            hash:'#/'
        }
    }
    componentDidMount(){
        window.location.href="#/";
        /*fetch("/a").then(res=>res.json)
            .then(data=>this.setState({list:data}))*/
        window.onhashchange= ()=>{
            console.log(window.location.hash)
            this.setState({hash:window.location.hash})
        };
    }
    render() {
        let o;
        switch(this.state.hash){
            case '#/':
                o = (<div>
                    <a href="#/login">登录</a>
                    <a href="#/register">注册</a>
                </div>);break;
            case '#/login':
                o = <B/>;break;
            case '#/register':
                o = <A/>;break;
            default:
                o = (
                    <div>我们没有这个页面</div>
                )
        }
        return (
            <div className="App">
                {o}
            </div>
        );
    }
}

export default App;
