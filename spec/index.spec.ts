import piece from '../src';
import { Color, Type } from '../src/models';

describe('Example Project', () => {
  it('should be defined', () => {
    expect(piece).toBeDefined();
  });

  it('should be black', () => {
    expect(piece.color).toEqual(Color.BLACK);
  });

  it('should be a king', () => {
    expect(piece.type).toEqual(Type.KING);
  });
});
