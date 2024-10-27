import React from 'react'
import Avatar from 'react-avatar'
const Client = ({username}) => {
  return (
    <div className='client'>
        {/* {console.log("avatar accessed")} */}
        <Avatar name={username} size={48} round="11px"/>
        <span className='userName'>{username}</span>
    </div>
  )
}

export default Client
