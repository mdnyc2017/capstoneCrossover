import React, { Component } from "react";
import firebase, { db } from "~/fire";
import { Redirect } from "react-router";

export default class AddStory extends Component {
  constructor(props) {
    super();
    this.state = {
      emailInput: "", //email field input
      user: {}, //current logged in user
      storyId: "", 
      email: "", //email of collaborator
      id: "", //firestore id of collaborator
      fireRedirect: false //sets to true after submit to allow redirect
    };
    this.handleChangeEmail = this.handleChangeEmail.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ user: nextProps.currentUser, storyId: this.props.match.params.id });
  }

  handleChangeEmail(event) {
    //Changes the state's email as user types
    this.setState({ emailInput: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();

    const email = this.state.emailInput.toLowerCase();
    const uid = firebase.auth().currentUser.uid

    let findorCreateUser = new Promise((resolve, reject) => {
      //find or create user in users
      return db
      .collection('users')
      .where('userEmail', '==', email)
      .onSnapshot(snapshot => {
        if (snapshot.docs.length) {
          this.setState({email: snapshot.docs[0].data().userEmail, id: snapshot.docs[0].data().uid})
        } else {
          db.collection('users').doc(email).set({userEmail: email})
          this.setState({email, id: email})
        }
      })
    })

    let saveToStories = new Promise((resolve, reject) => {
      //save collaborator in stories collection in db
      return db
      .collection("stories")
      .doc(this.state.storyId)
      .collection("collaborators")
      .doc(email)
      .set({
      userEmail: email,
      isOwner: false,
      storyId: this.state.storyId
      })
    })

    let saveToUsers = new Promise((resolve, reject) => {
    //save collaborator in user > stories collection in db
      return db
      .collection("users")
      .doc(uid)
      .collection("stories")
      .doc(this.state.storyId)
      .collection("collaborators")
      .doc(email)
      .set({
        userEmail: email,
        isOwner: false,
        storyId: this.state.storyId
      })
    })

    // let addtoUserStories = new Promise((resolve, reject) => {
    // //save story to user's stories
    //   return db
    //   .collection("users")
    //   .doc(email)
    //   .collection("stories")
    //   .doc(this.state.storyId)
    //   .set({
    //     id: this.state.storyId
    //   })
    // })

    let redirect = new Promise((resolve, reject) => {
    //Finally we set redirect to true (redirect happens in render below if fireRedirect on state is true)
        this.setState({ fireRedirect: true })
    })

    Promise.all([findorCreateUser, saveToStories, saveToUsers, redirect])
  }

  render() {
    //Grab current status of fireRedirect (true or false)
    const { fireRedirect } = this.state;

    return (
      <div className="add-collaborator">
        <form className="add-collaborator-form" onSubmit={this.handleSubmit}>
          <div className="add-collaborator-form-group">
            <label htmlFor="name">
              <h2>Add a Collaborator</h2>
            </label>
            <input
              value={this.state.collaboratorEmail}
              onChange={this.handleChangeEmail}
              className="add-collaborator-form-control"
              type="text"
              name="email"
              placeholder="Enter an email address"
              required={true}
            />
          </div>
          <div className="add-collaborator-form-group">
            <button type="submit" className="button-main">
              Add Collaborator
            </button>
          </div>
        </form>
        {fireRedirect && <Redirect to={`/stories/${this.state.storyId}`} />}
      </div>
    );
  }
}
