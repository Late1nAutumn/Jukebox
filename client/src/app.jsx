import React from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import AddList from "./addList";

const serverURL="http://localhost:3000";

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
      portrait:""
    };
    this.rollingHigh=this.rollingHigh.bind(this);
    this.hdlAddPage=this.hdlAddPage.bind(this);
  }
  switchRoller(){
    var temp=this.state.rolling;
    this.setState({
      rolling:!temp,
      portrait:""
    });
    if(!temp)this.rollingHigh();
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
      this.setState({portrait:this.state.list[temp].img||require("../asset/soundonly.jpg")});
      var a=document.getElementById('audio');
      a.src=serverURL+"/voice/"+this.state.list[temp].name;
      a.play();
    }
  }
  componentDidMount() {
    this.hdlAddPage(1);
  }
  hdlNextPage(){
    var a=(this.state.page+1)%this.state.album.length;
    axios.get(serverURL+'/list/'+this.state.album[a]).then(
      data => {
        this.setState({
          list: data.data,
          page: a
        });
      },
      err => console.error(err)
    );
  }
  hdlAddPage(s){
    if(s){
      axios.get(serverURL+'/lists').then( //todo: diff in dev mode
        data0 => {
          // console.log(data.data);
          this.setState({album:data0.data});
          axios.get(serverURL+'/list/'+data0.data[0]).then(
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
      <div id = "content" >
        {this.state.load ? <div>
          <h1>{this.state.album[this.state.page]}</h1>
          <h3>{this.state.list[this.state.roller].name}</h3>
          {this.state.portrait?<img src={this.state.portrait}/>:<span/>}
          <img src={require("../asset/bg.jpg")}/>
          <audio id="audio"/>
            {/* <source src="" type="audio/mpeg"/> */}
          {this.state.album.length>1?<button onClick={this.hdlNextPage.bind(this)}>next collection</button>:<span/>}
          <button onClick={this.switchRoller.bind(this)}>{this.state.rolling?"STOP!":"ROLL!"}</button>
          <button onClick={()=>{this.hdlAddPage(0)}}>AddList</button>
        </div> : <AddList back={()=>{this.hdlAddPage(0)}}/>}
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("app"));
