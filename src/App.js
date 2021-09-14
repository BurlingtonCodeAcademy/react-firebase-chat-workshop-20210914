import React, { useEffect, useRef, useState } from "react";
import "./App.css";

import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";

firebase.initializeApp({
  //Add your firebase config settings here
});

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {
  // Get the user object from your firebase auth

  return (
    <div className="App">
      <header>
        <h1>React Firebase Chat</h1>
        <SignOut />
      </header>

      <section>{
        //If a user has signed in show them the chat room, otherwise show the login button
      }</section>
    </div>
  );
}

function SignIn() {
  const signInWithGoogle = () => {
    //Set up the google authentication provider
    //Set up the firebase authentication method
  };

  return <button onClick={signInWithGoogle}>Sign in with Google</button>;
}

function SignOut() {
  return (
    //If a user is signed in, allow them to sign out
  );
}

function ChatRoom() {
  //Access the firestore collection where messages are stored
  //Order the messages so the oldest are at the top
  
  //Query the database for messages
  //Use a controlled input to store message data
  
  const dummy = useRef();
  useEffect(() => {
    dummy.current.scrollIntoView({
      behavior: 'smooth',
    })
  }, [messages]);

  const sendMessage = async(e) => {
    e.preventDefault();

    //Get user data for your currently signed in user

    await messagesRef.add({
      //declare user, and message data to be written to the database
    })

    setFormValue('')
  }

  return (
    <>
      <main>
        {
          //check for messages, and display all messages in the chat window
        }
        <span ref={dummy}></span>
      </main>
      <form onSubmit={sendMessage}>
        {/*Set up the input so it is controlled by the component's state*/}
        <input />
        <button type="submit" disabled={!formValue}>
          Submit
        </button>
      </form>
    </>
  );
}

function ChatMessage(props) {
  // Get all data to display the message from props

  // Determine whether the message was sent by the currently signed in user

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
