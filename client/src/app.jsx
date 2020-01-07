import React from "react";
import ReactDOM from "react-dom";
// import axios from "axios";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      load: false
    };
  }
  componentDidMount() {
    this.setState({
      load: true
    });
    // axios.get("/").then(
    //   data => {
    //     // console.log(data.data);
    //     this.setState({
    //       load: true
    //     });
    //   },
    //   err => console.error(err)
    // );
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
          <img src={require("../../asset/phonogragh.jpg")}/>
          <audio id="audio"/>
            {/* <source src="http://localhost:3000/voice" type="audio/mpeg"/> */}
          <button onClick={this.hdlAudio.bind(this)}>ha!</button>
        </div> : <div></div>}
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("app"));
