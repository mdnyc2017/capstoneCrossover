import React from 'react';
import enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import chai, { expect } from 'chai';
import Home from './Home';

const adapter = new Adapter();
enzyme.configure({ adapter });
global.window = { location: { host: 'example.com' } };

describe('Home', () => {
  let home;
  const user = {
    id: 1,
    email: 'test@test.com',
    displayName: 'John Smith',
  };

  beforeEach(() => {
    home = shallow(<Home />);
  });

  it('renders the home-page div', () => {
    expect(home.find('.home-page').length).to.be.equal(1);
  });

  it('renders the home-page-top div with the home-page-top class as a home-page child', () => {
    expect(home.find('.home-page-top').hasClass('home-page-top')).to.equal(true);
    expect(home.find('.home-page-top').parent().hasClass('home-page')).to.equal(true);
  });
});
