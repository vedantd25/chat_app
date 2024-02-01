/*This component is used to display the userInfo and chats of the searched user once we click on the searched user. 
 this component listens for changes to the "userChats" document in Firestore, updates its state with the latest chat information, and renders the user's chats with associated details*/
import { doc, onSnapshot } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { db } from "../firebase";

const Chats = () => {
  
  const [chats, setChats] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
        setChats(doc.data());
      });
      /* 
        doc(db, "userChats", currentUser.uid):
          This creates a reference to the Firestore document at the path "userChats" with the document ID equal to currentUser.uid. It uses the doc function from Firestore, where db is the Firestore instance.

        onSnapshot:
          The onSnapshot function sets up a real-time listener for changes to the specified document. It takes two arguments: the document reference and a callback function that will be called whenever the data in the document changes.

        Callback Function (doc) => { setChats(doc.data()); }:
          The callback function is invoked every time there is a change in the document. It receives a snapshot of the document as its argument (referred to as doc).
          Inside the callback function, doc.data() is used to retrieve the data from the document snapshot.*/
      return () => {
        unsub();
      };
    };

    currentUser.uid && getChats();
  }, [currentUser.uid]);

  const handleSelect = (u) => {
    dispatch({ type: "CHANGE_USER", payload: u });//i.e userInfo is passed using 'u' which is stored in payload
  };

  return (
    <div className="chats">
    {/* chats:{
                combinedId:{
                [0]    date:{..}
                [1]    userInfo:{
                   [0]     displayName:"...",
                   [1]     photoURL:"...",
                   [2]     uid:...
                        }
                    }
                }
        */}
      {Object.entries(chats)?.sort((a,b)=>b[1].date - a[1].date).map((chat) => (//sort by date
        <div
          className="userChat"
          key={chat[0]}
          onClick={() => handleSelect(chat[1].userInfo)}
        >
          <img src={chat[1].userInfo.photoURL} alt="" />{/*chat[1].photoURL would mean the same*/} 
          <div className="userChatInfo">
            <span>{chat[1].userInfo.displayName}</span>
            <p>{chat[1].lastMessage?.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Chats;
