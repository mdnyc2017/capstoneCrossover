import React, {Component} from 'react';
import {db} from '~/fire';
import { Redirect } from 'react-router'; //allows us to redirect after submit

export default class AddStory extends Component {
    constructor(props) {
        super();
        this.state = {
            id: '', //unique ID of the current story (see key in handleSubmit)
            user: {}, //current logged in user
            titleInput: '', //title field input
            descriptionInput: '', //description field input
            fireRedirect: false //sets to true after submit to allow redirect
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
        //changes the state's titleInput as user types
        this.setState({titleInput: event.target.value})
    }

    handleChangeDescription(event) {
        //changes the state's descriptionInput as user types
        this.setState({descriptionInput: event.target.value})
    }

    handleSubmit(event) {
        event.preventDefault();
        //defining our data that we want to submit to the db
        const user = this.state.user;
        const title = event.target.title.value;
        const description = event.target.description.value;
        const key = `${user.user.uid}${Date.now()}` //creates a unique ID because it's the user's id + the current time in unix code. The reason for setting this here is so that we can redirect to "/stories/key" and we already have the key available to us, rather than letting the DB create an ID for us
        this.setState({id: key}); //we also set the state to the key
        //only one setState per function.
        
        //save story to stories collection in db
        db.collection("stories").doc(key).set({
            id: key,
            title: title,
            description: description
        })
        .then(function() {
            console.log("Story successfully created!", user.user.uid);

            //save story to user>stories collection in db
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

        //finally we set redirect to true (redirect happens in render below if fireRedirect on state is true)
        this.setState({ fireRedirect: true })
        console.log("addstory user Id from state*****", this.state.user)
    }

    render() {
        //grab current status of fireRedirect (true or false)
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
            <Redirect to={`/stories/${this.state.id}`} />
          )}
    </div>)
    }
}

