File structure:
Register->Create user,Update profile,Create collections(users,userChats)
Login->Login
Search->Search user
Messages->Map through user chats

States:
AuthContext:currentUser,setCurrentUser
Register:err,setErr
Search:{username,setUsername},{user,setUser}=>
Chat:chats,setChats

Database:
userChats=>info about two users chatting(userInfo,date),the info to be shown in the sidebar
chats=>messages between two users(has messages as an array in the database,chatId==combinedId)
users=>registered users

Classes:
chatInfo:The user info(name) to be displayed on the top when you open a chat
userChat:The info to be displayed when a user is searched(image,name&last message(userChatInfo)).

Created using object.entries where the object chats was converted to an array.
chats:{
        combinedId:{
        [0]    date:{..}
        [1]    userInfo:{
           [0]     displayName:"...",
           [1]     photoURL:"...",
           [2]     uid:...
                }
            }
    }
        

chatId:chatId is the concatenation of id of current user and searched user.
combinedId:same thing.
