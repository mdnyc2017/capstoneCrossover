import React, {Component} from 'react';
import Dropzone from 'react-dropzone';
import sha1 from 'sha1';
import superagent from 'superagent';
import {db} from '../fire';
import { Redirect } from 'react-router'; 


export default class AddScene extends Component{
    constructor(props) {
        super();
        this.state = {
            storyId: "",
            imageUrl:"",
            image: {},
            id: '',
            user: {},
            fireRedirect: false
        }
        this.handleSubmit = this.handleSubmit.bind(this)
    }
    // componentDidMount() {
    //     db.collection('scenes').onSnapshot(snapshot => this.setState({
    //         images: snapshot.docs
    //     }))
    // }

    componentWillReceiveProps(nextProps) {
        console.log(nextProps)
        this.setState({ user: nextProps.currentUser, storyId: this.props.match.params.id });
    }

    uploadFile(files) { //plural files
        const image = files[0]; //assuming we are uploading one file at a time;

        //normally, an upload str is requested for authentication, but cloudinary deviates from the standard
        //of doing so. not good. s3 is more secure - requires authorization so more secure

        //cloudName, url, timestamp, uploadPreset will all be packaged into the upload request
        const cloudName = 'noorulain'; //uniquely identifies account

        //constant string for uploading
        //resource type can be many. image/pdf/video
        const url = 'https://api.cloudinary.com/v1_1/'+cloudName+'/image/upload'
        
        //requires a timestamp in seconds, so its necessary to divide by 1000
        const timestamp = Date.now()/1000;

        //found in settings as well
        const uploadPreset = "pvfhdtk2";

        //next create a parameter string
        //everything is in key:value pairs - it is a url param
        const paramStr = 'timestamp='+timestamp+'&upload_preset='+uploadPreset+"ZoD3Vr3GEPRLq3dZdZCaiJbuwCY"

        //next encrypt using sha1 encryption --sha1 is a function
        //this converts paramStr to sha1 signature --encrypted str is what goes to cloudinary
        //it is their form of security
        const signature = sha1(paramStr);

        //prepare jSon with params

        const params = {
            'api_key': "493184569883823",
            'timestamp' : timestamp,
            'upload_preset': "pvfhdtk2",
            'signature' : signature
        }

        //********************READY TO UPLOAD FILE USING ABOVE INFORMATION **********************/
        //i am using superagent because i was having difficulty using axios
        //superagent documentation isn't difficult to understand 
        //https://visionmedia.github.io/superagent/ ---reference if notes aren't clear

        let uploadRequest = superagent.post(url); //request made
        //cloudinary requirement to name the file 'file'
        //key has to be file and the value is an image
        uploadRequest.attach('file', image) // upload file //attach is specific to superagent

        //for every upload request, we are sending the key:value from params -- 
        //loop created in the event we decide to allow users to upload multiple images.
        Object.keys(params).forEach((key) => {
            uploadRequest.field(key, params[key]) //field is specific to superagent
        })

        
        uploadRequest.end((err, resp) => { //'end' sends the request
            if(err){
                console.log(err, null)
                return
            }
            const url = resp.body.url
            const ind = url.indexOf('upload/')
            const newUrl = url.slice(0,ind+7) + 'w_800/e_cartoonify/' + url.slice(ind+7)
            this.setState({
                imageUrl: newUrl
            })
        })
    }

    // db.collection('scenes').doc().set({
    //     imageUrl: this.state.imageUrl
    // })

    handleSubmit() {
        const user = this.state.user
        const key = `${user.user.uid}${Date.now()}`
        const storyId = this.state.storyId
        const imageUrl = this.state.imageUrl
        this.setState({id: key})
        db.collection('scenes').doc(key).set({
            imageUrl
        })
        .then(function() {
            db.collection("stories").doc(storyId).collection("scenes").doc(key).set({
                imageUrl,
                id: key
            })
            .then(function() {
                console.log("Scene successfully added to story!");
                db.collection("stories").doc(storyId).update({thumbnail: imageUrl})
                .then(function() {
                    console.log("Thumbnail successfully added to story!")
                })
                .catch(function(error) {
                    console.error("Error adding story thumbnail: ", error);
                })
            })
            .catch(function(error) {
                console.error("Error adding scene to story: ", error);
            });
        })
        .catch(function(error) {
            console.error("Error creating scene: ", error);
        });
        this.setState({fireRedirect: true})
        alert('image submitted!')
    }

    render() {
        const image = this.state.imageUrl;
        const { fireRedirect } = this.state
        return (
            <div>
                <div>
                    <img src={image} /> 
                </div>
                {
                    image ? <button onClick={this.handleSubmit}>Save Image</button> : <div><h1>Image goes here!</h1><Dropzone 
                    onDrop={this.uploadFile.bind(this)}/> </div>
                }
                {   fireRedirect && (
                    <Redirect to={`/stories/${this.state.storyId}`} />
                )}
            </div>
        )
    }
}