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
        return this.state.stories.map(snapshot => <pre>Story: {JSON.stringify(snapshot.data(), 0, 2)}</pre>)
    }
}

