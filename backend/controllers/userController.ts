

import { Request, Response } from "express";
import { onlineUsers } from "../socket";
import prisma from "../lib/prisma";

export const getOnlineUsers = async (
  req: Request,
  res: Response
) => {
  try {

    console.log("onlineUsers.keys() ===> ", onlineUsers.keys());

    const userId = Number(req.params.id)

    const users =  await prisma.user.findMany({
        where: {
            id: {
                in: [...onlineUsers.keys()],
                not: userId,
            },
        },
        select: {
            id: true,
            name: true,
            email: true,
            profileUrl: true
        }
    })

    return res.status(200).json({
      success: true,
    //   onlineUsers: [...onlineUsers.keys()],
      onlineUsers: users,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error,
    });
  }
};