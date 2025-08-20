import { NextRequest, NextResponse } from "next/server";
import { serverEnvConfig, validateServerEnvironment } from "../../config/env";
import { getLeaderboard } from "../../../lib/supabase-server";

export async function GET(request: NextRequest) {
  try {
    // Validate environment configuration
    const envValidation = validateServerEnvironment();

    if (!envValidation.isValid) {
      // Return mock data if database not configured
      const mockLeaderboard = [
        {
          id: 1,
          user_name: "EcoChampion",
          eco_score: 95,
          rank: 1,
          environmental_actions_taken: 47,
          created_at: new Date().toISOString(),
        },
        {
          id: 2,
          user_name: "GreenGuru",
          eco_score: 88,
          rank: 2,
          environmental_actions_taken: 35,
          created_at: new Date().toISOString(),
        },
        {
          id: 3,
          user_name: "SustainableStar",
          eco_score: 82,
          rank: 3,
          environmental_actions_taken: 28,
          created_at: new Date().toISOString(),
        },
      ];

      return NextResponse.json({
        success: true,
        leaderboard: mockLeaderboard,
        total_users: mockLeaderboard.length,
        message: "Mock leaderboard data - database not configured",
        warning: envValidation.message,
      });
    }

    // Get real leaderboard data
    const result = await getLeaderboard();

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
          leaderboard: [],
        },
        { status: 500 }
      );
    }

    // Transform data to match expected format
    const leaderboard = (result.data || []).map((entry, index) => ({
      rank: index + 1,
      user_id: entry.user_id,
      composite_score: entry.composite_score, // Use the actual score (higher is better)
      grade: entry.grade || calculateGrade(entry.composite_score),
      campus_affiliation: entry.campus_affiliation || "Unknown Campus",
      timestamp: entry.created_at || new Date().toISOString(),
      boundary_scores: entry.boundary_scores,
      pseudonym: entry.pseudonym || `User${index + 1}`,
    }));

    return NextResponse.json({
      success: true,
      leaderboard,
      total_users: leaderboard.length,
      message: "Leaderboard retrieved successfully",
    });
  } catch (error) {
    console.error("Leaderboard API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch leaderboard",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Helper function to calculate grade from score
function calculateGrade(score: number): string {
  if (score >= 90) return "A+";
  if (score >= 85) return "A";
  if (score >= 80) return "A-";
  if (score >= 75) return "B+";
  if (score >= 70) return "B";
  if (score >= 65) return "B-";
  if (score >= 60) return "C+";
  if (score >= 55) return "C";
  if (score >= 50) return "C-";
  if (score >= 45) return "D+";
  if (score >= 40) return "D";
  return "F";
}
