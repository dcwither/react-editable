import {expect} from 'chai';
import omit from '../src/omit';

describe('omit', () => {
  test('should omit keys passed in', () => {
    expect(
      omit({a: 1, b: 2, c: 3}, ['c', 'b'])
    ).to.deep.equal({a: 1});
  });
});
