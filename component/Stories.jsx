import React, {Component} from 'react';
import {db} from '~/fire';

export default class Stories extends Component {
    constructor(props) {
        super();
        this.state = {
            user: {},
            stories: []
        }
    }
    
    componentDidMount() {
        db.collection('stories').onSnapshot(snapshot => this.setState({stories: snapshot.docs}))
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ user: nextProps.currentUser });  
      }

    render() {
        if (!this.state.stories) return 'Loading...';
        return this.state.stories.map(snapshot => 
        <div key={snapshot.data().id}><a href={`/stories/${snapshot.data().id}`}><h2>{snapshot.data().title}</h2></a><p>{snapshot.data().description}</p></div>)
    }
}

