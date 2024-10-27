import React, { useReducer, useState } from 'react'
import {v4 as uuidV4} from 'uuid';
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom';
const Home = () => {
    const navigate = useNavigate();
    const [roomId, setRoomId] = useState('');
    const [username, setUsername] = useState('');

    function createNewRoom(e){
        e.preventDefault();
        const id = uuidV4();
        setRoomId(id);
        toast.success('New room created successfully')
    }
    function joinRoom(){
        // if()
        if(roomId==='' || username ===''){
            toast.error('ROOM ID & username required');
            return;
        }

        navigate(`/editor/${roomId}`,{
            state:{
                username
            }
        })
        
        // console.log(username)
    }
  return (
    <>
    <div className='container'>
        <div className="card">
            <img className='logo-img' src='/logo.png' alt="logo" />
            <h4>Paste invitation Room ID</h4>
            <div className="input-group">
                
                <input type="text" placeholder='ROOM ID' className='roomId-input' value={roomId} onChange={(e)=>{setRoomId(e.target.value)}} 
                                    onKeyUp={(e)=>{
                                        // console.log(e.code);
                                        if(e.code==='Enter'){
                                            joinRoom();
                                        }
                                    }}/>
               <input type="text" placeholder='USERNAME' className='username-inout' onChange={(e)=>setUsername(e.target.value)} 
                                    onKeyUp={(e)=>{
                                        // console.log(e.code);
                                        if(e.code==='Enter'){
                                            joinRoom();
                                        }
                                    }} />
            </div>
            <button className='btn joinBtn' onClick={joinRoom}>JOIN</button>
            <span className="footnote">If you don't have an invite then create&nbsp; 
                <a href="" className='newRoom-btn' onClick={createNewRoom}>new room.</a>
            </span>
        </div>
        <footer>
             <h4>Developed by <a className="author-link" href="">Rayyan Alam</a></h4>
        </footer>
    </div>
    
</>
  )
}

export default Home
