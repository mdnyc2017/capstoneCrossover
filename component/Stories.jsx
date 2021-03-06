import React, { Component } from "react";
import firebase, { db, auth } from "~/fire";

let uid;
export default class Stories extends Component {
  constructor(props) {
    super();
    this.state = {
      user: {},
      stories: [],
      scenes: [],
      userId: "",
      collaborator: []
    };
  }

  componentWillReceiveProps(nextProps) {
    let self = this;

    if (nextProps.currentUser && nextProps.currentUser !== {}) {
      let getCurrentUser = function() {
        return new Promise((resolve, reject) => {
          return resolve(nextProps.currentUser.user.uid); //returns userId
        });
      };

      //returns all stories associated with the currentUser
      let getUserStories = function(id) {
        return new Promise((resolve, reject) => {
          let stories = []; //stores all stories associated with the user
          return resolve(
            db
              .collection("users")
              .doc(id)
              .collection("stories")
              .get()
              .then(snapshot => {
                snapshot.forEach(doc => {
                  stories.push(doc.data());
                });
                return stories;
              })
          );
        });
      };

      //returns stories within stories -- more like scenes associated with a single story
      let getStories = function(stories) {
        return new Promise((resolve, reject) => {
          let filteredStories = stories.filter(story => story.id);
          filteredStories.map(story => {
            db
              .collection("stories")
              .where("id", "==", story.id)
              .get()
              .then(snapshot => {
                snapshot.forEach(doc => {
                  self.setState({
                    stories: [...self.state.stories, doc.data()]
                  });
                });
              });
          });
        });
      };

      getCurrentUser()
        .then(function(id) {
          return getUserStories(id);
        })
        .then(function(stories) {
          return getStories(stories);
        });
    }
  }

  render() {
    return (
      <div className="stories">
        <h1 className="stories-title">Your Stories</h1>
        <div className="stories-container">
          {this.state.stories.map(story => {
            let id = story.id;
            let thumbnail = story.thumbnail || "/default.png"; //default image if no scenes exist

            return (
              <div className="stories-story" key={id}>
                <a href={`/stories/${id}`}>
                  <img className="stories-story-thumbnail" src={thumbnail} />
                </a>
                <div className="stories-story-content">
                  <h2 className="stories-story-content-title">
                    <a
                      className="stories-story-content-title"
                      href={`/stories/${id}`}
                    >
                      {story.title}
                    </a>
                  </h2>
                  <p className="stories-story-content-description">
                    {story.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
