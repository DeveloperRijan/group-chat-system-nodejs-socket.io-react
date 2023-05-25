import { useState } from "react";
import { useNavigate } from "react-router-dom";

function App() {
  const [groupId,setGroupId]=useState("")
  const navigate = useNavigate()
  const joinGroup = ()=>{
      navigate(`/groups/${groupId}`)
  }
  const newGroup = ()=>{
    navigate(`/groups/${crypto.randomUUID()}`)
  }
  return (
    <div style={{width:"100vw",height: "100vh"}} className="d-flex  align-items-center justify-content-center">
      <div className='card rounded-2 shadow-lg' style={{maxWidth: "400px"}}>
        <div className="card-body">
          <input onChange={(e)=>{
            setGroupId(e.target.value)
          }} placeholder="Enter GroupID" className="form-control" />
          <button onClick={joinGroup} className="btn btn-primary center mx-auto d-block mt-3">Join</button>
          <p className="text-center">OR</p>
          <button onClick={newGroup} className="btn btn-success d-block mx-auto">New Chat Room</button>
        </div>
          
      </div>
    </div>
  );
}

export default App;
