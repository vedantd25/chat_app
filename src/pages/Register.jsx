import React, { useState } from "react";
import Add from "../img/addAvatar.png";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db, storage } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const file = e.target[3].files[0]; // File input element

    try {
      // Create user
      const res = await createUserWithEmailAndPassword(auth, email, password);

      // Upload image and get download URL
      const date = new Date().getTime();
      const storageRef = ref(storage, `${displayName}_${date}_${file.name}`);

      await uploadBytesResumable(storageRef, file).then(async () => {
        const downloadURL = await getDownloadURL(storageRef);

        // Update user profile with displayName and photoURL
        await updateProfile(res.user, {
          displayName,
          photoURL: downloadURL,
        });

        // Create user document in Firestore
        await setDoc(doc(db, "users", res.user.uid), {
          uid: res.user.uid,
          displayName,
          email,
          photoURL: downloadURL,
        });

        // Create empty user chats document in Firestore
        await setDoc(doc(db, "userChats", res.user.uid), {});

        // Navigate to home page after successful registration
        navigate("/");
      });
    } catch (err) {
      console.error("Error registering user:", err.message);
      setErr(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="logo">V Chat</span>
        <span className="title">Register</span>
        <form onSubmit={handleSubmit}>
          <input required type="text" placeholder="Display Name" />
          <input required type="email" placeholder="Email" />
          <input required type="password" placeholder="Password" />
          <input required style={{ display: "none" }} type="file" id="file" />
          <label htmlFor="file">
            <img src={Add} alt="" />
            <span>Add an avatar</span>
          </label>
          <button disabled={loading}>Sign Up</button>
          {loading && <span>Uploading and compressing the image, please wait...</span>}
          {err && <span>Something went wrong</span>}
        </form>
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
