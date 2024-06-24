import React, { useContext, useState } from "react";
import Img from "../img/img.png";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import {
  arrayUnion,
  doc,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../firebase";
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

const Input = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);

  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const isTextEmpty = text.trim() === "";

  const handleSend = async () => {
    if (isTextEmpty && !img) {
      // Don't send if both text and image are empty
      return;
    }
  
    try {
      const messages = [];
  
      if (img) {
        const storageRef = ref(storage, `images/${uuid()}`);
        const uploadTask = uploadBytesResumable(storageRef, img);
  
        await new Promise((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            (snapshot) => {},
            (error) => reject(error),
            async () => {
              try {
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
  
                messages.push({
                  id: uuid(),
                  text,
                  senderId: currentUser.uid,
                  date: Timestamp.now(),
                  img: downloadURL,
                });
  
                resolve();
              } catch (error) {
                reject(error);
              }
            }
          );
        });
      } else {
        messages.push({
          id: uuid(),
          text,
          senderId: currentUser.uid,
          date: Timestamp.now(),
        });
      }
  
      await updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion(...messages),
      });
  
      /* Create the last message section in userChats, which consists of the latest text. */
      await updateDoc(doc(db, "userChats", currentUser.uid), {
        [data.chatId + ".lastMessage"]: {
          text,
        },
        [data.chatId + ".date"]: serverTimestamp(),
      });
  
      await updateDoc(doc(db, "userChats", data.user.uid), {
        [data.chatId + ".lastMessage"]: {
          text,
        },
        [data.chatId + ".date"]: serverTimestamp(),
      });
  
      setText("");
      setImg(null);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };
  
  

  return (
    <div className="input">
      <input
        type="text"
        placeholder="Type something..."
        onChange={(e) => setText(e.target.value)}
        value={text}
      />
      <div className="send">
        {/*<img src={Attach} alt="" /> To be added :file sharing*/}
        <input
          type="file"
          style={{ display: "none" }}
          id="file"
          onChange={(e) => setImg(e.target.files[0])}/>
        <label htmlFor="file">
          <img src={Img} alt="" />
        </label>
        <button onClick={handleSend} disabled={isTextEmpty}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Input;


