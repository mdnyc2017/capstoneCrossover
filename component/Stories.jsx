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

    this.setStateToStories = this.setStateToStories.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    let self = this;

    let getCurrentUser = function() {
      return new Promise((resolve, reject) => {
        console.log("getCurrentUser", nextProps.currentUser)
        return resolve(nextProps.currentUser.uid)
      })
    }

    let getUserStories = function(id) {
      return new Promise((resolve, reject) => {
        console.log("getUserStories", id)
        let stories = []
        return resolve(db.collection('users').doc(id).collection('stories')
        .get()
        .then((snapshot) => {
          snapshot.forEach(doc => {
            stories.push(doc.data())
          })
          return stories;
        }))
      })
    }

    let getStories = function(stories) {
      return new Promise((resolve, reject) => {
        console.log("getStories", stories)
        let filteredStories = stories.filter(story => story.id)
        console.log("filteredStories", filteredStories)
        let userStories = [];
        filteredStories.map(story => {
          db.collection('stories').where('id', '==', story.id)
          .get()
          .then((snapshot) => {
            snapshot.forEach(doc => {
              userStories.push(doc.data())
            })
          })
        })
        return resolve(userStories)
      })
    }

    if(self.state.isMounted) {
      getCurrentUser().then(function(id) {
        return getUserStories(id)
      })
      .then(function(stories) {
        return getStories(stories)
      })
      .then(function(stories) {
        return self.setStateToStories(stories)
      })
    }
    
  }

  setStateToStories(stories) {
    console.log("stories last", stories)
    if(this.refs.myRef) {
      this.setState({stories})
    }
  }

  render() {
    console.log("state", this.state.stories);

    // if (!this.state.stories.length) return <h1 className="stories-title">Loading...</h1>;

    return (
      <div className="stories">
        <h1 className="stories-title">Your Stories</h1>
        <div className="stories-container">
          {this.state.stories.map(story => {
            console.log("story", story);
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
