import { Participants } from 'src/entities/participants.entity';
import { StatusCodes } from 'http-status-codes';
import dataSource from 'src/configs/data-source';
import { NextFunction, Request, Response } from 'express';
import { Equal } from 'typeorm';
import { HttpException } from 'src/shares/http-exception';
import { message } from 'src/shares';

const participantsRepository = dataSource.getRepository(Participants);

export const createParticipanst = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const participants = new Participants();
    participants.conversation = req.body.conversationId;
    participants.owner = req.body.userId;

    const saved = await participantsRepository.save(participants);
    return res.status(StatusCodes.CREATED).json(saved);
  } catch (error) {
    next(error);
  }
};

export const updateParticipans = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const participants = await participantsRepository.findOne({
      where: {
        conversation: Equal(req.params.conversationId),
      },
    });
    if (!participants) {
      throw new HttpException(
        StatusCodes.BAD_REQUEST,
        message.Conversation_not_found
      );
    }
    participants.owner = req.body.userid;

    const updated = await participantsRepository.save(participants);

    return res.status(StatusCodes.OK).json(updated);
  } catch (error) {
    next(error);
  }
};

export const deleteParticipants = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await dataSource
      .createQueryBuilder()
      .delete()
      .from(Participants)
      .where('id = :id', { id: req.params.id })
      .execute();

    return res.status(StatusCodes.NO_CONTENT);
  } catch (error) {
    next(error);
  }
};
