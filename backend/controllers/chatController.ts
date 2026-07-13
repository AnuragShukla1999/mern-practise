import prisma from '../lib/prisma'
import { Request, Response } from "express";


export const createConversation = async (
  req: Request,
  res: Response
) => {
  try {
    const { user1, user2 } = req.body;

    const existing = await prisma.conversation.findFirst({
      where: {
        isGroup: false,
        participants: {
          every: {
            userId: {
              in: [user1, user2],
            },
          },
        },
      },
      include: {
        participants: true,
      },
    });

    if (existing) {
      return res.json(existing);
    }

    const conversation = await prisma.conversation.create({
      data: {
        participants: {
          create: [
            {
              userId: user1,
            },
            {
              userId: user2,
            },
          ],
        },
      },
      include: {
        participants: true,
      },
    });

    res.json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
};



export const getConversations = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = Number(req.params.userId);

    const chats = await prisma.conversation.findMany({
      where: {
        participants: {
          some: {
            userId,
          },
        },
      },
      include: {
        participants: {
          include: {
            user: true,
          },
        },

        messages: {
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
        },
      },
    });


    // console.log("participants ============> ", chats[0].participants);
    // console.log("messages ============> ", chats[0].messages);

    res.json(chats);
  } catch (err) {
    res.status(500).json(err);
  }
};














