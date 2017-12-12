import React, { Component } from "react";
import firebase, { db, auth } from "~/fire";
import storyService from '../lib/story-service'


export default class Stories extends Component {
  constructor(props) {
    super();
    this.state = {
      stories: []
    };
  }

  async componentWillReceiveProps(nextProps) {
    const currentUser = await (nextProps.currentUser.user.uid)
    const stories = await storyService.getStoriesByUser(currentUser)
    this.setState({
      ...this.state,
      stories
    })
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
