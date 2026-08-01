import ExcelJS from "exceljs";
import { getAuctionAnalytics } from "../../analytics/services/analytics.service.js";

export async function exportAuctionExcel() {

  const analytics = await getAuctionAnalytics();

  const workbook = new ExcelJS.Workbook();

  workbook.creator = "PES Tamilans Auction";

  workbook.created = new Date();

  // Summary Sheet
  const summary = workbook.addWorksheet("Summary");

  summary.addRow(["Metric", "Value"]);

  summary.addRow([
    "Total Players",
    analytics.summary.totalPlayers,
  ]);

  summary.addRow([
    "Sold Players",
    analytics.summary.soldPlayers,
  ]);

  summary.addRow([
    "Remaining Players",
    analytics.summary.remainingPlayers,
  ]);

  if (analytics.highestBid) {

    summary.addRow([]);

    summary.addRow([
      "Highest Bid Player",
      analytics.highestBid.player,
    ]);

    summary.addRow([
      "Highest Bid Team",
      analytics.highestBid.team,
    ]);

    summary.addRow([
      "Highest Bid Price",
      analytics.highestBid.price?.toString() ?? "" ,
    ]);

  }

  // Teams Sheet
  const teamsSheet = workbook.addWorksheet("Teams");

  teamsSheet.addRow([
    "Team",
    "Captain",
    "Players",
    "Retentions",
    "Auction",
    "Spent",
    "Remaining",
  ]);

  analytics.teams.forEach(team => {

    teamsSheet.addRow([
      team.name,
      team.captain,
      team.squadSize,
      team.retentions,
      team.auctionPlayers,
      team.totalSpent,
      team.remainingBudget.toString(),
    ]);

  });

  return workbook;

}