import React, { Component } from "react";
import firebase, { db, auth } from "~/fire";


export default class Stories extends Component {
  constructor(props) {
    super();
    this.state = {
      user: {},
      stories: [],
      scenes: [],
      userId: ''
    };
  }

  componentWillReceiveProps(nextProps) {
    let uid = firebase.auth().currentUser.uid

    this.setState({
      user: nextProps.currentUser,
      userId: uid
     });
  }

  render() {

    db.collection('stories').where('userId', '==', this.state.userId).onSnapshot(snapshot => this.setState({
            stories: snapshot.docs,
          }));

    if (!this.state.stories) return "Loading...";

    return (
      <div className="stories">
        <h1 className="stories-title">Your Stories</h1>
        <div className="stories-container">
          {this.state.stories.map(story => {
            let id = story.data().id;
            let thumbnail = story.data().thumbnail || "/default.png"; //default image if no scenes exist

            return (
                <div className="stories-story" key={id}>
                  <a href={`/stories/${id}`}>
                    <img className="stories-story-thumbnail" src={thumbnail} />
                  </a>
                  <div className="stories-story-content">
                    <h2 className="stories-story-content-title">
                      <a className="stories-story-content-title" href={`/stories/${id}`}>
                        {story.data().title}
                      </a>
                    </h2>
                    <p className="stories-story-content-description">{story.data().description}</p>
                  </div>
                </div>
            );
          })}
        </div>
      </div>
    )
  }
}
