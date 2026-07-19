import { prisma } from "../../../config/prisma";
import { CreateTeamInput } from "../validations/team.validation";

export async function createTeam(
  data: CreateTeamInput,
  captainUserId: string
) {
    const season = await prisma.season.findFirst({
  where: {
    isActive: true,
  },
});

if (!season) {
  throw new Error("No active season found");
}

  const team = await prisma.team.create({
  data: {
    seasonId: season.id,

    name: data.name,

    logoUrl: data.logoUrl,

    captainUserId,

    totalBudget: BigInt(120000000),

    remainingBudget: BigInt(120000000),
  },
});

return {
  ...team,
  totalBudget: Number(team.totalBudget),
  remainingBudget: Number(team.remainingBudget),
};
}