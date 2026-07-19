import { prisma } from "../../../config/prisma";
import { CreateTeamInput } from "../validations/team.validation";

export async function createTeam(
  data: CreateTeamInput
) {
  // TODO:
  // 1. Get current season
  // 2. Get captain user
  // 3. Set initial budget

  return data;
}