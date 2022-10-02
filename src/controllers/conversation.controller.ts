// import dataSource from 'src/configs/data-source';
// import { Conversation } from 'src/entities/conversation.entity';
// import { Participants } from 'src/entities/participants.entity';

// const conversationRepository = dataSource.getRepository(Conversation);
// const participantsRepository = dataSource.getRepository(Participants);

// export const createConversation = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const conversation = new Conversation();
//     conversation.tittle = req.body.title;

//     const saved = await conversationRepository.save(conversation);
//     return res.status(StatusCodes.CREATED).json(saved);
//   } catch (error) {
//     next(error);
//   }
// };

// export const updateConversation = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const conversation = await conversationRepository.findOne({
//       where: {
//         id: req.params.id,
//       },
//     });
//     if (!conversation) {
//       throw new HttpException(
//         StatusCodes.BAD_REQUEST,
//         message.Conversation_not_found
//       );
//     }
//     conversation.tittle = req.body.title;

//     const updated = await conversationRepository.save(conversation);

//     return res.status(StatusCodes.OK).json(updated);
//   } catch (error) {
//     next(error);
//   }
// };

// export const getConversationOfUser = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     return res.status(StatusCodes.OK).json(a);
//   } catch (error) {
//     next(error);
//   }
// };

// export const deleteConversation = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     await dataSource
//       .createQueryBuilder()
//       .delete()
//       .from(Conversation)
//       .where('id = :id', { id: req.params.id })
//       .execute();

//     return res.status(StatusCodes.NO_CONTENT);
//   } catch (error) {
//     next(error);
//   }
// };
