import React, {Component} from 'react';
import {db} from '~/fire';

export default class SingleStory extends Component {
    constructor(props) {
        super();
        //state is composed of current user, current story, and story's scenes
        this.state = {
            user: {},
            storyId: '',
            scenes: []
        }
    }
    
    componentDidMount() {
        //we set the storyId on state to the params(URL) --didn't test yet
        this.setState({storyId: this.props.match.params.id})

        //we set the scenes on state to the story's scenes --didn't test
        db.collection('stories').doc(storyId).collection('scenes').onSnapshot(snapshot => this.setState({scenes: snapshot.docs}))
    }

    componentWillReceiveProps(nextProps) {
        //we set the user on state to the current user
        this.setState({ user: nextProps.currentUser });  
    }

    render() {
        //just rendering something for now
        return (<div>SingleStory stuff goes here</div>)
    }
}

