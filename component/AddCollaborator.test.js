import React from 'react';
import AddCollaborator from './AddCollaborator'

const sum = function(num1, num2){
  return num1 + num2
}

test('adds 1 and 2 to equal 3', ()=>{
  expect(sum(1,2).toBe(3))
})

// const adapter = new Adapter()
// enzyme.configure({adapter})
// global.window = { location : { host : 'example.com' } };



// describe('AddCollaborator', () => {
//   let addCollaborator
//   let user = {
//     id: 2,
//     email: 'john@doeMail.com',
//     displayName: 'John Doe'
//   }

//   beforeEach( () => {
//     addCollaborator = shallow(<AddCollaborator currentUser={user} />)
//   })

//   it('renders the addCollaborator div', ()=>{
//     expect(addScene.find('addcollaborator').length).to.be.equal(1)
//   })



// })

// /*
//   beforeEach(() => {
//     addScene = shallow(<AddScene currentUser={user} />)
//   })

//   it('renders the addscene div', () => {
//     expect(addScene.find('.addscene').length).to.be.equal(1)
//   })

//   it('renders an h2 with text Add An Image', () => {
//     expect(addScene.find('h2').text()).to.be.equal('Add an Image')
//   })
// })
// */
// // expect(true).to.be.false