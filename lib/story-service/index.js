import "babel-polyfill"
import makeStoryService from './story-service.js'
import { db } from "~/fire";

const storyService = makeStoryService(db.collection('users'))

export default storyService