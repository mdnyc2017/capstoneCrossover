import sceneService from '../scene-service'

function makeStoryService(userCollection) {
    return {
        getStoriesByUser
    }

    //want to send back stories the user is associated with including those
    //the user has collaborated on.

    async function getStoriesByUser(userId) {
        const snapshot = await userCollection.doc(userId).collection("stories").get()
        const userStories = await snapshot.docs.map(item => item.data());
        //map over userstories.id to query the stories collection to get stories that the user has also collaborated on.
        const allStories = userStories.map(story => (
            sceneService.getScenesByStoryId(story.id)
        ));
        const resolvedStoryPromises = await Promise.all(allStories);
        const finalStories = await resolvedStoryPromises.map(story => story[0]);
        return finalStories;
    }
}

export default makeStoryService