function makeStoryService(storyCollection) {
    return {
        getStoriesByUser
    }

    async function getStoriesByUser(userId) {
        //const snapshot = await userCollection.doc(userId).collection("stories").get()
        const snapshot = await storyCollection.where("userId", "==", userId).get()
        return snapshot.docs.map(item => item.data())
    }
}

export default makeStoryService