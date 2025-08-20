"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FaLeaf,
  FaGlobe,
  FaWater,
  FaWind,
  FaRecycle,
  FaArrowRight,
  FaArrowLeft,
  FaTrophy,
  FaLightbulb,
  FaShareAlt,
  FaComments,
} from "react-icons/fa";

interface BoundaryScore {
  climate: number;
  biosphere: number;
  biogeochemical: number;
  freshwater: number;
  aerosols: number;
}

interface Recommendation {
  action: string;
  impact: string;
  boundary: string;
  current_score: number;
}

interface ScoringResult {
  items: any[];
  per_boundary_averages: BoundaryScore;
  composite: number;
  grade: string;
  recommendations: Recommendation[];
  boundary_details: any;
}

interface EcoScoreDisplayProps {
  scoringResult: ScoringResult;
  onRestart: () => void;
  onNext?: () => void;
  onGetTips?: () => void;
}

const BOUNDARY_ICONS = {
  climate: {
    icon: FaGlobe,
    color: "text-red-500",
    bg: "bg-red-100",
    name: "Climate Change",
  },
  biosphere: {
    icon: FaLeaf,
    color: "text-green-500",
    bg: "bg-green-100",
    name: "Biosphere Integrity",
  },
  biogeochemical: {
    icon: FaRecycle,
    color: "text-blue-500",
    bg: "bg-blue-100",
    name: "Biogeochemical Flows",
  },
  freshwater: {
    icon: FaWater,
    color: "text-cyan-500",
    bg: "bg-cyan-100",
    name: "Freshwater Use",
  },
  aerosols: {
    icon: FaWind,
    color: "text-gray-500",
    bg: "bg-gray-100",
    name: "Aerosols & Novel Entities",
  },
};

const getGradeColor = (grade: string) => {
  switch (grade) {
    case "A+":
    case "A":
      return "text-green-600 bg-green-100";
    case "B+":
    case "B":
      return "text-blue-600 bg-blue-100";
    case "C+":
    case "C":
      return "text-yellow-600 bg-yellow-100";
    case "D":
      return "text-orange-600 bg-orange-100";
    default:
      return "text-red-600 bg-red-100";
  }
};

const getScoreColor = (score: number) => {
  if (score <= 30) return "text-green-600";
  if (score <= 50) return "text-yellow-600";
  if (score <= 70) return "text-orange-600";
  return "text-red-600";
};

