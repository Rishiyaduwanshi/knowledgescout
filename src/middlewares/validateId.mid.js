import mongoose from 'mongoose';
import { BadRequestError } from '../utils/appError.js';

export const validateObjectId = (req, _, next) => {
  try {
    const possibleIds = [
      req.params.id,
      req.params.userId,
      req.params.docId,
      req.query.id,
      req.query.userId,
      req.query.docId,
      req.body.id,
      req.body.userId,
      req.body.docId,
      req.user?.id,
    ];

    const id = possibleIds.find(Boolean);

    if (!id) {
      throw new BadRequestError('No ID provided in params, query, or body');
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestError('Invalid MongoDB ObjectId');
    }

    next();
  } catch (err) {
    next(err);
  }
};
