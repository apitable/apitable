import { create } from '@storybook/theming';
import logo from '../src/stories/assets/logo.png';

export default create({
  base: 'light',
  colorPrimary: '#7B67EE',
  barSelectedColor: '#7B67EE',
  brandTitle: 'Vika Components',
  brandImage: logo,
});