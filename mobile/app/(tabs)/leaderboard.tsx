/**
 * Leaderboard tab - Global, Tier-based, and My Rank
 */
import { useState, useCallback } from "react";
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { leaderboardApi } from "@/services/api";
import type { LeaderboardEntry, MyRankResponse } from "@/services/types";
import Card from "@/components/Card";

type LeaderboardTab = "global" | "bronze" | "silver" | "gold";

export default function LeaderboardScreen() {
  const [activeTab, setActiveTab] = useState<LeaderboardTab>("global");
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [myRank, setMyRank] = useState<MyRankResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [activeTab])
  );

  async function fetchData() {
    setIsLoading(true);
    try {
      const [rankRes] = await Promise.allSettled([
        leaderboardApi.getMyRank(),
      ]);
      if (rankRes.status === "fulfilled") setMyRank(rankRes.value.data);

      let leaderboardRes;
      if (activeTab === "global") {
        leaderboardRes = await leaderboardApi.getGlobal({ limit: 50 });
      } else {
        leaderboardRes = await leaderboardApi.getByTier(activeTab, { limit: 50 });
      }
      setEntries(leaderboardRes.data.entries || []);
    } catch {
      // silently fail
    } finally {
      setIsLoading(false);
    }
  }

  const tierColors: Record<string, string> = {
    bronze: "#CD7F32",
    silver: "#C0C0C0",
    gold: "#FFD700",
  };

  function getRankIcon(rank: number): { name: keyof typeof Ionicons.glyphMap; color: string } | null {
    if (rank === 1) return { name: "trophy", color: "#FFD700" };
    if (rank === 2) return { name: "trophy", color: "#C0C0C0" };
    if (rank === 3) return { name: "trophy", color: "#CD7F32" };
    return null;
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-900" edges={["top"]}>
      {/* Header */}
      <View className="px-5 pt-4 pb-3">
        <Text className="text-white text-2xl font-bold">Leaderboard</Text>
        <Text className="text-slate-400 text-sm mt-1">
          Compete and climb the ranks
        </Text>
      </View>

      {/* My Rank card */}
      {myRank && (
        <Card variant="elevated" className="mx-5 mb-4">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <View
                className="w-12 h-12 rounded-full items-center justify-center mr-3"
                style={{
                  backgroundColor: `${tierColors[myRank.tier] || "#10B981"}20`,
                }}
              >
                <Text
                  className="text-xl font-extrabold"
                  style={{ color: tierColors[myRank.tier] || "#10B981" }}
                >
                  #{myRank.rank}
                </Text>
              </View>
              <View>
                <Text className="text-white text-base font-semibold">
                  Your Rank
                </Text>
                <Text className="text-slate-400 text-sm">
                  {myRank.points} pts &middot;{" "}
                  <Text style={{ color: tierColors[myRank.tier] }}>
                    {myRank.tier.charAt(0).toUpperCase() + myRank.tier.slice(1)}
                  </Text>
                </Text>
              </View>
            </View>
            <Text className="text-slate-500 text-xs">
              of {myRank.totalUsers} users
            </Text>
          </View>
        </Card>
      )}

      {/* Tier tabs */}
      <View className="flex-row mx-5 mb-4 bg-slate-800 rounded-xl p-1">
        {(
          [
            { id: "global", label: "Global" },
            { id: "bronze", label: "Bronze" },
            { id: "silver", label: "Silver" },
            { id: "gold", label: "Gold" },
          ] as const
        ).map((tab) => (
          <TouchableOpacity
            key={tab.id}
            className={`flex-1 items-center py-2.5 rounded-lg ${
              activeTab === tab.id ? "bg-emerald-500" : ""
            }`}
            onPress={() => setActiveTab(tab.id)}
          >
            <Text
              className={`text-xs font-semibold ${
                activeTab === tab.id ? "text-slate-900" : "text-slate-400"
              }`}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Leaderboard list */}
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#10B981" />
        </View>
      ) : entries.length === 0 ? (
        <View className="flex-1 items-center justify-center px-5">
          <Ionicons name="trophy-outline" size={48} color="#334155" />
          <Text className="text-slate-500 text-base mt-4 text-center">
            No leaderboard data yet.{"\n"}Start earning XP to appear here!
          </Text>
        </View>
      ) : (
        <FlatList
          data={entries}
          keyExtractor={(item) => `${item.rank}-${item.userId}`}
          contentContainerClassName="px-5 pb-8"
          renderItem={({ item }) => {
            const rankIcon = getRankIcon(item.rank);
            return (
              <View className="flex-row items-center bg-slate-800 rounded-xl px-4 py-3 mb-2">
                {/* Rank */}
                <View className="w-10 items-center mr-3">
                  {rankIcon ? (
                    <Ionicons
                      name={rankIcon.name}
                      size={22}
                      color={rankIcon.color}
                    />
                  ) : (
                    <Text className="text-slate-400 text-base font-bold">
                      {item.rank}
                    </Text>
                  )}
                </View>

                {/* Avatar placeholder */}
                <View className="w-10 h-10 rounded-full bg-slate-700 items-center justify-center mr-3">
                  <Text className="text-slate-300 text-sm font-bold">
                    {item.name.charAt(0).toUpperCase()}
                  </Text>
                </View>

                {/* Name & tier */}
                <View className="flex-1">
                  <Text className="text-white text-base font-medium">
                    {item.name}
                  </Text>
                  <Text
                    className="text-xs"
                    style={{
                      color: tierColors[item.tier.toLowerCase()] || "#94A3B8",
                    }}
                  >
                    {item.tier}
                  </Text>
                </View>

                {/* Points */}
                <View className="items-end">
                  <Text className="text-white text-base font-bold">
                    {item.points.toLocaleString()}
                  </Text>
                  <Text className="text-slate-500 text-xs">pts</Text>
                </View>
              </View>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}
