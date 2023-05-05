import React from "react";

const Notification = ({message, messageType}) => {
    if (message == null){
        return null
    }
    switch(messageType){
        case 1:
            return <div className="error">{message}</div>
            break;
        case 2:
            return <div className="correct">{message}</div>
            break;
        default:
            return <div className="error">Something went wrong</div>
            break;
    }
}


export default Notification