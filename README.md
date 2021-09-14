# Firebase React Chat Workshop

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Getting Started

### Install the project dependencies

```sh
npm install
```

### Create a Firebase project

- Create a new Firebase project
  - Visit the [Firebase Console](https://console.firebase.google.com/) and click **Add Project**, then select or enter a **Project Name**.
- Add Firebase authentication using the web user interface
- Add Firebase FireStore using the web user interface
  - **NOTE**: Do not add Firebase Realtime Database, as we will not be using that
- Upgrade to the Blaze plan to enable Firebase hosting
  - Add credit card
  - Add a budget alert to prevent unexpected charges
- Initialize the Firestore project within this directory using the Firebase tools CLI
  - Install the Firebase Tools Command Line Interface (CLI)
  - Login to Firebase
  - Remove the existing `.firebaserc` configuration file
  - Run Firebase Init
  - Select the following services for inclusion in the project.
    - Firebase Authentication
    - Firebase FireStore
    - Firebase Hosting
    - Firebase Functions
  - Choose to use an existing project for your application and select the project you just created using the web interface.


## Walk Through

### Code steps

#### Add the config data

Replace the existing values within the `firebase.initializeApp({...})` with the configuration values from your project.

If you need cannot find those configuration values, check out this [help article from Google](https://firebase.google.com/docs/web/setup#add-sdks-initialize).

Your code should look something like this when you are finished.

```js
firebase.initializeApp({
  apiKey: "AIzaSyDQE4zwXhARxNdfWJY591jlqa2JTlZMI1Y",
  authDomain: "fir-react-chat-workshop.firebaseapp.com",
  projectId: "fir-react-chat-workshop",
  storageBucket: "fir-react-chat-workshop.appspot.com",
  messagingSenderId: "239064656534",
  appId: "1:239064656534:web:39cad15580f08da026b0b7",
  measurementId: "G-3TR24THQ57",
});
```
#### Connect the useAuthState hook to listen for signed in user

Within the `<App />` component, use the `useAuthState()` function to listen for changes to a logged in user.

```jsx
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

      <section>{/* check if a user is signed-in */}</section>
    </div>
  );
}
```

#### Check if the current user is authenticated

Within the `<App />` component, use the `auth` value and the `useAuthState()` hook to determine if the current user has signed in to the application or not.

Your code should look something like this when finished.

```jsx
return (
    <div className="App">
      <header>
        <h1>React Firebase Chat</h1>
        <SignOut />
      </header>

      <section>{user ? <ChatRoom /> : <SignIn />}</section>
    </div>
  );
```

#### Have the SignIn component log in the user

Within the `<SignIn />` component, make sure to initialize a GoogleAuthProvider, and then pass that provider to the `auth.signInWithPopup()` function.

Your code should look like this

```jsx
function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  };

  return <button onClick={signInWithGoogle}>Sign in with Google</button>;
}
```

#### Create a component to sign out the user

Create a component named `<SignOut />` that will sign 

```jsx
function SignOut() {
  return (
    auth.currentUser && <button onClick={() => auth.signOut()}>Sign Out</button>
  );
}
```

#### Create a ChatRoom component to listen for messages

We will need a component that listens for changes in the `messages` collection within the FireStore database. This will require a reference to the `messages` collection, a query to listen to changes for, and a react hook called `useCollectionData` that updates a list of messages based on changes to the `messages` collection.

The code should look like the following.

```jsx
function ChatRoom() {
  const messagesRef = firestore.collection("messages");
  const query = messagesRef.orderBy("createdAt").limit(25);
  
  const [messages] = useCollectionData(query, { idField: "id" });
  
  return (
    <>
      <main>
      { /* the message components will go in here later */}
      </main>
    </>
  );
}
```

#### Setup a listener on the form input

Update the `<ChatRoom />` component so that there is a `<form>` below the list of messages and when the input value changes in the `<form />` component a React hook is fired to keep track of the value for creating new messages.

To do that you will first need to add the form to the `return` value of the `<ChatRoom />` component. Add the code in the block below beneath the `<main />` component in the `<ChatRoom />`

```jsx
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
```

After adding the code in the block above your `<ChatRoom />` component should look like the following.

```jsx
function ChatRoom() {
  const messagesRef = firestore.collection("messages");
  const query = messagesRef.orderBy("createdAt").limit(25);
  
  const [messages] = useCollectionData(query, { idField: "id" });
  const [formValue, setFormValue] = useState('');
  
  return (
    <>
      <main>
        { /* the messages will go in here */}
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
```

#### Create a function to handle submission of new messages

When a user types a message into the message form and clicks 'Submit' then the message should be added to the `messages` collection.

Add the following function within the `<ChatRoom />` component, after the initialization of hooks, but before the `return ()` keyword.

```jsx
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
```

The `<ChatRoom />` component should look like the following code after the function has been added.

```jsx
function ChatRoom() {
  const messagesRef = firestore.collection("messages");
  const query = messagesRef.orderBy("createdAt").limit(25);
  
  const [messages] = useCollectionData(query, { idField: "id" });
  const [formValue, setFormValue] = useState('');
  
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
        { /* the messages will go in here */ }
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
```

#### Show the recent messages in the ChatRoom

Within the `<main>` element of the `<ChatRoom />` component, get the most recent twenty five messages and display them in order of creation descending from oldest to newest.

```jsx
<main>
  {messages &&
    messages.map((message) => (
      <ChatMessage key={message.id} message={message} />
    ))}
  <span ref={dummy}></span>
</main>
```

The `<ChatRoom />` component should look like the following after making the change.

```jsx
unction ChatRoom() {
  const messagesRef = firestore.collection("messages");
  const query = messagesRef.orderBy("createdAt").limit(25);
  
  const [messages] = useCollectionData(query, { idField: "id" });
  const [formValue, setFormValue] = useState('');
  
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
        { /* the most recent messages are displayed below */}
        {messages &&
          messages.map((message) => (
            { /* we will need to create the ChatMessage comonent next */ }
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
```

#### Create a Message component to display the message data

For every message in the database, we will need to get the data about the message, and then create a component with that data. The component should look like the following.

```jsx
function ChatMessage(props) {
  return (
    <div>
      <p>{ /* message text will go in here */ }</p>
    </div>
  );
}
```

Within the `<Message />` component we need to get the details about the message and use it to fill out the rest of the component for display. The message should be styled differently if it was sent by the currently signed in user, and so we will check the message creator and then change the `className` attribute based on that information.

We also want a profile picture of the user who submitted the message, and we can get that information from the `auth.currentUser` after a user has signed in.

After making the changes, the `<ChatMessage />` code should look like the following.

```jsx
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
```

#### Auto scroll to the most recent message

When new messages are added to the database, they will be added to the bottom of the `<ChatRoom />` component. This means that they will not be visible if there are many other messages on the page, without scrolling down to see them. In order to show new messages automatically, we keep track of the bottom of the messages and scroll down to see it.

This can be done by adding an invisible element to the page, and then listening to new messages coming into the application. This can be done within the `<ChatRoom />` component.

We can use a React hook known as `useEffect`, and another hook known as `useRef` to achieve this auto-scrolling goal.

Change the `<ChatRoom />` component by adding the following code after the React hook initialization, but before the `sendMessage` form input handler function.

```jsx
const dummy = useRef();

useEffect(() => {
  dummy.current.scrollIntoView({
    behavior: 'smooth',
  })
}, [messages]);
```

Also change the `return()` of the `<ChatRoom />` component to include an empty element with a reference to the `dummy` variable created by `useRef()`.

```jsx
return (
<main>
  {messages &&
    messages.map((message) => (
      <ChatMessage key={message.id} message={message} />
    ))}
  { /* add the element below */}
  <span ref={dummy}></span>
</main>
```

When you finish the changes above, the `<ChatRoom />` component should look like the following code.

```jsx
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
```

## Bonus challenges
- Change the "auto-scroll" to be disabled if the user scrolls up to older messages
- Load older messages on scroll-up
- How would you create additional chat-rooms
- How would you create private chat-rooms

## Available NPM Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
