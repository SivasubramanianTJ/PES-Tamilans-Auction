import { prisma } from "../../../config/prisma";
import { CreateSeasonInput } from "../validations/season.validation";

export async function createSeason(data: CreateSeasonInput) {
  // Business Rule 1: Season number must be unique
  const existingSeasonNumber = await prisma.season.findUnique({
    where: {
      seasonNumber: data.seasonNumber,
    },
  });

  if (existingSeasonNumber) {
    throw new Error("Season number already exists");
  }

  // Business Rule 2: Season name must be unique
  const existingSeasonName = await prisma.season.findUnique({
    where: {
      name: data.name,
    },
  });

  if (existingSeasonName) {
    throw new Error("Season name already exists");
  }

  // Business Rule 3: End date must be after start date
  if (new Date(data.seasonEndDate) <= new Date(data.seasonStartDate)) {
    throw new Error("Season end date must be after season start date");
  }

  const season = await prisma.season.create({
    data: {
      ...data,

      isActive: true,

      auctionDate: new Date(data.auctionDate),
      seasonStartDate: new Date(data.seasonStartDate),
      seasonEndDate: new Date(data.seasonEndDate),
    },
  });

  return season;
}

export async function getActiveSeason() {
  const season = await prisma.season.findFirst({
    where: {
      isActive: true,
    },
  });

  if (!season) {
    throw new Error("No active season found");
  }

  return season;
}