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
      scenes: [],
      collaborator: {},
      collaboratorName: []
    };
  }

  componentDidMount() {
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

      // //get collaborator
      // db
      // .collection('collaborators')
      // .where('storyId', '==', this.props.match.params.id)
      // .onSnapshot( snapshot =>{
      //   this.setState({
      //     collaboratorName: snapshot.data().collabName
      //   })
      // })
  }

  componentWillReceiveProps(nextProps) {
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


      //get collaborator
      db
      .collection('stories')
      .doc(this.props.match.params.id)
      .collection('collaborators')
      .onSnapshot(snapshot =>{
        console.log('snapshot in collab call is: ', snapshot)
        this.setState({
          collaboratorName: snapshot.docs
        })
      })





      // .where('storyId', '==', this.props.match.params.id)
      // .onSnapshot( snapshot =>{
      //   console.log('in single story collab call, snapshot is:', snapshot)
      //   this.setState({
      //     collaboratorName: snapshot.data().collabName
      //   })
      // })
  }

  render() {

    return (
      <div className="single-story">

        <h4 className="single-story-title">{this.state.storyTitle}</h4>
        <p className="single-story-description">{this.state.storyDescription && this.state.storyDescription}</p>
        
        {this.state.collaboratorName.length ?
        <div className="single-story-collaborating">
          collaborating with{
            this.state.collaboratorName.map(collaborator=>(
              <div key={collaborator+Date.now()}>
               <li>{collaborator.data().collabName}</li>
              </div>

            ))}
        </div>        
        :
        <span> </span>    
        } 


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
