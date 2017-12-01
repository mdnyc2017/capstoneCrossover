import React, { Component } from 'react';
import { db } from '~/fire';

export default class SingleStory extends Component {
  constructor(props) {
    super(props);
    // state is composed of current user, current story, and story's scenes
    this.state = {
      user: {},
      storyId: '',
      storyTitle: '',
      storyDescription: '',
      scenes: [],
      collaborator: {},
      collaboratorName: [],
      userName: ''
    };
  }

  componentDidMount() {
    // Get Scenes
    db
      .collection('stories')
      .doc(this.props.match.params.id)
      .collection('scenes')
      .onSnapshot(snapshot =>
        this.setState({
          scenes: snapshot.docs,
        }));

    // Get Story info
    db
      .collection('stories')
      .doc(this.props.match.params.id)
      .onSnapshot(snapshot =>
        this.setState({
          storyTitle: snapshot.data().title,
          storyDescription: snapshot.data().description,
          userName: snapshot.data().userName
        }));

  }

  componentWillReceiveProps(nextProps) {
    // We set the user on state to the current user & the storyId to the id in the URL path
    this.setState({
      user: nextProps.currentUser,
      storyId: this.props.match.params.id,
    });

    // Get Scenes
    db
      .collection('stories')
      .doc(this.props.match.params.id)
      .collection('scenes')
      .onSnapshot(snapshot =>
        this.setState({
          scenes: snapshot.docs,
        }));

    // Get Story info
    db
      .collection('stories')
      .doc(this.props.match.params.id)
      .onSnapshot(snapshot =>
        this.setState({
          storyTitle: snapshot.data().title,
          storyDescription: snapshot.data().description,
        }));


    // get collaborator
    db
      .collection('stories')
      .doc(this.props.match.params.id)
      .collection('collaborators')
      .onSnapshot((snapshot) => {
        this.setState({
          collaboratorName: snapshot.docs,
        });
      });

  }

  render() {
    return (
      <div className="single-story">

        <h4 className="single-story-title">{this.state.storyTitle}</h4>
        <p className="single-story-description">{this.state.storyDescription && this.state.storyDescription}</p>

          <div className="single-story-collaborating">
            <div className="single-story-collaborating-title" >Featuring :</div>
            <div>
              <div>{this.state.userName}</div>
            </div>
            {this.state.collaboratorName.map(collaborator => (
              <div key={collaborator.data().collabName + Date.now()}>
                <div>{collaborator.data().collabName}</div>
              </div>
            ))
            }
          </div>

        <div className="single-story-scenes">
          {this.state.scenes.map(scene => (
            <div key={scene.data().id}>
              <img className="single-story-scenes-scene" src={scene.data().imageUrl} />
            </div>
          ))}
        </div>


        <a className="single-story-add-link" href={`/stories/${this.props.match.params.id}/addscene`}>
          <div className="single-story-add">+ Add Scene</div>
        </a>
        <a className="single-story-add-link" href={`/stories/${this.props.match.params.id}/collaborate`}>
          <div className="single-story-add">+ Add A Collaborator</div>
        </a>


      </div>
    );
  }
}
