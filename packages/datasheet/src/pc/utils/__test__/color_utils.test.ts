import { hexToRGB } from '../color_utils';
describe('hex to rgba', () => {
  test('should right to convert', function() {
    expect(hexToRGB('#f7f6fa')).toBe('rgba(247,246,250,1)');
  });

  test('is right opacity', function() {
    expect(hexToRGB('#f7f6fa', 20)).toBe('rgba(247,246,250,1)');
  });

  test('is right opacity', function() {
    expect(hexToRGB('#f7f6fa', 0.33)).toBe('rgba(247,246,250,0.3)');
  });

  test('is right opacity', function() {
    expect(hexToRGB('#f7f6fa', 1)).toBe('rgba(247,246,250,1)');
  });
});
