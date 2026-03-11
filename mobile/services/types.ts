/**
 * API Types - All request/response types for the HealthMate API
 */

// ==================== Auth ====================
export interface SignupRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface UpdateProfileRequest {
  name?: string;
  avatar?: string;
}

export interface RefreshRequest {
  refreshToken: string;
}

// ==================== Health Profile ====================
export interface HealthProfile {
  id: string;
  userId: string;
  age: number;
  gender: "male" | "female" | "other";
  height: number;    // cm
  weight: number;    // kg
  isSmoker: boolean;
  exerciseFamiliarity: "beginner" | "intermediate" | "advanced";
  targetCalories?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateHealthProfileRequest {
  age: number;
  gender: "male" | "female" | "other";
  height: number;
  weight: number;
  isSmoker: boolean;
  exerciseFamiliarity: "beginner" | "intermediate" | "advanced";
}

export interface UpdateHealthProfileRequest {
  weight?: number;
  targetCalories?: number;
}

export interface BMIResponse {
  bmi: number;
  category: string;
  height: number;
  weight: number;
}

// ==================== Work Sessions ====================
export interface WorkSession {
  id: string;
  userId: string;
  duration: number;       // minutes
  workDuration: number;   // minutes
  breaksScheduled: number;
  breaksTaken: number;
  hydrationRemindersActedOn: number;
  status: "active" | "paused" | "completed";
  startedAt: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWorkSessionRequest {
  duration: number;
  workDuration: number;
  breaksScheduled: number;
}

export interface UpdateWorkSessionRequest {
  breaksTaken?: number;
  hydrationRemindersActedOn?: number;
}

// ==================== Activities ====================
export interface HydrationLog {
  id: string;
  userId: string;
  amount: number;      // ml
  date: string;
  notes?: string;
  createdAt: string;
}

export interface LogHydrationRequest {
  amount: number;
  date?: string;
  notes?: string;
}

export interface ExerciseLog {
  id: string;
  userId: string;
  exerciseType: string;
  duration: number;
  intensity: "low" | "medium" | "high";
  calories: number;
  createdAt: string;
}

export interface LogExerciseRequest {
  exerciseType: string;
  duration: number;
  intensity: "low" | "medium" | "high";
  calories: number;
}

export interface BreakLog {
  id: string;
  userId: string;
  sessionId: string;
  breakType: "stretch" | "walk" | "breathe" | "hydration";
  duration: number;
  createdAt: string;
}

export interface LogBreakRequest {
  sessionId: string;
  breakType: "stretch" | "walk" | "breathe" | "hydration";
  duration: number;
}

export interface SmokingLog {
  id: string;
  userId: string;
  cigarettesSmoked: number;
  cravingLevel: number;
  date: string;
  createdAt: string;
}

export interface LogSmokingRequest {
  cigarettesSmoked: number;
  cravingLevel: number;
  date?: string;
}

// ==================== Gamification ====================
export interface PointsResponse {
  totalPoints: number;
  level: number;
  xpToNextLevel: number;
  currentLevelXp: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: string;
}

export interface StreakResponse {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string;
}

export interface TierResponse {
  tier: "bronze" | "silver" | "gold";
  points: number;
  nextTierThreshold: number;
}

// ==================== Leaderboard ====================
export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  avatar?: string;
  points: number;
  tier: string;
}

export interface LeaderboardResponse {
  entries: LeaderboardEntry[];
  page: number;
  totalPages: number;
}

export interface MyRankResponse {
  rank: number;
  totalUsers: number;
  points: number;
  tier: string;
}

// ==================== Peer Challenges ====================
export interface PeerChallenge {
  id: string;
  groupId: string;
  groupName: string;
  creatorId: string;
  members: string[];
  challengeType: string;
  startDate: string;
  endDate: string;
  status: "active" | "completed" | "cancelled";
  createdAt: string;
}

export interface CreatePeerChallengeRequest {
  groupId: string;
  groupName: string;
  creatorId: string;
  members: string[];
  challengeType: string;
  startDate: string;
  endDate: string;
}

export interface UpdatePeerChallengeRequest {
  members?: string[];
}

// ==================== Reminders ====================
export interface ReminderSetting {
  type: "hydration" | "exercise" | "work_session" | "smoking_avoidance";
  enabled: boolean;
}

export interface ReminderSchedule {
  reminders: ReminderSetting[];
}

// ==================== API Response Wrapper ====================
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedParams {
  page?: number;
  limit?: number;
}
