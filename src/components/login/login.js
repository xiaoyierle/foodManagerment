import React,{Component} from "react";
import "./login.css";
import {Row,Col,Form,Icon,Input,Button} from "antd";
import Register from '../register/register';
const FormItem = Form.Item;
class LoginFormBox extends  Component{
    submit(){
        this.props.form.validateFields((err,value)=>{
            if(!err){
                fetch(`/login_check?username=${value.username}&password=${value.password}`,{credentials:'include'})
                    .then(res=>res.json())
                    .then(data=>{
                        if(data==="ok"){
                           window.location.href='/admin/user/info';
                        }else{
                            alert("用户名或密码输入错误");
                        }
                })
            }
        })
    }
    render(){
        let {getFieldDecorator} = this.props.form;
        return(
            <Form layout="inline" onSubmit={(e)=>{e.preventDefault();this.submit()}}>
                <FormItem>
                    {
                        getFieldDecorator('username',{
                            rules:[{required:true,message:"请输入用户名"}]
                        })(
                            <Input prefix={<Icon type="user" />} placeholder="请输入用户名" autoComplete="off"/>
                        )
                    }
                </FormItem>
                <FormItem>
                    {
                        getFieldDecorator('password',{
                            rules:[{required:true,message:"请输入密码"}]
                        })(
                            <Input type="password" prefix={<Icon type="lock" />}placeholder="请输入密码" autoComplete="off"/>
                        )
                    }
                </FormItem>
                <FormItem>
                    <Button htmlType="submit" type="primary">
                        Login
                    </Button>
                </FormItem>
            </Form>
        )
    }
}
const LoginForm = Form.create()(LoginFormBox)
class Login extends Component{
    render(){
        return(
                <div className="loginOuter">
                    <div className="loginHeader">
                        <Row className="loginHeaderContainer" type="flex" align="middle">
                            <Col span={4} className="loginTopName">
                                <Row className="logo" type="flex" justify="center" align="middle">
                                    <h3>点餐吧</h3>
                                    <span>|</span>
                                    <p>商家中心</p>
                                </Row>
                            </Col>
                            <Col span={10}>

                            </Col>
                            <Col span={10} type="flex" align="right">
                                <LoginForm/>
                            </Col>
                        </Row>
                    </div>
                    <Register/>
                </div>
        )
    }
}
export default Login;