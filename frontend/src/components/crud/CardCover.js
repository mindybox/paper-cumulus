import React, { Component, PureComponent } from "react";
import ReactDOM from "react-dom";

// Custom helpers
import Helper from "./../Helper"
const h = new Helper();




function getCardCoverMessage(templateName, offFunc){

    // WARNING: This function is used by all of CardCovers. Do not bind(this) to it.
    //          It will only work for the first binder. 

    switch (templateName){
        case "default":
            return (
                <div className="cover_message">
                    <p className="color red">
                        <span className="bigtext-1 fas fa-file-image"/>
                    </p>
                    <p>
                        <span className="bigtext 1">Drop images to make frames</span>
                    </p>
                </div>
            )

        case "deleteConfirm":
            return (
                <div className="cover_message">
                    <p>
                    <span className="bigtext 2">Are you sure you want to delete this scene?</span>
                    </p>
                    <p>
                        <span>
                            <button className='warning'>DELETE</button>
                            <button onClick={offFunc}>Cancel</button></span>
                    </p>
                </div>           
         
            )

        case "frameCreateError":
            return (
                <div className="cover_message">
                    <p className="color red">
                        <span className="bigtext-1 far fa-frown-open"></span>
                        <span>Aww, it didn't work!</span>
                    </p>

                    <p>
                        <button>Sorry about that</button>
                    </p>
                </div>
            )

        case "wrongFileType":
            return (
                <div className="cover_message">
                    <p className="color red">
                        <span className="bigtext-1 far fa-file-image"></span>
                        <span className="bigtext-1 fas fa-question"></span>
                    </p>

                    <p> 
                        <span>Wrong file type. Please upload .png, .gif, or .jpg</span>
                    </p>
                </div>
            )

        case "invalidForm":
            return (
                <div className="cover_message">
                    <p className="color red">
                        <span className="bigtext-1 far fa-frown-open"></span>
                    </p>

                    <p><span>Something went wrong! Cannot send information.</span></p>

                    <p>
                        <button>Sorry about that</button>
                    </p>
                </div>
            )
    }
}

class CardCover extends PureComponent {
    constructor(props){
        super(props);
        this.r = React.createRef();

        // Some cover message is supposed to be intangible, but some messages
        // have confirmation button, which requires them to be tangible.
        this.intangibilityMap = {
            default: true, //for drag and drop
            deleteConfirm: false,
            frameCreateError: false,
            wrongFileType: false,
            invalidForm: false,
        }
        
        getCardCoverMessage = getCardCoverMessage.bind(this);
    }

    componentDidUpdate(prevProps, prevState, snapshot){
        // check if this card was rendered to be active, 
        // then control lightbox
        if        (prevProps.on == false && this.props.on == true){
            this.props.setParentSpotlight(true);
        } else if (prevProps.on == true && this.props.on == false){
            this.props.setParentSpotlight(false);
        }
    }

    render(){
        const intanMap = this.intangibilityMap;
        const intangible = intanMap.hasOwnProperty(this.props.messageType) ? intanMap[this.props.messageType] : intanMap.default;
        return (
            <div className={"cover light drag_and_drop " + 
                            (this.props.on ? "active" : "") + " " +
                            (intangible ? "intangible" : "")}
                 onDrop={(e)=>{e.preventDefault()}}>
      
                    {getCardCoverMessage(this.props.messageType, this.props.off)}
            </div>
        )
    }
}

export {
    CardCover,
    getCardCoverMessage
};