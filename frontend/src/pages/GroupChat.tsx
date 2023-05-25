import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { socket } from "../socket";


function MessageComponent({message,time,isMe}:{message: string,time:string,isMe:any}) {
    return <div className={`w-100 d-flex ${isMe?'justify-content-end':'justify-content-start'}`}>
        <div className={`${isMe?"bg-primary text-white":"bg-light"} mt-2 py-2 px-2 rounded-2`} style={{maxWidth:"300px"}}>
        <p className="my-0">{message}</p>
        <span className={`${isMe?"text-white":"text-muted"}`} style={{fontSize:"12px"}}>{time}</span>
    </div></div>
}

function GroupChatPage() {
    const { groupId } = useParams()
    const [messages,setMessages] = useState<any>([])
    const [message,setMessage] = useState("")
    const [connected,setConnected] = useState(false)
    useEffect(()=>{
        if(socket.connected) {
            socket.emit("joinRoom",{
                groupId: groupId,
            })
            setConnected(true)
        }
    },[groupId])
    useEffect(() => {
        function onConnect() {
          socket.emit("joinRoom",{
            groupId: groupId,
          })
          setConnected(true);
          console.log("connected...")
        }
        function onDisconnect() {
            setConnected(false);
        }
        function onMessage(msg:any) {
            console.log("MSG",msg)
            let isContain = false
            for( let ms of messages) {
                if(ms.msg_id === msg.msg_id) {
                    isContain = true
                }
            }
            if (!isContain) {
                setMessages([msg,...messages])
                console.log([msg,...messages])
                console.log("new message ",msg)
            }
        }
        function onLoadMessages(loadMessages:any) {
            setMessages(loadMessages)
        }
        socket.on('connect', onConnect);
        socket.on("message",onMessage)
        socket.on('disconnect', onDisconnect);
        socket.on('loadMessages',onLoadMessages)
        return () => {
          socket.off('connect', onConnect);
          socket.off('loadMessages',onLoadMessages)
          socket.off('disconnect',onDisconnect)
          socket.off('message',onMessage)
        };
    }, [messages,groupId]);
    return <div className="d-flex align-items-center justify-content-center" style={{width:"100vw",height:"100vh"}}>
        <div className="card" style={{minHeight:"70vh",maxHeight:"90vh",minWidth:"70vw"}}>
            <div className="card-header"><p className="my-0">{connected? "Connected": "Connecting.."}</p></div>
            <div className="card-body d-flex flex-column-reverse overflow-scroll">
                {messages.map((e:any)=><MessageComponent key={`${e.msg_id}`} isMe={e.isMe} message={e.message} time={e.time} />)}
            </div>
            <form className="card-footer d-flex" onSubmit={(e)=>{
                e.preventDefault()
                if(!message.length) {
                    return
                }
                const tim = `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`
                const newMsg = {msg_id: crypto.randomUUID(), message: message,time:tim}
                setMessages([{...newMsg, isMe:true},...messages])
                console.log([{...newMsg, isMe:true},...messages])
                setMessage("")
                socket.emit("chatMessage",{
                    groupId: groupId,
                    message: newMsg
                })
            }}>
                <input value={message} onChange={(e)=>{setMessage(e.target.value)}} className="form-control" placeholder="Type something..."/>
                <button type="submit" className="btn btn-primary ms-2">Send</button>
            </form>
        </div>
    </div>
}
export default GroupChatPage