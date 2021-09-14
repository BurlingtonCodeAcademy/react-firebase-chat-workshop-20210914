import React, { useEffect, useRef, useState } from "react";
import "./App.css";

import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";

firebase.initializeApp({
  apiKey: "AIzaSyDQE4zwXhARxNdfWJY591jlqa2JTlZMI1Y",
  authDomain: "fir-react-chat-workshop.firebaseapp.com",
  projectId: "fir-react-chat-workshop",
  storageBucket: "fir-react-chat-workshop.appspot.com",
  messagingSenderId: "239064656534",
  appId: "1:239064656534:web:39cad15580f08da026b0b7",
  measurementId: "G-3TR24THQ57",
});

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {
  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header>
        <h1>React Firebase Chat</h1>
        <SignOut />
      </header>

      <section>{user ? <ChatRoom /> : <SignIn />}</section>
    </div>
  );
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  };

  return <button onClick={signInWithGoogle}>Sign in with Google</button>;
}

function SignOut() {
  return (
    auth.currentUser && <button onClick={() => auth.signOut()}>Sign Out</button>
  );
}

function ChatRoom() {
  const messagesRef = firestore.collection("messages");
  const query = messagesRef.orderBy("createdAt").limit(25);
  
  const [messages] = useCollectionData(query, { idField: "id" });
  const [formValue, setFormValue] = useState('');
  
  const dummy = useRef();
  useEffect(() => {
    dummy.current.scrollIntoView({
      behavior: 'smooth',
    })
  }, [messages]);

  const sendMessage = async(e) => {
    e.preventDefault();

    const { uid, photoURL, displayName, email } = auth.currentUser;

    await messagesRef.add({
      text: formValue,  
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL,
      displayName,
      email
    })

    setFormValue('')
  }

  return (
    <>
      <main>
        {messages &&
          messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
        <span ref={dummy}></span>
      </main>
      <form onSubmit={sendMessage}>
        <input
          type="text"
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
          placeholder="Your message here..."
        />
        <button type="submit" disabled={!formValue}>
          Submit
        </button>
      </form>
    </>
  );
}

function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? "sent" : "received";

  return (
    <div className={`message ${messageClass}`}>
      <img
        src={photoURL || "https://ui-avatars.com/api/?name=Anonymous+User"}
        alt="The user's profile"
      />
      <p>{text}</p>
    </div>
  );
}


export default App;
