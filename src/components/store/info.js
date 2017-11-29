import React from 'react';
import Home from '../home/home';
import {Card,Table,message,Modal,Icon,Upload,Breadcrumb,Button,Popconfirm,Input} from 'antd';
import {Link} from 'react-router-dom';
import './info.css';
message.config({
    duration:5
})
class StoreInfo extends React.Component{
    constructor(){
        super();
        this.state={
            source:[]
        }
    }
    componentDidMount(){
        fetch('/get_store',{credentials:'include'})
            .then(res=>res.json())
            .then(data=>{
                if(data.code===4){
                    message.error(data.message)
                }else{
                    this.setState({
                        source:data
                    })
                }
            })
    }
    showModal(id){
        let r = this.state.source.map(v=>{
            if(v.id===id){
                v.show = true;
            }
            return v;
        })
        this.setState({
            source:r
        })
    }
    hideModel(id){
        let r = this.state.source.map(v=>{
            if(v.id===id){
                v.show = false;
            }
            return v;
        })
        this.setState({
            source:r
        })
    }
    delete(id){
        console.log(id)
        fetch('/delete_store',{
            method:'post',
            headers:{
                'Content-Type':'application/json'
            },
            credentials:'include',
            body:JSON.stringify({id}),
        }).then(res=>res.json())
            .then(r=>{
                var n = this.state.source.filter(v=>v.id!==id);
                if(r==='ok'){
                    this.setState({source:n});
                }
            })
    }
    remove(id){
        var r = this.state.source.map(v=>{
            if(v.id === id){
                v.pic=undefined;
            }
            return v;
        })
        this.setState({
            source:r
        })
    }
    update(id,key,record){
        const {name}=this.state;
        fetch('/update_store',{
            method:'post',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({id,key,name})
        }).then(res=>res.json())
            .then(r=>{
                if(r==='ok'){
                    record[key]=name;
                    this.setState({
                        name:'',
                    })
                }
            })
    }
    change(e){
        this.setState({
            name:e.target.value
        })
    }
    getBase64(img, callback) {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }
    handleChange(e,id){
        this.getBase64(e.file.originFileObj, imageUrl => {
            var r = this.state.source.map(v=>{
                if(v.id === id){
                    v.pic=imageUrl;
                }
                return v;
            })
            this.setState({
                source:r
            })
        });

    }
    render(){
        const tableData={
            columns:[
                {
                    title:'序号',
                    dataIndex:'id',
                    key:'id'
                },
                {
                    title:'用户id',
                    dataIndex:'uid',
                    key:'uid'
                },
                {
                    title:'店铺名称',
                    key:'name',
                    render:(record)=>(
                        <div className="cateUpdateCell">
                            {record.name}
                            &nbsp;&nbsp;&nbsp;
                            <Popconfirm
                                title={(<Input onChange={(e)=>this.change(e)} defaultValue={record.name}/>)}
                                onConfirm={()=>this.update(record.id,'name',record)}
                            >
                                <Button shape="circle" type="dashed"><Icon type="edit" /></Button>
                            </Popconfirm>
                        </div>
                    )
                },
                {
                    title:'店铺图片',
                    key:'pic',
                    render:(record)=>{
                        let o = [];
                        if(record.pic){
                            o.push({
                                uid:-1,
                                url:record.pic
                            })
                        }
                        return (
                            <div>
                                <Upload
                                    name="shop"
                                    action="/update_shoppic"
                                    listType="picture-card"
                                    fileList={o}
                                    data={{id:record.id}}
                                    onPreview={()=>this.showModal(record.id)}
                                    onRemove={()=>this.remove(record.id)}
                                    onChange={(e)=>this.handleChange(e,record.id)}
                                >
                                    {o.length?null:<div><Icon type="plus" style={{fontSize:"20px"}}/>点击上传</div>}
                                </Upload>
                                <Modal visible={record.show} footer={null} onCancel={()=>this.hideModel(record.id)}>
                                    <img style={{ width: '100%' }} src={record.pic} alt=""/>
                                </Modal>
                            </div>
                        )
                    }
                },
                {
                    title:'起送价',
                    key:'price',
                    render:(record)=>(
                        <div className="cateUpdateCell">
                            {record.price}
                            &nbsp;&nbsp;&nbsp;
                            <Popconfirm
                                title={(<Input onChange={(e)=>this.change(e)} defaultValue={record.price}/>)}
                                onConfirm={()=>this.update(record.id,'price',record)}
                            >
                                <Button shape="circle" type="dashed"><Icon type="edit" /></Button>
                            </Popconfirm>
                        </div>
                    )
                },
                {
                    title:'配送费',
                    key:'deliver',
                    render:(record)=>(
                        <div className="cateUpdateCell">
                            {record.deliver}
                            &nbsp;&nbsp;&nbsp;
                            <Popconfirm
                                title={(<Input onChange={(e)=>this.change(e)} defaultValue={record.deliver}/>)}
                                onConfirm={()=>this.update(record.id,'deliver',record)}
                            >
                                <Button shape="circle" type="dashed"><Icon type="edit" /></Button>
                            </Popconfirm>
                        </div>
                    )
                },
                {
                    title:'店铺地址',
                    key:'address',
                    render:(record)=>(
                        <div className="cateUpdateCell">
                            {record.address}
                            &nbsp;&nbsp;&nbsp;
                            <Popconfirm
                                title={(<Input onChange={(e)=>this.change(e)} defaultValue={record.address}/>)}
                                onConfirm={()=>this.update(record.id,'address',record)}
                            >
                                <Button shape="circle" type="dashed"><Icon type="edit" /></Button>
                            </Popconfirm>
                        </div>
                    )
                },
                {title:'操作',key:'option',render:r=>(
                    <Button type="dashed" onClick={()=>this.delete(r.id)}>删除</Button>
                )}
            ],
            dataSource:this.state.source,
        }
        return(
            <Home selected="store_info">
                <Card title={
                    <Breadcrumb>
                        <Breadcrumb.Item>
                            <Link to="/admin"><Icon type="home" /></Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>
                            <Icon type="user" />
                            <span>店铺信息</span>
                        </Breadcrumb.Item>
                    </Breadcrumb>
                }>
                    <Table bordered {...tableData}/>
                </Card>
            </Home>
        )
    }
}
export default StoreInfo;