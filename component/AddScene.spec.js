import React from 'react'
import enzyme, {shallow} from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import chai, {expect} from 'chai'
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

  it('renders the addscene div', () => {
    expect(addScene.find('.addscene').length).to.be.equal(1)
  })

  it('renders an h2 with text Add An Image', () => {
    expect(addScene.find('h2').text()).to.be.equal('Add an Image')
  })
})
