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
  
  componentDidMount(props) {
    
    // db
    //   .collection("stories")
    //   .where('userId', '==', this.state.userId)
    //   .onSnapshot(snapshot => this.setState({ 
    //     stories: snapshot.docs, 
    //   }));
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
    
    return this.state.stories.map(story => {
      let id = story.data().id;
      let thumbnail = story.data().thumbnail || "/default.png"; //default image if no scenes exist

      return (
        <div className="story-list" key={id}>
          <a href={`/stories/${id}`}>
            <img className="story-thumbnail" src={thumbnail} width="300px" />
          </a>
          <div className="story-content">
            <h2 className="story-title">
          <a href={`/stories/${id}`}>
            {story.data().title}
          </a>
            </h2>
            <p className="story-description">{story.data().description}</p>
          </div>
        </div>
      );
    });
  }
}
