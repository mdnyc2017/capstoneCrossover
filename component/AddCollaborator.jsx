import React, { Component } from "react";
import firebase, { db } from "~/fire";
import { Redirect } from "react-router";

export default class AddStory extends Component {
  constructor(props) {
    super();
    this.state = {
      collaborator: [], //ID of the collaborator
      user: {}, //current logged in user
      storyId: "", 
      collaboratorEmail: "", //email field input
      fireRedirect: false //sets to true after submit to allow redirect
    };
    this.handleChangeEmail = this.handleChangeEmail.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ user: nextProps.currentUser, storyId: this.props.match.params.id });
  }

  handleChangeEmail(event) {
    //Changes the state's collaboratorEmail as user types
    this.setState({ collaboratorEmail: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();

    // const email = event.target.email.value;
    const uid = firebase.auth().currentUser.uid

    //then:
    db.collection('users').where('email', '==', this.state.collaboratorEmail).onSnapshot(snapshot => this.setState({ 
        collaborator: snapshot.docs
      }))
    //save collaborator in stories collection in db
    .then(() =>
        db
        .collection("stories")
        .doc(this.state.storyId)
        .collection("collaborators")
        .doc(this.state.collaborator[0].data().userId)
        .set({
        id: this.state.collaborator[0].data().userId,
        isOwner: false
        })
    )
    //save collaborator in user > stories collection in db
    .then(() =>
        db
          .collection("users")
          .doc(uid)
          .collection("stories")
          .doc(this.state.storyId)
          .collection("collaborators")
          .doc(this.state.id)
          .set({
            id: this.state.id,
            isOwner: false
          })
      )
      //Finally we set redirect to true (redirect happens in render below if fireRedirect on state is true)
      .then(() => this.setState({ fireRedirect: true }))
      .catch(error => console.error("Error adding collaborator: ", error));
  }

  render() {
    //Grab current status of fireRedirect (true or false)
    const { fireRedirect } = this.state;

    return (
      <div className="add-collaborator">
        <form className="add-collaborator-form" onSubmit={this.handleSubmit}>
          <div className="add-collaborator-form-group">
            <label htmlFor="name">
              <h2>Add a Story</h2>
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
