import React, {Component} from 'react';
import {db} from '~/fire';

export default class Stories extends Component {
    constructor(props) {
        super();
        this.state = {
            user: {},
            stories: [],
            scenes: []
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
        return this.state.stories.map(story => {
            let id = story.data().id;
            let thumbnail = story.data().thumbnail || '/default.png';

            return (<div className="story-thumbnail" key={id}>
            <img src={thumbnail} width="300px" />
            <a href={`/stories/${id}`}>
                <h2>{story.data().title}</h2>
            </a>
            <p>{story.data().description}</p>
        </div>)
        })
        
    }
}

// <img src={`/stories/${snapshot.data().scenes[0].imageUrl}`} width="300px" />