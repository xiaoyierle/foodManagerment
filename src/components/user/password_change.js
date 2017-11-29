import React from 'react';
import Home from '../home/home';
import { Form, Icon, Input, Button,Card,message,Breadcrumb} from 'antd';
import {Link} from "react-router-dom";
message.config({
    duration:2
})
// message.success();
// message.error();
// message.warn();
// message.info();
// this.props.form.resetFields();
// this.props.form.validateFields();
// this.props.form.getFieldDecorator();
// labelCol={{span:4}}
// wrapperCol={{span:20}}
// wrapperCol={{offset:4}}
const FormItem = Form.Item;
class ChangePasswordBox extends React.Component{
    constructor(){
        super();
        this.state={
            pass:''
        }
        this.validPass=this.validPass.bind(this);
        this.validPassAgain=this.validPassAgain.bind(this);
    }
    submit(){
        this.props.form.validateFields((err,value)=>{
            if(!err){
                fetch('/change_password',{
                    credentials:'include',
                    method:'post',
                    headers:{
                        'Content-Type':'application/json'
                    },
                    body:JSON.stringify(value)
                }).then(res=>res.json())
                    .then(data=>{
                        if(data === 'ok'){
                            message.success('密码修改成功');
                            this.props.form.resetFields();
                        }else{
                            alert(data);
                        }
                    })
            }
        })
    }
    validPass(rule,value,callback){
        this.setState({pass:value});
        if(value.length<8){
            callback('密码长度需要大于8')
        }else{
            callback();
        }
    }
    validPassAgain(rule,value,callback){
        if(value!== this.state.pass){
            callback('两次密码不一致');
        }else{
            callback();
        }
    }
    render(){
        let style = {
            labelCol:{span:2,offset:6},
            wrapperCol:{span:10}
        }
        const {getFieldDecorator} = this.props.form;
        return(
            <Form onSubmit={(e)=>{e.preventDefault();this.submit()}}>
                <FormItem label="旧密码" {...style}>
                    {
                        getFieldDecorator('oldpassword',{
                            rules:[{required: true, message: '请输入旧密码！！'},
                                {validator:this.validPass}]
                        })(
                            <Input type="password" prefix={<Icon type="lock"/>}/>
                        )
                    }
                </FormItem>
                <FormItem label="新密码" {...style}>
                    {
                        getFieldDecorator('password',{
                            rules:[{required: true, message: '请输入新密码！！'},
                                {validator:this.validPass}]
                        })(
                            <Input type="password" prefix={<Icon type="lock"/>}/>
                        )
                    }
                </FormItem>
                <FormItem label="重复密码" {...style}>
                    {
                        getFieldDecorator('password_check',{
                            rules:[{required: true, message: '请再次输入新密码！！'},
                                {validator:this.validPassAgain}]
                        })(
                            <Input type="password" prefix={<Icon type="lock"/>}/>
                        )
                    }
                </FormItem>
                <FormItem wrapperCol={{offset:8}}>
                    <Button type="primary" htmlType="submit">确认修改</Button>
                </FormItem>
            </Form>
        )
    }
}
const ChangePassword = Form.create()(ChangePasswordBox)
class PasswordChange extends React.Component{
    render(){

        return(
            <Home selected="password_change">
                <Card title={
                    <Breadcrumb>
                        <Breadcrumb.Item>
                            <Link to="/admin"><Icon type="home" /></Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>
                            <Icon type="user" />
                            <span>修改密码</span>
                        </Breadcrumb.Item>
                    </Breadcrumb>
                }>
                    <ChangePassword/>
                </Card>
            </Home>
        )
    }
}
export default PasswordChange;