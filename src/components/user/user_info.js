import React from 'react';
import Home from '../home/home';
import {Redirect} from 'react-router-dom';
class UserInfo extends React.Component{
    constructor(){
        super();
        this.state={
            username:"",
            auth:true
        }
    }
    componentDidMount(){
        fetch('/get_auth',{
            credentials:'include'
        }).then(res=>res.json())
            .then(r=>{
                this.setState({
                    auth:r
                })
            })
        fetch('/get_user',{
            credentials:'include'
        })
            .then(res=>res.json())
            .then(data=>{
                this.setState({username:data})
            })
    }
    render(){
        return(
            <div>
                {
                    this.state.auth?(
                        <Home selected="info">
                            <div>
                                nihao {this.state.username}
                            </div>
                        </Home>
                    ):(
                        <Redirect to="/admin/login"/>
                    )
                }
            </div>
        )
    }
}
export default UserInfo;