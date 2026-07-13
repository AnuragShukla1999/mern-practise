import prisma from '../lib/prisma'
import { Request, Response } from "express";



export const sendMessage = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      conversationId,
      senderId,
      text,
    } = req.body;

    const message = await prisma.message.create({
      data: {
        conversationId,
        senderId,
        text,
      },

      include: {
        sender: true,
      },
    });

    res.json(message);
  } catch (err) {
    res.status(500).json(err);
  }
};



export const getMessages = async (
  req: Request,
  res: Response
) => {
  try {
    const conversationId = Number(req.params.conversationId);

    const messages = await prisma.message.findMany({
      where: {
        conversationId: conversationId,
      },

      include: {
        sender: true,
      },

      orderBy: {
        createdAt: "asc",
      },
    });

    res.json(messages);
  } catch (err) {
    res.status(500).json(err);
  }
};



