/**
 * API Client for HealthMate backend
 * Base URL: http://localhost:3000/api/v1
 *
 * Uses in-memory token store (tokens reset on app restart).
 * Swap to expo-secure-store for production builds.
 */
import type {
  ApiResponse,
  LoginRequest,
  LoginResponse,
  SignupRequest,
  RefreshRequest,
  User,
  UpdateProfileRequest,
  HealthProfile,
  CreateHealthProfileRequest,
  UpdateHealthProfileRequest,
  BMIResponse,
  WorkSession,
  CreateWorkSessionRequest,
  UpdateWorkSessionRequest,
  WorkSessionListResponse,
  LogHydrationRequest,
  HydrationLog,
  HydrationListResponse,
  LogExerciseRequest,
  ExerciseLog,
  ExerciseListResponse,
  LogBreakRequest,
  BreakLog,
  BreakListResponse,
  LogSmokingRequest,
  SmokingLog,
  PointsResponse,
  AchievementsResponse,
  StreakResponse,
  LeaderboardResponse,
  PeerChallenge,
  PeerChallengeListResponse,
  PeerChallengeDetailsResponse,
  CreatePeerChallengeRequest,
  UpdatePeerChallengeRequest,
  ReminderScheduleResponse,
  UpdateReminderRequest,
  UpdateReminderResponse,
  TestReminderResponse,
  ReminderType,
  PaginatedParams,
  AuthTokens,
} from "./types";

const BASE_URL = "http://10.10.10.180:3000/api/v1";

/**
 * In-memory token store
 * Works reliably in Expo Go without native modules.
 */
let _accessToken: string | null = null;
let _refreshToken: string | null = null;

/** Store tokens */
export async function storeTokens(tokens: AuthTokens): Promise<void> {
  _accessToken = tokens.accessToken;
  _refreshToken = tokens.refreshToken;
}

/** Get access token */
export async function getAccessToken(): Promise<string | null> {
  return _accessToken;
}

/** Get refresh token */
export async function getRefreshToken(): Promise<string | null> {
  return _refreshToken;
}

/** Clear tokens on logout */
export async function clearTokens(): Promise<void> {
  _accessToken = null;
  _refreshToken = null;
}

/** Core fetch wrapper with auth + token refresh */
async function request<T>(
  path: string,
  options: RequestInit = {},
  requiresAuth = true
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (requiresAuth) {
    const token = await getAccessToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  let response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  // Attempt token refresh on 401
  if (response.status === 401 && requiresAuth) {
    const refreshed = await attemptRefresh();
    if (refreshed) {
      const newToken = await getAccessToken();
      headers["Authorization"] = `Bearer ${newToken}`;
      response = await fetch(`${BASE_URL}${path}`, {
        ...options,
        headers,
      });
    }
  }

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new ApiError(
      errorBody.message || `Request failed with status ${response.status}`,
      response.status,
      errorBody
    );
  }

  return response.json();
}

