import React from 'react'
import enzyme, {shallow} from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import chai, {expect} from 'chai'
//chai.use(require('chai-enzyme')())
// import {spy} from 'sinon'
//chai.use(require('sinon-chai'))
import AddScene from './Addscene'

const adapter = new Adapter()
enzyme.configure({adapter})
global.window = { location : { host : 'example.com' } };

describe('AddScene', () => {
  let addScene
  let user = {
    id: 1,
    email: 'test@test.com',
    displayName: 'John Smith'
  }

  beforeEach(() => {
    addScene = shallow(<AddScene currentUser={user} />)
  })

  it('renders an h2 with text Add An Image', () => {
    global.window = {
        location: {
            href: {
                value: 'foo'
            }
        }
    }
    expect(addScene.find('h2').text()).to.be.equal('Add an Image')
  })
})

// import WhoAmIContainer, {WhoAmI} from './WhoAmI'
// import Login from './Login'

// /* global describe it beforeEach */
// describe('<WhoAmI/>', () => {
//   describe('when nobody is logged in', () => {
//     let root
//     beforeEach('render the root', () =>
//       root = shallow(<WhoAmI/>)
//     )

//     it('says hello to Nobody', () => {
//       expect(root.text()).to.contain('Nobody')
//     })
//   })

//   describe('when an anonymous user is logged in', () => {
//     const user = {
//       displayName: null,
//       isAnonymous: true,
//     }
//     let root
//     beforeEach('render the root', () =>
//       root = shallow(<WhoAmI user={user}/>)
//     )

//     it('says hello to Anonymous', () => {
//       expect(root.text()).to.contain('Anonymous')
//     })

//     it('displays a Login component', () => {
//       expect(root.find(Login)).to.have.length(1)
//     })
//   })

//   describe('when a user is logged in', () => {
//     const user = {
//       isAnonymous: false,
//       displayName: 'Grace Hopper',
//     }
//     const fakeAuth = {signOut: spy()}
//     let root
//     beforeEach('render the root', () =>
//       root = shallow(<WhoAmI user={user} auth={fakeAuth}/>)
//     )

//     it('has a logout button', () => {
//       expect(root.find('button.logout')).to.have.length(1)
//     })

//     it('calls props.auth.signOut when logout is tapped', () => {
//       root.find('button.logout').simulate('click')
//       expect(fakeAuth.signOut).to.have.been.called
//     })
//   })
// })
