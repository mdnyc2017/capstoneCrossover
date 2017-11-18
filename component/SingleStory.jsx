import React, {Component} from 'react';
import {db} from '~/fire';

export default class SingleStory extends Component {
    constructor(props) {
        super();
        this.state = {
            user: {},
            storyId: '',
            scenes: []
        }
    }
    
    componentDidMount() {
        this.setState({storyId: this.props.match.params.id})

        db.collection('stories').doc(storyId).collection('scenes').onSnapshot(snapshot => this.setState({scenes: snapshot.docs}))
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ user: nextProps.currentUser });  
      }

    render() {
        return (<div>SingleStory stuff goes here</div>)
    }
}

