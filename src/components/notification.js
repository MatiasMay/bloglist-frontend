import React from 'react'

const Notification = ({ message, messageType }) => {
  if (message === null){
    return null
  }
  switch(messageType){
  case 1:
    return <div className="error">{message}</div>
  case 2:
    return <div className="correct">{message}</div>
  default:
    return <div className="error">Something went wrong</div>
  }
}


export default Notification