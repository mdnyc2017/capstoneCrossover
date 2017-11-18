import React, {Component} from 'react';
import {db} from '~/fire';
import { Redirect } from 'react-router';

export default class AddStory extends Component {
    constructor(props) {
        super();
        this.state = {
            id: '',
            user: {},
            titleInput: '',
            descriptionInput: '',
            fireRedirect: false
        }
        this.handleChangeTitle = this.handleChangeTitle.bind(this);
        this.handleChangeDescription = this.handleChangeDescription.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    // componentDidMount() {
    //     db.collection('stories').onSnapshot(snapshot => this.setState({stories: snapshot.docs}))
    // }

    componentWillReceiveProps(nextProps) {
        this.setState({ user: nextProps.currentUser });  
    }

    handleChangeTitle(event) {
        this.setState({titleInput: event.target.value})
    }

    handleChangeDescription(event) {
        this.setState({descriptionInput: event.target.value})
    }

    handleSubmit(event) {
        const user = this.state.user;
        const title = event.target.title.value;
        const description = event.target.description.value;
        const key = `${user.user.uid}${Date.now()}`
        this.setState({id: key});

        event.preventDefault();
        //save story to stories
        db.collection("stories").doc(key).set({
            id: key,
            title: title,
            description: description
        })
        .then(function() {
            console.log("Story successfully created!", user.user.uid);
            //save story to user
            db.collection("users").doc(user.user.uid).collection("stories").doc(key).set({
                id: key,
                title: title,
                description: description
            })
            .then(function() {
                console.log("Story successfully added to user!");
            })
            .catch(function(error) {
                console.error("Error adding story to user: ", error);
            });
        })
        .catch(function(error) {
            console.error("Error creating story: ", error);
        });
        this.setState({ fireRedirect: true })
        console.log("addstory user Id from state*****", this.state.user)
    }

    render() {
        // const { from } = this.props.location || '/stories/new'
        const { fireRedirect } = this.state
        
        return (<div className="add-story-main">
        <form className="add-story-form" onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label htmlFor="name"><h2>Add a Story</h2></label>
            <input
              value={this.state.titleInput}
              onChange={this.handleChangeTitle}
              className="form-control"
              type="text"
              name="title"
              placeholder="Enter a title"
              required={true}
            />
            <input
            value={this.state.descriptionInput}
            onChange={this.handleChangeDescription}
            className="form-control"
            type="text"
            name="description"
            placeholder="Enter a story description (optional)"
            />
          </div>
          <div className="form-group">
            <button type="submit" className="button-main">Create Story</button>
          </div>
        </form>
        {fireRedirect && (
            <Redirect to={`/stories/${this.state.id}`}/>
          )}
    </div>)
    }
}

