import React from "react";
import axios from "axios";

class AddList extends React.Component{
  constructor(props){
    super(props);
    this.state={
      listName:"",
      collection:[]
    };
  }
  hdlListName(e){
    e.preventDefault();
    this.setState({listName:e.target.listname.value});
  }
  hdlListEntry(e){
    e.preventDefault();
    var temp={name:e.target.name.value,img:e.target.img.value};
    var arr=this.state.collection;
    arr.push(temp);
    this.setState({collection:arr});
    e.target.reset();
  }
  hdlListRemove(e){
    var arr=this.state.collection;
    arr.splice(Number(e.target.name),1);
    this.setState({collection:arr});
  }
  hdlBack(s){
    if(s)axios.post('/addlist/'+this.state.listName,this.state.collection).then(null,err=>console.error(err));
    this.setState({listName:"",collection:[]});
    this.props.back(s);
  }
  render(){return(
    <div>
      <h1>This tool only works in dev mode</h1>
      list name:&nbsp;
      {this.state.listName?<h3>{this.state.listName}</h3>:
      <form onSubmit={this.hdlListName.bind(this)}>
        <input name="listname"/>
        <button>confrim</button>
      </form>}
      <br/><br/>
      {this.state.collection.map((obj,i)=>(
        <div>
          <span>{obj.name+' : '+obj.img}</span>&nbsp;
          <button name={i} onClick={this.hdlListRemove.bind(this)}>remove</button>
        </div>
      ))}
      <form onSubmit={this.hdlListEntry.bind(this)}>
        name:&nbsp;<input name="name"/>&nbsp;&nbsp;
        img:&nbsp;<input name="img"/>
        <button>confrim</button>
      </form>
      <br/><br/>
      <button onClick={()=>{this.hdlBack()}}>back</button>
      <button onClick={()=>{this.hdlBack(1)}}>submit</button>
    </div>
  );}
}

export default AddList;