import React, { Component, useState } from "react";

class Count extends Component{

   

    constructor(props){
        super(props);
        this.state={
            count:0
        }
    }

    render(){
        return (
            <div>
                <h1>COunt : {this.state.count}</h1>
                <button onClick={this.cliked}>Count</button>
            </div>
        );
    }

    cliked=()=>{
       this.setState({count : this.state.count+1})
        console.log("Cliked on the button");
    }

}
export default Count;