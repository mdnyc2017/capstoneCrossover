import "babel-polyfill"
import makeSceneService from './scene-service.js'
import { db } from "~/fire"

const sceneService = makeSceneService(db.collection('stories'))

export default sceneService