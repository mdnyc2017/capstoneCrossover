import makeSceneService from './scene-service'
// let filteredStories = stories.filter(story => story.id);
// filteredStories.map(story => {
//     db
//         .collection("stories")
//         .where("id", "==", story.id)
//         .get()
//         .then(snapshot => {
//             snapshot.forEach(doc => {
//                 self.setState({
//                     stories: [...self.state.stories, doc.data()]
//                 });
//             });
//         });
// });
describe('scene service', () => {
    it('lists all the scenes of a story', async () => {
        const storyId = "id";
        const fakeScene = {
            imageUrl: "url",
            id: "sceneId"
        }
        const storyCollection = {
            where: (fieldpath, optStr, value) => {
                expect(fieldpath).toBe("id")
                expect(optStr).toBe("==")
                expect(value).toBe(storyId)
                return ({
                    get: async () => ({
                        docs: [{ data: () => fakeScene }]
                    })
                })
            }
        }
        const sceneService = makeSceneService(storyCollection)
        const scenes = await sceneService.getScenesByStoryId(storyId)
        expect(scenes[0]).toEqual(fakeScene)
    })
    it('adds a scene to a story')
})