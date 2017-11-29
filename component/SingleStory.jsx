import React, { Component } from "react";
import { db } from "~/fire";

export default class SingleStory extends Component {
  constructor(props) {
    super(props);
    //state is composed of current user, current story, and story's scenes
    this.state = {
      user: {},
      storyId: "",
      storyTitle: "",
      storyDescription: "",
      scenes: []
    };
  }

  componentDidMount() {
    console.log("this.props ", this.props)
    //Get Scenes
    db
      .collection("stories")
      .doc(this.props.match.params.id)
      .collection("scenes")
      .onSnapshot(snapshot =>
        this.setState({
          scenes: snapshot.docs
        })
      );

    //Get Story info
    db
      .collection("stories")
      .doc(this.props.match.params.id)
      .onSnapshot(snapshot =>
        this.setState({
          storyTitle: snapshot.data().title,
          storyDescription: snapshot.data().description
        })
      );
  }

  componentWillReceiveProps(nextProps) {
    console.log("nextProps ", nextProps)
    //We set the user on state to the current user & the storyId to the id in the URL path
    this.setState({
      user: nextProps.currentUser,
      storyId: this.props.match.params.id
    });

    //Get Scenes
    db
      .collection("stories")
      .doc(this.props.match.params.id)
      .collection("scenes")
      .onSnapshot(snapshot =>
        this.setState({
          scenes: snapshot.docs
        })
      );

    //Get Story info
    db
      .collection("stories")
      .doc(this.props.match.params.id)
      .onSnapshot(snapshot =>
        this.setState({
          storyTitle: snapshot.data().title,
          storyDescription: snapshot.data().description
        })
      );
  }

  render() {
    console.log("this.props in render", this.props)
    return (
      <div className="single-story">
        <h4 className="single-story-title">{this.state.storyTitle}</h4>
        <p className="single-story-description">{this.state.storyDescription && this.state.storyDescription}</p>
        <div className="single-story-scenes">
          {this.state.scenes.map(scene => (
            <div key={scene.data().id}>
              <img className="single-story-scenes-scene" src={scene.data().imageUrl} />
            </div>
          ))}
        </div>
        <a className="single-story-add-link" href={`/stories/${this.props.match.params.id}/addscene`}>
          <div className="single-story-add">Add Scene</div>
        </a>
      </div>
    );
  }
}
