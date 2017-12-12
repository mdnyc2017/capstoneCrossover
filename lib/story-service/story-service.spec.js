import makeStoryService from './story-service.js'

//isolate whatever youre testing from any dependancies 
//particularly those that are slow and fragile
//db is slow 
//first rule of unit test is that it has to be fast
//how to isolate code from db dependancy? 
//use dependancy injection
//

describe('story', () => {
    it('lists stories by user', async () => {
        const userId = 'uid'
        const fakeStory = {
            description: 'fooz',
            id: 'foo',
            thumbnail: 'bar',
            title: 'I am an awesome title',
            userId: "uid"
        }

        const storyCollection = {
            where: (fieldpath, optStr, value) => {
                expect(fieldpath).toBe("userId")
                expect(optStr).toBe("==")
                expect(value).toBe(userId)
                return ({
                    get: async () => ({
                        docs: [{ data: () => fakeStory }]
                    })
                })
            }
        }

        const storyService = makeStoryService(storyCollection)
        const stories = await storyService.getStoriesByUser(userId)
        expect(stories[0]).toEqual(fakeStory)
    })
    it('adds a story', async () => {
        // const storyService = makeStoryService(userCollection)
        // const result = await storyService.addStory(story)
    })
})
