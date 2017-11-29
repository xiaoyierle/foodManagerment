import React from 'react';
import "./register.css"
import {Card,Form,Input,Icon,Button,Radio} from 'antd';
const FormItem = Form.Item;
const RadioGroup=Radio.Group;
class RegisterFormBox extends React.Component{
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
                fetch('/register',{
                    credentials:'include',
                    method:'post',
                    headers:{
                        'Content-Type':'application/json'
                    },
                    body:JSON.stringify(value)
                }).then(res=>res.json())
                    .then(data=>{
                        if(data === 'ok'){
                            window.location.href="/admin/user/info";
                        }
                    })
            }
        })
    }
    validName(rule,value,callback){
        if(value.length<=7){
            callback('账号长度需要大于7')
        }else{
            callback();
        }
        // console.log(rule,value);
        // callback('abc');//提示错误信息
    }
    validPass(rule,value,callback){
        this.setState({pass:value});
        if(value.length<=8){
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
        const {getFieldDecorator} = this.props.form;
        let style = {
            labelCol:{span:6},
            wrapperCol:{span:18}
        }
        return(
            <Form onSubmit={(e)=>{e.preventDefault();this.submit()}}>
                <FormItem label="帐号" {...style}>
                    {
                        getFieldDecorator('name',{
                            rules:[
                                {required: true, message: '请输入账号！！'},
                                {validator:this.validName}]
                        })(
                            <Input prefix={<Icon type="user"/>} autoComplete="off"/>
                        )
                    }
                </FormItem>
                <FormItem label="密码" {...style}>
                    {
                        getFieldDecorator('password',{
                            rules:[{required: true, message: '请输入密码！！'},
                                {validator:this.validPass}]
                        })(
                            <Input type="password" prefix={<Icon type="lock"/>}/>
                        )
                    }
                </FormItem>
                <FormItem label="重复密码" {...style}>
                    {
                        getFieldDecorator('password_check',{
                            rules:[{required: true, message: '请输入密码！！'},
                                {validator:this.validPassAgain}]
                        })(
                            <Input type="password" prefix={<Icon type="lock"/>}/>
                        )
                    }
                </FormItem>
                <FormItem label="性别" {...style}>
                    {
                        getFieldDecorator('gender',{
                            initialValue:1
                        })(
                            <RadioGroup>
                                <Radio value={1}>男</Radio>
                                <Radio value={2}>女</Radio>
                            </RadioGroup>
                        )
                    }

                </FormItem>
                <FormItem wrapperCol={{offset:6}}>
                    <Button type="primary" htmlType="submit">Register</Button>
                </FormItem>
            </Form>
        )
    }
}
const RegisterForm = Form.create()(RegisterFormBox)
class Register extends React.Component{
    render(){
        return(
            <div className="register">
                <div className="register-container">
                    <Card className="registerBox" title="商家注册"><RegisterForm/></Card>

                </div>
            </div>
        )
    }
}
export default Register;