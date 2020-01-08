import React from "react";
import ReactDOM from "react-dom";
import axios from "axios";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      load: false,
      roller:0,
      rolling:false,
      list:["what","the","fack","is","this","???"]
    };
    this.rollingHigh=this.rollingHigh.bind(this);
  }
  switchRoller(){
    var temp=this.state.rolling;
    this.setState({rolling:!temp});
    if(!temp)this.rollingHigh();
  }
  rollingHigh(n){
    var old=this.state.roller;
    do{
      var temp=Math.floor(Math.random()*this.state.list.length);
    }while(temp===old);
    this.setState({roller:temp});
    if(this.state.rolling){var i=0;var j=100}
    else{
      if(!n){var i=5;var j=100}
      else{var i=n-1;var j=(6-i)*200}
    }
    if(this.state.rolling || i)
      setTimeout(()=>{this.rollingHigh(i)},j);
  }
  componentDidMount() {
    axios.get({
      url:'/list',
      method:'get'
    }).then(
      data => {
        console.log(data.data);
        this.setState({
          load: true
        });
      },
      err => console.error(err)
    );
  }
  hdlAudio(){
    var a=document.getElementById('audio');
    a.src="http://localhost:3000/voice";
    a.play();
  }
  render() {
    return (
      <div id = "content" >
        {this.state.load ? <div>
          Hello World
          <h3>{this.state.list[this.state.roller]}</h3>
          {/* <img src={require("../asset/phonogragh.jpg")}/> */}
          <audio id="audio"/>
            {/* <source src="http://localhost:3000/voice" type="audio/mpeg"/> */}
          <button onClick={this.hdlAudio.bind(this)}>ha!</button>
          <button onClick={this.switchRoller.bind(this)}>{this.state.rolling?"STOP!":"ROLL!"}</button>
        </div> : <div></div>}
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("app"));
