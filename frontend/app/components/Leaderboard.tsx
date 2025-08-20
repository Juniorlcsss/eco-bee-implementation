"use client";
import React, { useState, useEffect } from "react";
import {
  FaTrophy,
  FaMedal,
  FaAward,
  FaArrowLeft,
  FaLeaf,
} from "react-icons/fa";
import { getApiUrl } from "../config/api";

interface LeaderboardEntry {
  rank?: number;
  user_id?: string;
  composite_score?: number;
  grade?: string;
  campus_affiliation?: string;
  timestamp?: string;
  pseudonym?: string;
  boundary_scores?: {
    climate: number;
    biosphere: number;
    biogeochemical: number;
    freshwater: number;
    aerosols: number;
  };
}

interface LeaderboardProps {
  onBack: () => void;
}

export default function Leaderboard({ onBack }: LeaderboardProps) {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const response = await fetch(getApiUrl("/leaderboard?limit=50"));

      if (!response.ok) {
        throw new Error("Failed to fetch leaderboard");
      }

      const data = await response.json();
      setLeaderboardData(data.leaderboard || []);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      
      // Check if it's a network/backend error and provide fallback
      if (error instanceof Error && 
          (error.message.includes("fetch") || error.message.includes("NetworkError"))) {
        setError("⚠️ Offline Mode: Leaderboard requires the Python backend. Run 'python backend/simple_server.py' to view real leaderboard data.");
        
        // Provide mock leaderboard data for demonstration
        setLeaderboardData([
          {
            rank: 1,
            user_id: "EcoChampion",
            composite_score: 8.7,
            grade: "A",
            campus_affiliation: "Demo Campus",
            timestamp: new Date().toISOString()
          },
          {
            rank: 2,
            user_id: "GreenGuru",
            composite_score: 8.2,
            grade: "A",
            campus_affiliation: "Demo Campus",
            timestamp: new Date().toISOString()
          },
          {
            rank: 3,
            user_id: "EcoWarrior",
            composite_score: 7.8,
            grade: "B+",
            campus_affiliation: "Demo Campus",
            timestamp: new Date().toISOString()
          },
          {
            rank: 4,
            user_id: "NatureLover",
            composite_score: 7.3,
            grade: "B",
            campus_affiliation: "Demo Campus",
            timestamp: new Date().toISOString()
          },
          {
            rank: 5,
            user_id: "EcoFriend",
            composite_score: 6.9,
            grade: "B-",
            campus_affiliation: "Demo Campus",
            timestamp: new Date().toISOString()
          }
        ]);
      } else {
        setError("Failed to load leaderboard data");
      }
    } finally {
      setLoading(false);
    }
  };

  const generateAlias = (userId: string, index: number) => {
    // If userId is already a readable alias, use it
    if (userId && !userId.includes('demo_user') && !userId.includes('user_') && userId.length > 8) {
      return userId;
    }
    
    // Generate eco-themed aliases
    const ecoAliases = [
      'EcoChampion', 'GreenGuru', 'EcoWarrior', 'NatureLover', 'EcoFriend',
      'TreeHugger', 'GreenThumb', 'EcoHero', 'PlanetGuard', 'GreenKnight',
      'EcoMaster', 'LeafWhisper', 'GreenSage', 'EcoExplorer', 'NatureWise',
      'EcoVibes', 'GreenSpark', 'EcoStar', 'GreenWave', 'EcoSpirit'
    ];
    
    return ecoAliases[index % ecoAliases.length] || `EcoUser${index + 1}`;
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <FaTrophy className="text-yellow-500 text-2xl" />;
      case 2:
        return <FaMedal className="text-gray-400 text-2xl" />;
      case 3:
        return <FaAward className="text-orange-500 text-2xl" />;
      default:
        return (
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <span className="text-green-600 font-bold text-sm">{rank}</span>
          </div>
        );
    }
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case "A":
        return "text-green-600 bg-green-100";
      case "B":
        return "text-blue-600 bg-blue-100";
      case "C":
        return "text-yellow-600 bg-yellow-100";
      case "D":
        return "text-orange-600 bg-orange-100";
      case "F":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="max-w-md mx-auto c4d-card text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Error Loading Leaderboard
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={onBack}
            className="btn-primary"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="c4d-card mb-6 overflow-hidden">
          <div className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button
                  onClick={onBack}
                  className="text-yellow-100 hover:text-white transition-colors"
                  title="Go back to home"
                  aria-label="Go back to home"
                >
                  <FaArrowLeft className="text-xl" />
                </button>
                <div>
                  <h1 className="text-3xl font-bold flex items-center">
                    <FaTrophy className="mr-3" />
                    EcoLeaderboard
                  </h1>
                  <p className="text-yellow-100">
                    See how EcoBee users are making a difference
                  </p>
                </div>
              </div>
              <FaLeaf className="text-5xl text-yellow-200 opacity-50" />
            </div>
          </div>

          {/* Stats */}
          <div className="p-6 bg-gradient-to-r from-yellow-50 to-orange-50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800">
                  {leaderboardData.length}
                </div>
                <div className="text-sm text-gray-600">Total Participants</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {leaderboardData.length > 0
                    ? (
                        leaderboardData.reduce(
                          (sum, entry) => sum + (entry.composite_score || 0),
                          0
                        ) / leaderboardData.length
                      ).toFixed(1)
                    : "0.0"}
                </div>
                <div className="text-sm text-gray-600">Average Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {
                    leaderboardData.filter((entry) => entry.grade === "A")
                      .length
                  }
                </div>
                <div className="text-sm text-gray-600">A-Grade Eco Heroes</div>
              </div>
            </div>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="c4d-card overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Top Performers
            </h2>

            {leaderboardData.length === 0 ? (
              <div className="text-center py-8">
                <FaLeaf className="text-gray-300 text-4xl mx-auto mb-4" />
                <p className="text-gray-500">
                  No leaderboard data available yet.
                </p>
                <p className="text-gray-400 text-sm">
                  Be the first to take the quiz and appear here!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Top 3 Podium */}
                {leaderboardData.slice(0, 3).length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">
                      🏆 Champions Podium
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
                      {leaderboardData.slice(0, 3).map((entry, index) => (
                        <div
                          key={entry.user_id || `podium-${index}`}
                          className={`relative overflow-hidden rounded-2xl transition-all duration-300 transform hover:scale-105 ${
                            index === 0
                              ? "bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500 shadow-2xl shadow-yellow-500/30 md:order-2"
                              : index === 1
                              ? "bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500 shadow-xl shadow-gray-400/30 md:order-1"
                              : "bg-gradient-to-br from-orange-400 via-orange-500 to-red-500 shadow-xl shadow-orange-400/30 md:order-3"
                          }`}
                        >
                          <div className="p-6 text-center text-white">
                            <div className="text-4xl mb-2">
                              {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                            </div>
                            <div className="text-xl font-bold mb-2">
                              {entry.pseudonym || generateAlias(entry.user_id || '', index)}
                            </div>
                            <div className="text-3xl font-bold mb-1">
                              {(entry.composite_score || 0).toFixed(1)}
                            </div>
                            <div className="text-sm opacity-90 mb-2">EcoScore</div>
                            <div className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${
                              index === 0 ? 'bg-white/20 text-white' : 'bg-white/20 text-white'
                            }`}>
                              Grade {entry.grade || "N/A"}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Rest of leaderboard */}
                {leaderboardData.length > 3 && (
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-4">
                      🌱 Other Eco Heroes
                    </h3>
                    <div className="space-y-2">
                      {leaderboardData.slice(3, 20).map((entry, index) => (
                        <div
                          key={entry.user_id || `entry-${index + 3}`}
                          className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all duration-200 hover:shadow-md"
                        >
                          <div className="flex items-center space-x-4">
                            {getRankIcon(entry.rank || index + 4)}
                            <div>
                              <div className="font-semibold text-gray-800">
                                {entry.pseudonym || generateAlias(entry.user_id || '', index + 3)} - {(entry.composite_score || 0).toFixed(1)}
                              </div>
                              {entry.campus_affiliation && (
                                <div className="text-sm text-gray-600">
                                  {entry.campus_affiliation}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center space-x-4">
                            <div
                              className={`px-3 py-1 rounded-full text-sm font-bold ${getGradeColor(
                                entry.grade || "N/A"
                              )}`}
                            >
                              {entry.grade || "N/A"}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Back Button */}
        <div className="text-center mt-6">
          <button
            onClick={onBack}
            className="cta"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
