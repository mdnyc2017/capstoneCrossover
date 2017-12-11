import React from 'react'
import chai, {expect} from 'chai'
import enzyme, {shallow} from 'enzyme'
import {spy} from 'sinon'
import Adapter from 'enzyme-adapter-react-16'
chai.use(require('sinon-chai'))

const adapter = new Adapter()
enzyme.configure({adapter})

import Login from './Login'

/* global describe it beforeEach */
describe('<Login />', () => {
  let root, fakeAuth
  beforeEach('render the root', () => {
    fakeAuth = {
      signInWithPopup: spy(),
      signInWithRedirect: spy(),
    }
    root = shallow(<Login auth={fakeAuth}/>)
  })

  it('logs in with google', () => {
    const button = root.find('li.google.login')
    expect(button).to.have.length(1)
    button.simulate('click')
    expect(fakeAuth.signInWithPopup).to.have.been.calledWithMatch({providerId: 'google.com'})
  })
})