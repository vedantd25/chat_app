import {
  createContext,
  useContext,
  useReducer,
} from "react";
import { AuthContext } from "./AuthContext";

export const ChatContext = createContext();
export const ChatContextProvider = ({ children }) => {
  const { currentUser } = useContext(AuthContext);
  const INITIAL_STATE = {
    chatId: "null",
    user: {},//user to be searched
  };

  const chatReducer = (state, action) => {
    switch (action.type) {
      case "CHANGE_USER"://change from user we were currently chatting with to the searched user once currentUser clicks on the result of the searched user(?)
        return {
          user: action.payload,//payload is the data which will be received when dispatch function is called.Done in the Chats component in the handleSelect() function
          chatId://chatId is the concatenation of id of current user and searched user,same as combinedId
            currentUser.uid > action.payload.uid
              ? currentUser.uid + action.payload.uid
              : action.payload.uid + currentUser.uid,
        };

      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);

  return (
    <ChatContext.Provider value={{ data:state, dispatch }}>
      {children}
    </ChatContext.Provider>
  );
};
