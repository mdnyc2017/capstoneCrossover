import "babel-polyfill"
import makeStoryService from './story-service.js'
import { db } from "~/fire";

const storyService = makeStoryService(db.collection('stories'))

export default storyService