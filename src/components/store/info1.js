import React from 'react';
import Home from '../home/home';
import {Card,Table, Input, Popconfirm} from 'antd';
import './info.css';
class StoreInfoCell extends React.Component{
    state = {
        value: this.props.value,
        editable: this.props.editable || false,
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.editable !== this.state.editable) {
            this.setState({ editable: nextProps.editable });
            if (nextProps.editable) {
                this.cacheValue = this.state.value;
            }
        }
        if (nextProps.status && nextProps.status !== this.props.status) {
            if (nextProps.status === 'save') {
                this.props.onChange(this.state.value);
            } else if (nextProps.status === 'cancel') {
                this.setState({ value: this.cacheValue });
                this.props.onChange(this.cacheValue);
            }
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.editable !== this.state.editable ||
            nextState.value !== this.state.value;
    }
    handleChange(e) {
        const value = e.target.value;
        this.setState({ value });
    }
    render(){
        const {editable,value}=this.state;
        return(
            <div>
                {
                    editable ?
                        <div>
                            <Input
                                value={value}
                                onChange={e => this.handleChange(e)}
                            />
                        </div>
                        :
                        <div className="editable-row-text">
                            {value.toString() || ' '}
                        </div>
                }
            </div>
        )
    }
}
class StoreInfo extends React.Component{
    constructor(props){
        super(props);
        this.state={
            data1: [{
                key: '0',
                id: {
                    value: '0',
                },
                name: {
                    editable: false,
                    value: '王先生脆皮烤猪',
                },
                pic: {
                    editable: false,
                    value: '12312313',
                },
                desc: {
                    editable: false,
                    value: '好吃的脆皮烤猪',
                },
                address: {
                    editable: false,
                    value: '山西省太原市小店区',
                },
            }],
            data:[]
        }
        this.columns = [{
            title: '店铺id',
            dataIndex: 'id',
            width: '10%',
            render: (text, record, index) => this.renderColumns(this.state.data, index, 'id', text),
        },{
            title: '店铺名称',
            dataIndex: 'name',
            width: '25%',
            render: (text, record, index) => this.renderColumns(this.state.data, index, 'name', text),
        }, {
            title: '店铺图片',
            dataIndex: 'pic',
            width: '15%',
            render: (text, record, index) => this.renderColumns(this.state.data, index, 'pic', text),
        }, {
            title: '店铺简介',
            dataIndex: 'desc',
            width: '20%',
            render: (text, record, index) => this.renderColumns(this.state.data, index, 'desc', text),
        }, {
            title: '店铺地址',
            dataIndex: 'address',
            width: '20%',
            render: (text, record, index) => this.renderColumns(this.state.data, index, 'address', text),
        },{
            title: '编辑',
            dataIndex: 'operation',
            render: (text, record, index) => {
                const { editable } = this.state.data[index].name;
                return (
                    <div className="editable-row-operations">
                        {
                            editable ?
                                <span>
                  <a onClick={() => this.editDone(index, 'save')}>保存</a>
                  <Popconfirm title="取消编辑?" onConfirm={() => this.editDone(index, 'cancel')}>
                    <a>取消</a>
                  </Popconfirm>
                </span>
                                :
                                <span>
                  <a onClick={() => this.edit(index)}>修改信息</a>
                </span>
                        }
                    </div>
                );
            },
        }];
    }
    componentDidMount(){
        fetch('/get_store',{credentials:'include'})
            .then(res=>res.json())
            .then(data=>{
                let data2=[];
                data.forEach((v,i)=>{
                    var data1={};
                    for(let j in v){
                        if(j!=='id'){
                            data1[j]={value:data[i][j],editable:false}
                        }else{
                            data1[j]={value:data[i][j]}
                        }
                        data1['key']=i;
                    }
                    data2.push(data1);
                })

                this.setState({
                    data:data2
                });
            })
    }
    renderColumns(data, index, key, text) {
        const { editable, status } = data[index][key];
        if (typeof editable === 'undefined') {
            return text;
        }
        return (<StoreInfoCell
            editable={editable}
            value={text}
            onChange={value => this.handleChange(key, index, value)}
            status={status}
        />);
    }
    handleChange(key, index, value) {
        const { data } = this.state;
        data[index][key].value = value;
        this.setState({ data });
    }
    edit(index) {
        const { data } = this.state;
        Object.keys(data[index]).forEach((item) => {
            if (data[index][item] && typeof data[index][item].editable !== 'undefined') {
                data[index][item].editable = true;
            }
        });
        this.setState({ data });
    }
    editDone(index, type) {
        const { data } = this.state;
        Object.keys(data[index]).forEach((item) => {
            if (data[index][item] && typeof data[index][item].editable !== 'undefined') {
                data[index][item].editable = false;
                data[index][item].status = type;
            }
        });
        this.setState({ data }, () => {
            Object.keys(data[index]).forEach((item) => {
                if (data[index][item] && typeof data[index][item].editable !== 'undefined') {
                    delete data[index][item].status;
                }
            });
            console.log(data);
            fetch('/update_store',{
                credentials:'include',
                method:'post',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify(data[index])
            }).then(res=>res.json())
                .then(data=>{
                    if(data === 'ok'){
                        // window.location.href='/store/info';
                        alert('修改成功');
                    }
                })
        });

    }
    render(){
        const {data} = this.state;
        const dataSource = data.map((item) => {
            const obj = {};
            Object.keys(item).forEach((key) => {
                obj[key] = key === 'key' ? item[key] : item[key].value;
            });
            return obj;
        });
        const columns = this.columns;
        return(
            <Home selected="store_info">
                <Card title="店铺信息">
                    <Table bordered dataSource={dataSource} columns={columns} pagination={false}/>
                </Card>
            </Home>
        )
    }
}
export default StoreInfo;