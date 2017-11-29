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
    const uid = firebase.auth().currentUser.uid;
    let self = this;

    let findUser = function() {
      return new Promise((resolve, reject) => {
        //find user in users
        let userId = "";
        return resolve(db
        .collection('users')
        .where('userEmail', '==', email)
        .get()
        .then(snapshot => {
            if (snapshot.docs[0] !== undefined) {
              console.log("findUser", snapshot.docs[0].data().uid)
              userId = snapshot.docs[0].data().uid
              return userId;
            } else {
              return undefined;
            }
        }))
      })
    }

    let saveToStories = function(id) {
      console.log("saveToStories", id)
      return new Promise((resolve, reject) => {
        //save collaborator in stories collection in db
        return resolve(db
        .collection("stories")
        .doc(self.state.storyId)
        .collection("collaborators")
        .doc(id)
        .set({
        userEmail: email,
        isOwner: false,
        storyId: self.state.storyId,
        uid: id
        })
        .then(() => id)
        )
      })
    }
    

    let saveToUsers = function(id) {
      console.log("saveToUsers", id)
      return new Promise((resolve, reject) => {
        //save collaborator in user > stories collection in db
          return resolve(db
          .collection("users")
          .doc(uid)
          .collection("stories")
          .doc(self.state.storyId)
          .collection("collaborators")
          .doc(id)
          .set({
            userEmail: email,
            isOwner: false,
            storyId: self.state.storyId,
            uid: id
          })
          .then(() => id))
        })
    }

    let addToUserStories = function(id) {
      console.log("addToUserStories", id)
      return new Promise((resolve, reject) => {
        //save story to collaborator's stories

          return resolve(db
            .collection("users")
            .doc(id)
            .collection("stories")
            .doc(self.state.storyId)
            .set({
              id: self.state.storyId
            })
            .then(() => id)
          );
        })
    } 

    let redirect = function() {
      return new Promise((resolve, reject) => {
    //Finally we set redirect to true (redirect happens in render below if fireRedirect on state is true)
        self.setState({ fireRedirect: true })
      })
    }

    findUser().then(function(id) {
      if (id !== undefined) {
        return saveToStories(id);
      } else {
        alert("Please enter an existing user, or ask your intended collaborator to create an account.")
      }
    })
    .then(function(id) {
      if (id !== undefined) {
        return saveToUsers(id);
      }
    })
    .then(function(id) {
      if (id !== undefined) {
        return addToUserStories(id);
      }
    })
    .then(function(id) {
      if (id !== undefined) {
        redirect()
      }
    })
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