/** Attempt to refresh the access token */
async function attemptRefresh(): Promise<boolean> {
  try {
    const refreshToken = await getRefreshToken();
    if (!refreshToken) return false;

    const response = await fetch(`${BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) return false;

    const data = await response.json();
    await storeTokens({
      accessToken: data.accessToken || data.data?.accessToken,
      refreshToken: data.refreshToken || data.data?.refreshToken,
    });
    return true;
  } catch {
    return false;
  }
}

/** Custom API error */
export class ApiError extends Error {
  status: number;
  body: unknown;

  constructor(message: string, status: number, body: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

// ==================== Auth API ====================
export const authApi = {
  signup(data: SignupRequest) {
    return request<ApiResponse<LoginResponse>>("/auth/signup", {
      method: "POST",
      body: JSON.stringify(data),
    }, false);
  },

  login(data: LoginRequest) {
    return request<ApiResponse<LoginResponse>>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    }, false);
  },

  getMe() {
    return request<ApiResponse<User>>("/auth/me");
  },

  updateMe(data: UpdateProfileRequest) {
    return request<ApiResponse<User>>("/auth/me", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  refresh(data: RefreshRequest) {
    return request<ApiResponse<AuthTokens>>("/auth/refresh", {
      method: "POST",
      body: JSON.stringify(data),
    }, false);
  },
};

// ==================== Health Profile API ====================
export const healthProfileApi = {
  create(data: CreateHealthProfileRequest) {
    return request<ApiResponse<HealthProfile>>("/health-profile", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  get() {
    return request<ApiResponse<HealthProfile>>("/health-profile");
  },

  update(data: UpdateHealthProfileRequest) {
    return request<ApiResponse<HealthProfile>>("/health-profile", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  getBMI() {
    return request<ApiResponse<BMIResponse>>("/health-profile/bmi");
  },
};

// ==================== Work Sessions API ====================
export const workSessionsApi = {
  create(data: CreateWorkSessionRequest) {
    return request<ApiResponse<WorkSession>>("/work-sessions", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  list() {
    return request<ApiResponse<WorkSessionListResponse>>("/work-sessions");
  },

  get(id: string) {
    return request<ApiResponse<WorkSession>>(`/work-sessions/${id}`);
  },

  update(id: string, data: UpdateWorkSessionRequest) {
    return request<ApiResponse<WorkSession>>(`/work-sessions/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  delete(id: string) {
    return request<ApiResponse<WorkSession>>(`/work-sessions/${id}`, {
      method: "DELETE",
    });
  },
};

// ==================== Activities API ====================
export const activitiesApi = {
  // --- Hydration ---
  logHydration(data: LogHydrationRequest) {
    return request<ApiResponse<HydrationLog>>("/activities/hydration", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  getHydration(params?: PaginatedParams) {
    const query = params
      ? `?page=${params.page || 1}&limit=${params.limit || 20}`
      : "";
    return request<ApiResponse<HydrationListResponse>>(`/activities/hydration${query}`);
  },

  // --- Exercise ---
  logExercise(data: LogExerciseRequest) {
    return request<ApiResponse<ExerciseLog>>("/activities/exercise", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  getExercise(params?: PaginatedParams) {
    const query = params
      ? `?page=${params.page || 1}&limit=${params.limit || 20}`
      : "";
    return request<ApiResponse<ExerciseListResponse>>(`/activities/exercise${query}`);
  },

  // --- Breaks ---
  logBreak(data: LogBreakRequest) {
    return request<ApiResponse<BreakLog>>("/activities/breaks", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  getBreaks(params?: PaginatedParams) {
    const query = params
      ? `?page=${params.page || 1}&limit=${params.limit || 20}`
      : "";
    return request<ApiResponse<BreakListResponse>>(`/activities/breaks${query}`);
  },

  // --- Smoking ---
  logSmoking(data: LogSmokingRequest) {
    return request<ApiResponse<SmokingLog>>("/activities/smoking", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};

// ==================== Gamification API ====================
export const gamificationApi = {
  getPoints() {
    return request<ApiResponse<PointsResponse>>("/gamification/points");
  },

  getAchievements() {
    return request<ApiResponse<AchievementsResponse>>("/gamification/achievements");
  },

  getStreaks() {
    return request<ApiResponse<StreakResponse>>("/gamification/streaks");
  },
};

// ==================== Leaderboard API ====================
export const leaderboardApi = {
  getGlobal(params?: PaginatedParams) {
    const query = params
      ? `?page=${params.page || 1}&limit=${params.limit || 20}`
      : "";
    return request<ApiResponse<LeaderboardResponse>>(`/leaderboards/global${query}`);
  },

  getByTier(tier: string, params?: PaginatedParams) {
    const query = `?tier=${tier}&page=${params?.page || 1}&limit=${params?.limit || 20}`;
    return request<ApiResponse<LeaderboardResponse>>(`/leaderboards/tier${query}`);
  },

  getLocal(groupId: string, params?: PaginatedParams) {
    const query = `?groupId=${groupId}&page=${params?.page || 1}&limit=${params?.limit || 20}`;
    return request<ApiResponse<LeaderboardResponse>>(`/leaderboards/local${query}`);
  },
};

// ==================== Peer Challenges API ====================
export const peerChallengesApi = {
  create(data: CreatePeerChallengeRequest) {
    return request<ApiResponse<PeerChallenge>>("/peer-challenges", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  list() {
    return request<ApiResponse<PeerChallengeListResponse>>("/peer-challenges");
  },

  get(id: string) {
    return request<ApiResponse<PeerChallengeDetailsResponse>>(`/peer-challenges/${id}`);
  },

  update(id: string, data: UpdatePeerChallengeRequest) {
    return request<ApiResponse<PeerChallenge>>(`/peer-challenges/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  join(id: string) {
    return request<ApiResponse<PeerChallenge>>(`/peer-challenges/${id}/join`, {
      method: "POST",
    });
  },

  leave(id: string) {
    return request<ApiResponse<Record<string, never>>>(`/peer-challenges/${id}/leave`, {
      method: "POST",
    });
  },

  delete(id: string) {
    return request<ApiResponse<PeerChallenge>>(`/peer-challenges/${id}`, {
      method: "DELETE",
    });
  },
};

// ==================== Reminders API ====================
export const remindersApi = {
  getSchedule() {
    return request<ApiResponse<ReminderScheduleResponse>>("/reminders/schedule");
  },

  updateReminder(data: UpdateReminderRequest) {
    return request<ApiResponse<UpdateReminderResponse>>("/reminders/schedule", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  sendTest(type: ReminderType) {
    return request<ApiResponse<TestReminderResponse>>(`/reminders/test/${type}`, {
      method: "POST",
    });
  },
};
