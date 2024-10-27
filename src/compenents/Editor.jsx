import React, { useEffect, useRef, useState } from 'react'
import CodeMirror, { logException } from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { dracula } from '@uiw/codemirror-theme-dracula';
import { okaidia } from '@uiw/codemirror-theme-okaidia';
import { Editor as Edt } from "@monaco-editor/react";
import ACTIONS from '../Actions';
export default function ({socketRef, roomId}) {
  
  const editorRef = useRef(null);
  const [codeState , setCodeState] = useState('');
  
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      // Display a message or confirm dialog when the user tries to refresh or leave the page
      event.preventDefault();
      event.returnValue = "do not do it";  // For most browsers, this triggers a confirm dialog.
      // alert('do not do it')
    };

    

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);
  const EXPIRATION_TIME = 5000; 
  const saveCodeToLocalStorage = (newCode) => {
    const currentTime = new Date().getTime();
    localStorage.setItem("collaborative_code", newCode);  // Save code to localStorage
    localStorage.setItem("collaborative_code_time", currentTime);  // Save the current time
  };


  useEffect(()=>{
    // saving the data locally so that u could get it back if hit refresh
    const savedCode = localStorage.getItem("collaborative_code");
    const savedTime = localStorage.getItem("collaborative_code_time");

    if (savedCode && savedTime) {
      const currentTime = new Date().getTime();
      if (currentTime - savedTime < EXPIRATION_TIME) {
        setCodeState(savedCode);  // Load the code if it's within the expiration time
      } else {
        localStorage.removeItem("collaborative_code");
        localStorage.removeItem("collaborative_code_time");
      }
    }

      console.log("here ")
      if(socketRef.current){
        console.log('entered here ')
        socketRef.current.on(ACTIONS.CODE_CHANGE, (newCodeState)=>{
          console.log('receiving ', newCodeState );
          setCodeState(newCodeState);
          saveCodeToLocalStorage(newCodeState);
        })
      }
      
      return () => {
        socketRef.current.off('update-code');
      };
    
  },)

  function handleCodeChange(newCode){
    setCodeState(newCode);
    console.log(newCode);
    
      socketRef.current.emit(ACTIONS.CODE_CHANGE,({ roomId, newCode}))
      saveCodeToLocalStorage(newCode);
  }
  return (
    
    <div className='codemirror-container' >
     

      <Edt
        className='editor-interface'
        height="90vh"
        defaultLanguage="javascript"
        defaultValue="console.log('Hello everyone')"
        value={codeState}
        onChange={handleCodeChange}
      />


    </div>
  )
  
}

