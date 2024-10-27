import React, { useEffect, useRef, useState} from 'react'
import Client from '../compenents/Client'
import Editor from '../compenents/Editor'
import { initSocket } from '../socket';
import ACTIONS from '../Actions';
import toast from 'react-hot-toast';
import { Navigate, useLocation,useNavigate, useParams} from 'react-router-dom';

const EditorPage = ({room}) => {
  const params = useParams();
  const [clients, setClients] = useState([])

  console.log(params)
  const reactNavigator = useNavigate();
  const socketRef = useRef(null);
  const location = useLocation();
  useEffect(()=>{
    async function init(){
      socketRef.current = await initSocket();
      socketRef.current.on('connect_failed', (err)=>handleError(err))
      socketRef.current.on('connect_error', (err)=>handleError(err))

      function handleError(e){
        console.log('socket connection error ',e);
        toast.error('Socket connection error. Try again!')
        reactNavigator('/')
      }
      socketRef.current.emit(ACTIONS.JOIN, {
        roomId: params.roomId,
        username: location.state?.username // if ever the username is not accessed, (?) will prevent from thrownig error
      })
      socketRef.current.on(ACTIONS.JOINED , ({clients, username, socketId})=>{
        if( username !== location.state.username){
          toast.success(`${username} joined the room.`)
          console.log(`username ${username} joined`);
        }
        setClients(clients)
      })

      socketRef.current.on(ACTIONS.DISCONNECTED, ({socketId, username})=>{
          toast.success(`${username} left the room.`)
          setClients((prev)=>{
              return prev.filter((client) => client.socketId !== socketId)
          })
      })
    }
    init();

    return ()=>{
      // clear all the listeners when the component unmounts, to save from the memory leak
      
      socketRef.current.off(ACTIONS.DISCONNECTED)
      socketRef.current.off(ACTIONS.JOINED)
      socketRef.current.disconnect();
    }
  },[])


  if(!location.state){
      return <Navigate to="/"/>
  }
  return (
    <div className="mainWrap">
        <div className="aside">
            <div className="aside-inner">
              <div className="logo">
                <img className="logoImg" src="/logo.png" alt="logo" />
              </div>
              <h3>Connected</h3>
              <div className="clientList">
                {

                  clients.map((client)=>{
                    return <Client username={client.username} key={client.socketId}/>
                  })

                }
              </div>
            </div>
            <button className="btn copyBtn">Copy ROOM ID</button>
            <button className="btn leaveBtn">Leave Room</button>
        </div>
        <div className="editor">
          <Editor socketRef = {socketRef} roomId= {params.roomId}/>
        </div>
    </div>
  )
}

export default EditorPage   