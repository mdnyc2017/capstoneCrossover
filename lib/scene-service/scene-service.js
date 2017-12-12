export default function makeSceneService(storyCollection) {
    return {
        getScenesByStoryId
    }
    async function getScenesByStoryId(storyId) {
        const snapshot = await storyCollection.where("id", "==", storyId).get()
        return snapshot.docs.map(item => item.data())
    }
}
