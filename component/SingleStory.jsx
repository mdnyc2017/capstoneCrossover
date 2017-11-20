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
        db.collection('stories').doc(this.props.match.params.id).collection('scenes')
        .onSnapshot(snapshot => this.setState({
            scenes: snapshot.docs
        }))
                
        db.collection('stories').doc(this.props.match.params.id)
        .onSnapshot(snapshot => this.setState({
            storyTitle: snapshot.data().title,
            storyDescription: snapshot.data().description
        }))
    }

    componentWillReceiveProps(nextProps) {
        //we set the user on state to the current user & the storyId to the id in the URL path
        this.setState({ user: nextProps.currentUser, storyId: this.props.match.params.id });

        db.collection('stories').doc(this.props.match.params.id).collection('scenes')
        .onSnapshot(snapshot => this.setState({
            scenes: snapshot.docs
        }))
        
        db.collection('stories').doc(this.props.match.params.id)
        .onSnapshot(snapshot => this.setState({
            storyTitle: snapshot.data().title,
            storyDescription: snapshot.data().description
        }))
    }

    render() {
        return (<div>
            <h4>{this.state.storyTitle}</h4>
            <p>{this.state.storyDescription && this.state.storyDescription}</p>
            <div>{this.state.scenes.map(scene => <div key={scene.data().id}><img src={scene.data().imageUrl} /></div>
            )}</div>
        </div>)
    }
}

