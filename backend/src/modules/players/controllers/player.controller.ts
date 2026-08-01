import { Request, Response } from "express";

import { createPlayerSchema } from "../validations/player.validation.js";
import { createPlayer } from "../services/player.service.js";

import XLSX from "xlsx";
import fs from "fs";

import { prisma } from "../../../config/prisma.js";
import { importPlayerSchema } from "../validations/importPlayer.validation.js";

export async function createPlayerController(
  req: Request,
  res: Response
) {
  try {
    const data = createPlayerSchema.parse(req.body);

    const player = await createPlayer(data);

    return res.status(201).json({
      success: true,
      message: "Player created successfully",
      data: player,
    });
  } catch (error) {
    console.error(error);

    return res.status(400).json({
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Unknown error",
    });
  }
}

export async function importPlayersController(
  req: Request,
  res: Response
) {
  try {
    console.log("REQ.FILE:", req.file);
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "No file uploaded",
      });
    }

const workbook = XLSX.readFile(req.file.path);

const sheet = workbook.Sheets[workbook.SheetNames[0]];

type PlayerRow = {
  name: string;
  phoneNumber: string;
  imageFileName: string;
};

const players = XLSX.utils.sheet_to_json<PlayerRow>(sheet);
if (players.length === 0) {
  return res.status(400).json({
    success: false,
    error: "Excel file is empty",
  });
}

const validatedPlayers = players.map((row) =>
  importPlayerSchema.parse({
    name: String(row.name).trim(),
    phoneNumber: String(row.phoneNumber).trim(),
    imageFileName: String(row.imageFileName).trim(),
  })
);

    const activeSeason = await prisma.season.findFirst({
  where: {
    isActive: true,
  },
});
for (const player of validatedPlayers) {
  const exists = await prisma.player.findUnique({
    where: {
      phoneNumber: player.phoneNumber,
    },
  });

  if (exists) {
    continue;
  }

  const createdPlayer = await prisma.player.create({
    data: {
      name: player.name,
      phoneNumber: player.phoneNumber,
      imageUrl: player.imageFileName,
    },
  });

  if (activeSeason) {
    await prisma.seasonPlayer.create({
      data: {
        seasonId: activeSeason.id,
        playerId: createdPlayer.id,
        basePrice: BigInt(200000),
        isRetentionEligible: false,
        isRTMEligible: false,
      },
    });
  }
}

fs.unlinkSync(req.file.path);

return res.json({
  success: true,
  message: `${players.length} players imported successfully`,
});

  } catch (error) {
    console.error(error);

    return res.status(400).json({
      success: false,
      error: error instanceof Error
        ? error.message
        : "Unknown error",
    });
  }
  finally {
  if (req.file && fs.existsSync(req.file.path)) {
    fs.unlinkSync(req.file.path);
  }
}
}

export async function uploadPlayerImagesController(
  req: Request,
  res: Response
) {
  try {
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      return res.status(400).json({
        success: false,
        error: "No images uploaded",
      });
    }

    return res.json({
  success: true,
  uploaded: files.length,
  files: files.map(file => ({
    filename: file.filename,
    url: `/uploads/players/${file.filename}`,
  })),
});
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      error: "Image upload failed",
    });
  }
}

export async function getPlayersController(
  req: Request,
  res: Response
) {
  try {
    const players = await prisma.player.findMany({
      orderBy: {
        name: "asc",
      },
    });

    const BASE_URL = "import.meta.env.VITE_API_URL";

    return res.json({
      success: true,
      data: players.map((player) => ({
        ...player,
        imageUrl: `${BASE_URL}/uploads/players/${player.imageUrl}`,
      })),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}