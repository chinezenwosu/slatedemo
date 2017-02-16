import React from 'react';
import {shallow, render} from 'enzyme';
import App from '../../../client/components/App';
import NavBar from '../../../client/components/NavBar';
import SignUpForm from '../../../client/components/signup/SignUpForm';

describe('React Components', () => {
  describe('<App />', () => {
    it('renders a NavBar component', (done) => {
      const wrapper = shallow(<App />);
      expect(wrapper.find(NavBar).length).toBe(1);
      done();
    });

    it('renders a SignUpForm component', (done) => {
      const wrapper = render(<App />);
      expect(wrapper.find('nav').length).toBe(1);
      done();
    });
  });
});

