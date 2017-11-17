import React, {Component} from 'react';
import Dropzone from 'react-dropzone';
import sha1 from 'sha1';
import superagent from 'superagent';
import {db} from '../fire'

export default class Images extends Component{
    constructor() {
        super();
        this.state = {
            imageUrl:[],
            images: []
        }
    }
    componentDidMount() {
        db.collection('scenes').onSnapshot(snapshot => this.setState({
            images: snapshot.docs
        }))
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
            const newUrl = url.slice(0,ind+7) + 'w_300/e_cartoonify/' + url.slice(ind+7)
            this.setState({
                imageUrl: [...this.state.imageUrl, newUrl]
            })
            db.collection('scenes').doc().set({
                imageUrl: newUrl
            })
        })
    }

    render() {
        const images = this.state.images.map((image, i) => {
            return(
                <li key={i}>
                    <img src={image.data().imageUrl} />
                </li>
            )
        })
        return (
            <div>
                <h1>Images go here!</h1>
                <Dropzone 
                onDrop={this.uploadFile.bind(this)}/>
                <ol>
                    {images}
                </ol>
            </div>
        )
    }
}