import sceneService from '../scene-service'

function makeStoryService(userCollection) {
    return {
        getStoriesByUser
    }

    //want to send back stories the user is associated with including those
    //the user has collaborated on.

    //userCollection = (db.collection('users'))
    async function getStoriesByUser(userId) {
        const snapshot = await userCollection.doc(userId).collection("stories").get() //all stories associateed with a user
        const userStories = await snapshot.docs.map(item => item.data()); //this has only id, descript, title
        //map over userstories.id to query the stories collection to get stories that the user has also collaborated on.
        const allStories = await Promise.all(userStories.map(story => (
            sceneService.getScenesByStoryId(story.id)
        )));
        const stories = await allStories.map(story => story[0]);
        const filteredStories = stories.filter(story => story !== undefined)
        return filteredStories;
    }
}

export default makeStoryService