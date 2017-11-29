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
    let self = this;

    if (nextProps.currentUser && nextProps.currentUser !== {} ) {
      let getCurrentUser = function() {
        return new Promise((resolve, reject) => {
          return resolve(nextProps.currentUser.uid)
        })
      }
  
      let getUserStories = function(id) {
        return new Promise((resolve, reject) => {
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
          let filteredStories = stories.filter(story => story.id)
          filteredStories.map(story => {
            db.collection('stories').where('id', '==', story.id)
            .get()
            .then((snapshot) => {
              snapshot.forEach(doc => {
                self.setState({stories: [...self.state.stories, doc.data()]})
              })
            })
          })
        })
      }

      getCurrentUser().then(function(id) {
        return getUserStories(id)
      })
      .then(function(stories) {
        return getStories(stories)
      })
    }
  }

  render() {
    console.log("state", this.state.stories);

    return (
      <div className="stories">
        <h1 className="stories-title">Your Stories</h1>
        <div className="stories-container">
          {this.state.stories.length ? this.state.stories.map(story => {
            let id = story.id;
            let thumbnail = story.thumbnail || "/default.png"; //default image if no scenes exist

            return (
                <div className="stories-story" key={id}>
                  <a href={`/stories/${id}`}>
                    <img className="stories-story-thumbnail" src={thumbnail} />
                  </a>
                  <div className="stories-story-content">
                    <h2 className="stories-story-content-title">
                      <a className="stories-story-content-title" href={`/stories/${id}`}>
                        {story.title}
                      </a>
                    </h2>
                    <p className="stories-story-content-description">{story.description}</p>
                  </div>
                </div>
            );
          }): <h1 className="stories-title">Loading...</h1>}
        </div>
      </div>
    )
  }
}
