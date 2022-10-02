// import { NextFunction, Request, Response } from 'express';
// import { StatusCodes } from 'http-status-codes';
// import dataSource from 'src/configs/data-source';
// import { Message } from 'src/entities/message.entity';
// import { Equal } from 'typeorm';

// const messageRepository = dataSource.getRepository(Message);

// export const createMessage = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const message = new Message();
//     message.conversation = req.body.conversationid;
//     message.owner = req.body.userid;
//     message.message = req.body.message;
//     message.attachment = req.body.attachment;

//     const saved = await messageRepository.save(message);

//     return res.status(StatusCodes.CREATED).json(saved);
//   } catch (error) {
//     next(error);
//   }
// };

// export const getMessage = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const message = await messageRepository.find({
//       where: {
//         conversation: Equal(req.params.conversationid),
//       },
//     });

//     return res.status(StatusCodes.OK).json(message);
//   } catch (error) {
//     next(error);
//   }
// };

// export const deleteMessage = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     await dataSource
//       .createQueryBuilder()
//       .delete()
//       .from(Message)
//       .where('id = :id', { id: req.params.id })
//       .execute();

//     return res.status(StatusCodes.NO_CONTENT);
//   } catch (error) {
//     next(error);
//   }
// };
