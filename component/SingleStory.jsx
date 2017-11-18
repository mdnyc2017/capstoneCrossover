import React, {Component} from 'react';
import {db} from '~/fire';

export default class SingleStory extends Component {
    constructor(props) {
        super(props);
        //state is composed of current user, current story, and story's scenes
        this.state = {
            user: {},
            storyId: '',
            storyTitle: '',
            storyDescription: '',
            scenes: []
        }
    }
    
    componentDidMount() {
        //we set the scenes on state to the story's scenes --didn't test
        // this.state.storyId && db.collection('stories').doc(this.state.storyId).collection('scenes').onSnapshot(snapshot => this.setState({scenes: snapshot.docs}))

        // this.state.storyId && db.collection('stories').doc(this.state.storyId).onSnapshot(snapshot => this.setState({storyTitle: snapshot.title, storyDescription: snapshot.description }))
    }

    componentWillReceiveProps(nextProps) {
        //we set the user on state to the current user & the storyId to the URL id
        this.setState({ user: nextProps.currentUser, storyId: this.props.match.params.id });

        db.collection('stories').doc(this.props.match.params.id).collection('scenes').onSnapshot(snapshot => {
            console.log("this happened", snapshot.docs);
            this.setState({scenes: snapshot.docs})})
        
        db.collection('stories').doc(this.props.match.params.id).onSnapshot(snapshot => this.setState({storyTitle: snapshot.data().title, storyDescription: snapshot.data().description }))
    }

    render() {
        //just rendering something for now
        this.state.scenes.map(scene => console.log(scene.data()));
        return (<div>
            <div>{"storyID: " + this.state.storyId + ", title: " + this.state.storyTitle + ", description: " + this.state.storyDescription}</div>
            <h4>Scene imageURLS:</h4>
            <div>{this.state.scenes.map(scene => scene.data().imageUrl)}</div>
        </div>)
    }
}

