// This file is automagically executed before every test

// Enzyme boilerplate for react
import Adapter from 'enzyme-adapter-react-15';
import Enzyme from 'enzyme';
import 'babel-polyfill';
import 'url-search-params-polyfill';
Enzyme.configure({ adapter: new Adapter() });
