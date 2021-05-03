import logger from './logger';
import { Piece, Color, Type } from './models';

const piece: Piece = {
  color: Color.BLACK,
  type: Type.KING,
};

logger.info(`Piece successfully created : ${JSON.stringify(piece, null, 2)}`);

export default piece;
