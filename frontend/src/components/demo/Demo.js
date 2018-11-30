import React, { Component, PureComponent } from "react";
import { lightBox_publicFunctions as lb } from "./..//LightBox";
import ReactDOM from "react-dom";

class DemoModal extends PureComponent{

	constructor(props){
		super(props);

		// prop ref
		// this.props.messageNum

		this.messageJSXs = [
			<div id="msg1">
				<h2>Welcome!</h2>
				<p>
					This app generates an interactive <strong>"flipbook"</strong>.
				</p>
				<p>
					This demo chapter contains an <strong>incomplete stop-motion animation</strong>.
					Rest of the images can be <strong>downloaded</strong> by clicking the sample button.
			 		Or, upload your own images if you want to see how buggy this app is.
				</p>
			 	<p>
			 		Look for the demo guide buttons for more information as you explore.
			 	</p>
			</div>
			,
			<div id="msg2">
				<h2>Chapter View</h2>
				<p>
					You are viewing chapter detail
				</p>
			</div>
		]
		
	}

	componentDidMount(){
		lb.pub_LightBox_on();
        lb.pub_LightBox_addToOnClick( ()=>{
			this.props.close();
		});
	}

	componentDidUpdate(prevProps, prevStates){

		// check if this card was rendered to be active, 
  		// then control lightbox
        if        (prevProps.on == false && this.props.on == true){
            lb.pub_LightBox_on();
	        lb.pub_LightBox_addToOnClick( ()=>{
				this.props.close();
			});
        } else if (prevProps.on == true && this.props.on == false){
            lb.pub_LightBox_off();
        }
	}

	render(){
		return(
			<div className={"demo_modal " +
							(this.props.on ? "active":"")}>
				<span className="message_wrapper">
					{this.messageJSXs[this.props.messageNum-1]}
				</span>
			</div>
		)
	}
}



class DemoGuideBtn extends PureComponent{

	constructor(props){
		super(props);

		this.r = React.createRef();

		this.state = {
			messageOpen: false
		}

		this.openDemoMessage=this.openDemoMessage.bind(this);
		this.closeDemoMessage=this.closeDemoMessage.bind(this);
	}

	componentDidMount(){
		if(this.props.proxyId != null || this.props.proxyId != undefined){
			// append to proxy
			const proxy = document.querySelector(this.props.proxyId);
			if(proxy){
				proxy.appendChild(this.r.current);
			}	  

		}
	}

	openDemoMessage(){
		this.setState({messageOpen: true});
	}

	closeDemoMessage(){
		this.setState({messageOpen: false});
	}

	render(){
		return (
			<button className="demoguide"
					onClick={this.openDemoMessage}
					ref={this.r}>
				<span className="far fa-lightbulb"></span>
				
				{`#${this.props.num}`}

				<DemoModal on={this.state.messageOpen}
						   close={this.closeDemoMessage}
						   messageNum={this.props.num}/>
			</button>
		)
	}

}


export {
    DemoModal,
    DemoGuideBtn
};
