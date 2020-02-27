import React from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import AddList from "./addList";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      load: false, // true:home false:add(dev only)
      roller:0,
      rolling:false,
      page:0,
      album:[],
      list:[{name:"",img:""}],
      portrait:"",
      remove:false
    };
    this.rollingHigh=this.rollingHigh.bind(this);
    this.hdlAddPage=this.hdlAddPage.bind(this);
    this.switchRoller=this.switchRoller.bind(this);
  }
  switchRoller(n){
    var temp=this.state.rolling;
    var obj={};
    if(!temp){ //remove picked person
      if(n){
        var tempArr=this.state.list;
        tempArr[this.state.roller]=tempArr.pop();
        obj.list=tempArr;
      }else{
        obj.remove=true;
      }
    }
    obj.rolling=!temp;
    obj.portrait="";
    this.setState(obj,()=>{
      if(!temp) this.rollingHigh();
    });
    //todo: stop user spamming this button (debounce)
  }
  rollingHigh(n){
    var old=this.state.roller;
    do{
      var temp=Math.floor(Math.random()*this.state.list.length);
    }while(temp===old && this.state.list.length>1);
    this.setState({roller:temp});
    if(this.state.rolling){var i=0;var j=100}
    else{
      if(!n){var i=5;var j=100}
      else{var i=n-1;var j=(6-i)*200}
    }
    if(this.state.rolling || i)
      setTimeout(()=>{this.rollingHigh(i)},j);
    else{
      this.setState({
        portrait:this.state.list[temp].img||require("../asset/soundonly.jpg")
      });
      var a=document.getElementById('audio');
      a.src="/voice/"+this.state.list[temp].name;
      a.play();
    }
  }
  componentDidMount() {
    this.hdlAddPage(1);
  }
  hdlNextPage(){
    var a=(this.state.page+1)%this.state.album.length;
    axios.get('/list/'+this.state.album[a]).then(
      data => {
        this.setState({
          roller:0,
          list: data.data,
          page: a,
          portrait:""
        });
      },
      err => console.error(err)
    );
  }
  hdlAddPage(s){
    if(s){
      axios.get('/lists').then( //todo: diff in dev mode
        data0 => {
          // console.log(data.data);
          this.setState({album:data0.data});
          axios.get('/list/'+data0.data[0]).then(
            data1 => {
              // console.log(data.data);
              this.setState({
                list: data1.data,
                load: true
              });
            },
            err => console.error(err)
          );
        },
        err => console.error(err)
      );
    }else this.setState({load:!this.state.load});
  }
  render() {
    return (
      <div className = "content" >
        {this.state.load ? <div className = "content">
          <h1>{this.state.album[this.state.page]}</h1>
          {this.state.album.length>1?<button onClick={this.hdlNextPage.bind(this)}>next group</button>:<span/>}
          <br/><br/>
          <div className="img">
            {this.state.portrait?
              <img className="face" src={this.state.portrait}/>:
              <img className="bg" src={require("../asset/bg.jpg")}/>}
            {this.state.portrait?<span/>:<div className="spin"><div className="spintext">{this.state.album[this.state.page]}<br/>&nbsp;<br/>&nbsp;</div></div>}
          </div>
          <h1>{this.state.list[this.state.roller].name}</h1>
          <audio id="audio"/><br/>
            {/* <source src="" type="audio/mpeg"/> */}
          <button onClick={()=>{this.switchRoller(this.state.remove)}}>{this.state.rolling?"STOP!":"ROLL!"}</button>
          <br/>
          {/* <button className="addbutton" onClick={()=>{this.hdlAddPage(0)}}>AddList (dev only)</button> */}
        </div> : <AddList back={()=>{this.hdlAddPage(0)}}/>}
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("app"));