export default function EcoScoreDisplay({
  scoringResult,
  onRestart,
  onNext,
  onGetTips,
}: EcoScoreDisplayProps) {
  const router = useRouter();
  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    // Set the current URL after component mounts
    setCurrentUrl(window.location.href);
  }, []);

  const getScoreStrokeColor = (score: number) => {
    // Convert composite score (0-100, lower is better) to display score (0-100, higher is better)
    const displayScore = 100 - score;
    
    if (displayScore >= 80) return "#10b981"; // Bright green for excellent scores
    if (displayScore >= 70) return "#22c55e"; // Green for good scores
    if (displayScore >= 60) return "#84cc16"; // Light green for above average
    if (displayScore >= 50) return "#eab308"; // Yellow for average
    if (displayScore >= 40) return "#f59e0b"; // Orange for below average
    if (displayScore >= 30) return "#f97316"; // Orange-red for poor
    if (displayScore >= 20) return "#ef4444"; // Red for very poor
    return "#dc2626"; // Dark red for extremely poor scores
  };

  const boundaryScores = Object.entries(
    scoringResult.per_boundary_averages
  ).map(([key, value]) => ({
    key,
    value: Math.round(value),
    ...BOUNDARY_ICONS[key as keyof typeof BOUNDARY_ICONS],
  }));

  const createRadialScore = (score: number) => {
    const circumference = 2 * Math.PI * 42; // radius of 42 to match the circle
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    return { strokeDasharray, strokeDashoffset };
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "My EcoBee Environmental Score",
        text: `I scored ${scoringResult.grade} (${scoringResult.composite}/100) on my environmental impact assessment!`,
        url: currentUrl,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(
        `I scored ${scoringResult.grade} (${scoringResult.composite}/100) on my environmental impact assessment! Check out EcoBee: ${currentUrl}`
      );
      alert("Score copied to clipboard!");
    }
  };

  // Get progress bar width class
  const getProgressBarClass = (value: number) => {
    const width = Math.max(5, 100 - value);
    if (width >= 90) return "w-full";
    if (width >= 80) return "w-5/6";
    if (width >= 75) return "w-3/4";
    if (width >= 60) return "w-3/5";
    if (width >= 50) return "w-1/2";
    if (width >= 40) return "w-2/5";
    if (width >= 33) return "w-1/3";
    if (width >= 25) return "w-1/4";
    if (width >= 20) return "w-1/5";
    if (width >= 16) return "w-1/6";
    return "w-1/12";
  };

  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 p-2 overflow-hidden">
      <div className="max-w-7xl mx-auto h-full flex items-center">
        <div className="glass overflow-hidden w-full h-[95vh]">
          <div className="flex h-full">
            {/* Left Side - Large Score Circle */}
            <div className="w-1/2 flex items-center justify-center p-4">
              <div className="flex items-center space-x-4">
                <div className="relative flex items-center justify-center" style={{ width: 120, height: 120 }}>
                  <svg className="absolute inset-0 w-30 h-30 transform -rotate-90" viewBox="0 0 100 100" width="120" height="120">
                    {/* Background circle */}
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      stroke="rgba(71, 85, 105, 0.3)"
                      strokeWidth="6"
                      fill="none"
                    />
                    {/* Score circle */}
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      stroke={getScoreStrokeColor(scoringResult.composite)}
                      strokeWidth="6"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={
                        createRadialScore(100 - scoringResult.composite).strokeDasharray
                      }
                      strokeDashoffset={
                        createRadialScore(100 - scoringResult.composite)
                          .strokeDashoffset
                      }
                      className="transition-all duration-1000"
                    />
                  </svg>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white leading-none mb-1">
                    {Math.round(100 - scoringResult.composite)}
                  </div>
                  <div className="text-sm text-slate-300 leading-none mb-3">
                    /100
                  </div>
                  <div className={`text-xl font-bold px-4 py-2 rounded-full ${getGradeColor(scoringResult.grade)} inline-block shadow-lg border-2 border-white/20 flex items-center space-x-2`}>
                    <FaTrophy className="text-yellow-300" />
                    <span>{scoringResult.grade}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Content */}
            <div className="w-1/2 flex flex-col h-full">
              {/* Header */}
              <div className="glass-header text-center p-3 border-b border-gray-700/30">
                <h1 className="neon-title text-lg font-bold mb-1">
                  Your EcoBee Score
                </h1>
                <p className="text-slate-300 text-xs">Environmental Impact Assessment</p>
              </div>

              {/* Boundary Breakdown */}
              <div className="glass-card-inner p-2 border-b border-gray-700/30 flex-1 min-h-0">
                <h2 className="text-xs font-bold text-white mb-2 flex items-center">
                  <FaGlobe className="mr-1 text-blue-400 text-xs" />
                  Planetary Boundaries
                </h2>

                <div className="space-y-1">
                  {boundaryScores.map(({ key, value, icon: Icon, color, bg, name }) => (
                    <div key={key} className="bg-gray-700/30 p-1.5 rounded border border-gray-600/30 flex items-center justify-between">
                      <div className="flex items-center space-x-1.5 flex-1 min-w-0">
                        <Icon className={`text-xs ${color} flex-shrink-0`} />
                        <h3 className="font-medium text-white text-xs truncate">{name.replace(' Integrity', '').replace(' Change', '').replace(' Flows', '').replace(' Use', '').replace(' & Novel Entities', '')}</h3>
                      </div>
                      <div className="flex items-center space-x-1.5 flex-shrink-0">
                        <span className="text-xs font-bold text-white w-6 text-right">
                          {Math.round(100 - value)}
                        </span>
                        <div className="w-8 bg-gray-600 rounded-full h-1 overflow-hidden">
                          <div
                            className={`h-1 rounded-full transition-all duration-500 ${
                              value <= 30
                                ? "bg-green-500"
                                : value <= 60
                                ? "bg-yellow-500"
                                : "bg-red-500"
                            } ${getProgressBarClass(value)}`}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              {scoringResult.recommendations &&
                scoringResult.recommendations.length > 0 && (
                  <div className="glass-card-inner p-2 border-b border-gray-700/30 flex-1 min-h-0">
                    <h2 className="text-xs font-bold text-white mb-2 flex items-center">
                      <FaLightbulb className="mr-1 text-yellow-400 text-xs" />
                      Top Actions
                    </h2>

                    <div className="space-y-1">
                      {scoringResult.recommendations.slice(0, 2).map((rec, index) => (
                        <div
                          key={index}
                          className="bg-gradient-to-r from-blue-600/20 to-green-600/20 border border-blue-500/30 rounded p-2"
                        >
                          <div className="flex items-start space-x-1.5">
                            <div className="bg-blue-500/20 text-blue-400 rounded-full w-4 h-4 flex items-center justify-center font-bold text-xs border border-blue-500/30 flex-shrink-0">
                              {index + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-white text-xs mb-0.5 leading-tight">
                                {rec.action}
                              </h3>
                              <p className="text-slate-300 text-xs leading-tight line-clamp-2">{rec.impact}</p>
                              <div className="flex items-center space-x-1 mt-0.5">
                                <span className="text-xs text-blue-400 bg-blue-500/20 px-1 py-0.5 rounded border border-blue-500/30">
                                  {rec.boundary.split(' ')[0]}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* Action Buttons */}
              <div className="glass-card-inner p-2">
                <div className="grid grid-cols-2 gap-1">
                  <button
                    onClick={handleShare}
                    className="btn btn-primary text-xs py-1.5 px-2"
                  >
                    <FaShareAlt className="text-xs" />
                    <span>Share</span>
                  </button>

                  <button
                    onClick={onRestart}
                    className="btn text-xs py-1.5 px-2 bg-gray-600/20 text-slate-300 border border-gray-600/30 rounded hover:bg-gray-600/30 hover:border-gray-500/50 transition-all duration-200 flex items-center justify-center space-x-1"
                  >
                    <FaArrowLeft className="text-xs" />
                    <span>Retake</span>
                  </button>

                  {onGetTips && (
                    <button
                      onClick={onGetTips}
                      className="btn btn-primary text-xs py-1.5 px-2"
                    >
                      <FaComments className="text-xs" />
                      <span>Tips</span>
                    </button>
                  )}

                  {onNext && (
                    <button
                      onClick={onNext}
                      className="btn text-xs py-1.5 px-2 bg-green-600/20 text-green-400 border border-green-600/30 rounded hover:bg-green-600/30 hover:border-green-500/50 transition-all duration-200 flex items-center justify-center space-x-1"
                    >
                      <span>Board</span>
                      <FaArrowRight className="text-xs" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
