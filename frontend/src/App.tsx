import { useEffect, useRef, useState } from 'react'
import './App.css'

function App() {

 const [messages, setMessages] = useState(["Hello from server!"])
 

  // @ts-ignore
 const wsRef = useRef(); 
 // @ts-ignore
 const inputRef = useRef(); 

 useEffect(() => {

   const ws = new WebSocket("ws://localhost:8080");
   
   
   ws.onmessage = (event) => {
     setMessages(m => [...m, event.data]) 
   }


   //@ts-ignore
   wsRef.current = ws;


   ws.onopen = () => {
     ws.send(JSON.stringify({
       type:"join",
       payload:{
         roomId: "red" 
       }
     }))
   }

 
   return () => {
     ws.close()
   }
 }, []) 

 return (

   <div className='h-screen bg-black'>
     <br /><br /><br />
     <div className='h-[85vh]'>

       {messages.map(message => <div className='m-8'> 
         <span className='bg-white text-black rounded p-4 '>            
           {message} 
         </span>
       </div>)}
     </div>

     <div className='w-full bg-white flex'>
      
        {/* @ts-ignore */}  
       <input ref={inputRef} id="message" className="flex-1 p-4"></input>
       <button onClick={() => {
         // @ts-ignore
         const message = inputRef.current?.value;
         // Send chat message through WebSocket
         // @ts-ignore
         wsRef.current.send(JSON.stringify({
           type: "chat",
           payload: {
             message: message
           }
         }))

       }} className='bg-purple-600 text-white p-4'>
         Send message
       </button>
     </div>
   </div>
 )
}

export default App

/*
---------------------- Important Notes ----------------------

Ye code ek real-time chat application implement karta hai. Main points ye hai:

1. WebSocket Connection:
  - Local server se WebSocket connection create karta hai port 8080 pe
  - Connection establish hote hi automatically "red" room mei join ho jata hai
  - Har new message ko messages array mei add karta hai

2. State aur Refs:
  - messages state mei saare chat messages store hote hai
  - wsRef WebSocket connection ko store karta hai taki baad mei use kar sake
  - inputRef input field ko reference karta hai

3. UI Components:
  - Black background ke saath full screen chat interface
  - Upar messages display hote hai white bubbles mei
  - Bottom mei ek input field hai message type karne ke liye
  - Purple send button message bhejne ke liye

4. Message Handling:
  - Send button click hone pe current input value ko WebSocket ke through server ko bhej deta hai
  - Server se aane wale messages automatically display ho jaate hai
  - Messages JSON format mei send hote hai with type aur payload

5. Cleanup:
  - Component unmount hone pe WebSocket connection automatically close ho jata hai

Is code ka basic flow ye hai:
1. Page load -> WebSocket connection -> Room join
2. User message type karta hai -> Send click -> Server ko message jaata hai
3. Server message process karta hai -> Same room ke sabhi users ko message bhejta hai
4. Receiving clients pe message display ho jaata hai

*/