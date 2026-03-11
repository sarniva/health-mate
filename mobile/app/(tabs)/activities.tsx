/**
 * Activities tab - Hydration, Exercise, Breaks, Breathing
 */
import { useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { activitiesApi } from "@/services/api";
import type { HydrationLog } from "@/services/types";
import Card from "@/components/Card";
import Button from "@/components/Button";
import ProgressBar from "@/components/ProgressBar";

type ActivityTab = "hydration" | "exercise" | "breathing" | "breaks";

const DAILY_WATER_GOAL = 2500; // ml

export default function ActivitiesScreen() {
  const [activeTab, setActiveTab] = useState<ActivityTab>("hydration");

  return (
    <SafeAreaView className="flex-1 bg-slate-900" edges={["top"]}>
      {/* Header */}
      <View className="px-5 pt-4 pb-3">
        <Text className="text-white text-2xl font-bold">Activities</Text>
        <Text className="text-slate-400 text-sm mt-1">
          Track your daily wellness activities
        </Text>
      </View>

      {/* Tab selector */}
      <View className="flex-row mx-5 mb-4 bg-slate-800 rounded-xl p-1">
        {(
          [
            { id: "hydration", label: "Water", icon: "water-outline" },
            { id: "exercise", label: "Exercise", icon: "barbell-outline" },
            { id: "breathing", label: "Breathe", icon: "leaf-outline" },
            { id: "breaks", label: "Breaks", icon: "cafe-outline" },
          ] as const
        ).map((tab) => (
          <TouchableOpacity
            key={tab.id}
            className={`flex-1 flex-row items-center justify-center py-2.5 rounded-lg ${
              activeTab === tab.id ? "bg-emerald-500" : ""
            }`}
            onPress={() => setActiveTab(tab.id)}
          >
            <Ionicons
              name={tab.icon}
              size={16}
              color={activeTab === tab.id ? "#0F172A" : "#94A3B8"}
            />
            <Text
              className={`text-xs font-semibold ml-1 ${
                activeTab === tab.id ? "text-slate-900" : "text-slate-400"
              }`}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {activeTab === "hydration" && <HydrationTab />}
      {activeTab === "exercise" && <ExerciseTab />}
      {activeTab === "breathing" && <BreathingTab />}
      {activeTab === "breaks" && <BreaksTab />}
    </SafeAreaView>
  );
}

/** ---- Hydration Tab ---- */
function HydrationTab() {
  const [amount, setAmount] = useState("");
  const [isLogging, setIsLogging] = useState(false);
  const [logs, setLogs] = useState<HydrationLog[]>([]);
  const [totalToday, setTotalToday] = useState(0);

  useFocusEffect(
    useCallback(() => {
      fetchLogs();
    }, [])
  );

  async function fetchLogs() {
    try {
      const res = await activitiesApi.getHydration({ limit: 20 });
      const allLogs = res.data;
      setLogs(allLogs);
      // Sum today's intake
      const today = new Date().toDateString();
      const todayTotal = allLogs
        .filter((l) => new Date(l.date).toDateString() === today)
        .reduce((sum, l) => sum + l.amount, 0);
      setTotalToday(todayTotal);
    } catch {
      // silently fail
    }
  }

  async function logWater(ml: number) {
    setIsLogging(true);
    try {
      await activitiesApi.logHydration({ amount: ml });
      setTotalToday((prev) => prev + ml);
      setAmount("");
      fetchLogs();
    } catch {
      Alert.alert("Error", "Failed to log water intake");
    } finally {
      setIsLogging(false);
    }
  }

  const quickAmounts = [150, 250, 500, 750];

  return (
    <ScrollView contentContainerClassName="px-5 pb-8">
      {/* Daily progress */}
      <Card variant="elevated" className="mb-5">
        <View className="items-center mb-3">
          <Ionicons name="water" size={32} color="#3B82F6" />
          <Text className="text-3xl font-extrabold text-white mt-2">
            {totalToday} ml
          </Text>
          <Text className="text-slate-400 text-sm">
            of {DAILY_WATER_GOAL} ml daily goal
          </Text>
        </View>
        <ProgressBar
          progress={totalToday / DAILY_WATER_GOAL}
          color="#3B82F6"
          height={10}
          showPercentage
        />
      </Card>

      {/* Quick add buttons */}
      <Text className="text-white text-base font-semibold mb-3">
        Quick Add
      </Text>
      <View className="flex-row gap-3 mb-5">
        {quickAmounts.map((ml) => (
          <TouchableOpacity
            key={ml}
            className="flex-1 items-center bg-slate-800 rounded-xl py-3 border border-slate-700"
            onPress={() => logWater(ml)}
            disabled={isLogging}
          >
            <Ionicons name="water-outline" size={20} color="#3B82F6" />
            <Text className="text-white text-sm font-semibold mt-1">
              {ml}ml
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Custom amount */}
      <View className="flex-row gap-3 mb-6">
        <View className="flex-1 flex-row items-center bg-slate-800 rounded-xl px-4 border border-slate-700">
          <TextInput
            className="flex-1 text-white text-base py-3"
            placeholder="Custom amount (ml)"
            placeholderTextColor="#64748B"
            value={amount}
            onChangeText={(text) => setAmount(text.replace(/[^0-9]/g, ""))}
            keyboardType="number-pad"
          />
        </View>
        <Button
          title="Add"
          size="sm"
          onPress={() => {
            const ml = parseInt(amount, 10);
            if (ml > 0) logWater(ml);
          }}
          isLoading={isLogging}
          disabled={!amount}
        />
      </View>

      {/* Recent logs */}
      <Text className="text-white text-base font-semibold mb-3">
        Recent Logs
      </Text>
      {logs.length === 0 ? (
        <Text className="text-slate-500 text-sm text-center py-4">
          No water logged yet today
        </Text>
      ) : (
        logs.slice(0, 10).map((log) => (
          <View
            key={log.id}
            className="flex-row items-center justify-between bg-slate-800 rounded-xl px-4 py-3 mb-2"
          >
            <View className="flex-row items-center">
              <Ionicons name="water" size={18} color="#3B82F6" />
              <Text className="text-white text-base ml-3 font-medium">
                {log.amount} ml
              </Text>
            </View>
            <Text className="text-slate-500 text-xs">
              {new Date(log.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}

/** ---- Exercise Tab ---- */
function ExerciseTab() {
  const [isLogging, setIsLogging] = useState(false);

  const exercises = [
    { type: "Walking", icon: "walk-outline" as const, duration: 15, calories: 60, intensity: "low" as const },
    { type: "Running", icon: "bicycle-outline" as const, duration: 20, calories: 200, intensity: "high" as const },
    { type: "Stretching", icon: "body-outline" as const, duration: 10, calories: 30, intensity: "low" as const },
    { type: "Yoga", icon: "leaf-outline" as const, duration: 20, calories: 80, intensity: "medium" as const },
    { type: "Push-ups", icon: "fitness-outline" as const, duration: 10, calories: 100, intensity: "high" as const },
    { type: "Squats", icon: "barbell-outline" as const, duration: 10, calories: 80, intensity: "medium" as const },
  ];

  async function logExercise(exercise: (typeof exercises)[0]) {
    setIsLogging(true);
    try {
      await activitiesApi.logExercise({
        exerciseType: exercise.type,
        duration: exercise.duration,
        intensity: exercise.intensity,
        calories: exercise.calories,
      });
      Alert.alert(
        "Logged!",
        `${exercise.type} - ${exercise.duration} min, ~${exercise.calories} cal`
      );
    } catch {
      Alert.alert("Error", "Failed to log exercise");
    } finally {
      setIsLogging(false);
    }
  }

  return (
    <ScrollView contentContainerClassName="px-5 pb-8">
      <Text className="text-white text-base font-semibold mb-3">
        Quick Log Exercise
      </Text>
      <View className="gap-3">
        {exercises.map((ex) => (
          <TouchableOpacity
            key={ex.type}
            className="flex-row items-center bg-slate-800 rounded-xl p-4 border border-slate-700"
            onPress={() => logExercise(ex)}
            disabled={isLogging}
            activeOpacity={0.7}
          >
            <View className="w-12 h-12 rounded-xl bg-emerald-500/15 items-center justify-center mr-4">
              <Ionicons name={ex.icon} size={24} color="#10B981" />
            </View>
            <View className="flex-1">
              <Text className="text-white text-base font-semibold">
                {ex.type}
              </Text>
              <Text className="text-slate-400 text-sm">
                {ex.duration} min &middot; ~{ex.calories} cal &middot;{" "}
                {ex.intensity}
              </Text>
            </View>
            <Ionicons name="add-circle-outline" size={24} color="#10B981" />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

/** ---- Breathing Tab ---- */
function BreathingTab() {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale">("inhale");
  const [countdown, setCountdown] = useState(4);

  function startBreathing() {
    setIsActive(true);
    setPhase("inhale");
    setCountdown(4);

    let currentPhase: "inhale" | "hold" | "exhale" = "inhale";
    let count = 4;

    const interval = setInterval(() => {
      count--;
      if (count <= 0) {
        if (currentPhase === "inhale") {
          currentPhase = "hold";
          count = 7;
        } else if (currentPhase === "hold") {
          currentPhase = "exhale";
          count = 8;
        } else {
          currentPhase = "inhale";
          count = 4;
        }
        setPhase(currentPhase);
      }
      setCountdown(count);
    }, 1000);

    // Auto-stop after 2 minutes
    setTimeout(() => {
      clearInterval(interval);
      setIsActive(false);
      setPhase("inhale");
      setCountdown(4);
      Alert.alert("Well done!", "You completed a breathing exercise.");
    }, 120000);

    // Store interval for cleanup
    return () => clearInterval(interval);
  }

  const phaseColors = {
    inhale: "#3B82F6",
    hold: "#F59E0B",
    exhale: "#10B981",
  };

  const phaseLabels = {
    inhale: "Breathe In",
    hold: "Hold",
    exhale: "Breathe Out",
  };

  return (
    <View className="flex-1 items-center justify-center px-5">
      <View
        className="w-48 h-48 rounded-full items-center justify-center mb-8"
        style={{
          backgroundColor: `${phaseColors[phase]}20`,
          borderWidth: 3,
          borderColor: phaseColors[phase],
        }}
      >
        {isActive ? (
          <>
            <Text
              className="text-5xl font-extrabold"
              style={{ color: phaseColors[phase] }}
            >
              {countdown}
            </Text>
            <Text
              className="text-base font-semibold mt-2"
              style={{ color: phaseColors[phase] }}
            >
              {phaseLabels[phase]}
            </Text>
          </>
        ) : (
          <>
            <Ionicons name="leaf" size={48} color="#10B981" />
            <Text className="text-slate-400 text-sm mt-2">4-7-8 Method</Text>
          </>
        )}
      </View>

      <Text className="text-white text-xl font-bold text-center mb-2">
        {isActive ? "Focus on your breath" : "Breathing Exercise"}
      </Text>
      <Text className="text-slate-400 text-sm text-center mb-8 px-8">
        {isActive
          ? "Follow the rhythm: Inhale 4s, Hold 7s, Exhale 8s"
          : "The 4-7-8 breathing technique helps reduce anxiety and improve sleep"}
      </Text>

      <Button
        title={isActive ? "Stop" : "Start Breathing"}
        variant={isActive ? "danger" : "primary"}
        onPress={() => {
          if (isActive) {
            setIsActive(false);
            setPhase("inhale");
            setCountdown(4);
          } else {
            startBreathing();
          }
        }}
        icon={
          <Ionicons
            name={isActive ? "stop" : "play"}
            size={18}
            color={isActive ? "#F8FAFC" : "#0F172A"}
          />
        }
        className="w-full"
      />
    </View>
  );
}

/** ---- Breaks Tab ---- */
function BreaksTab() {
  const breakTypes = [
    {
      type: "stretch" as const,
      label: "Stretch Break",
      desc: "Stand up and stretch for 2 minutes",
      icon: "body-outline" as const,
      color: "#FB923C",
      duration: 2,
    },
    {
      type: "walk" as const,
      label: "Walk Break",
      desc: "Take a short 5-minute walk",
      icon: "walk-outline" as const,
      color: "#10B981",
      duration: 5,
    },
    {
      type: "breathe" as const,
      label: "Breathing Break",
      desc: "Deep breathing for 1 minute",
      icon: "leaf-outline" as const,
      color: "#A78BFA",
      duration: 1,
    },
    {
      type: "hydration" as const,
      label: "Hydration Break",
      desc: "Drink a glass of water",
      icon: "water-outline" as const,
      color: "#3B82F6",
      duration: 1,
    },
  ];

  async function logBreak(breakType: (typeof breakTypes)[0]) {
    try {
      await activitiesApi.logBreak({
        sessionId: "manual",
        breakType: breakType.type,
        duration: breakType.duration,
      });
      Alert.alert("Break logged!", `${breakType.label} - ${breakType.duration} min`);
    } catch {
      Alert.alert("Error", "Failed to log break");
    }
  }

  return (
    <ScrollView contentContainerClassName="px-5 pb-8">
      <Text className="text-white text-base font-semibold mb-3">
        Take a Micro-Break
      </Text>
      <Text className="text-slate-400 text-sm mb-5">
        Regular breaks boost productivity and reduce strain
      </Text>
      <View className="gap-3">
        {breakTypes.map((b) => (
          <TouchableOpacity
            key={b.type}
            className="flex-row items-center bg-slate-800 rounded-xl p-4 border border-slate-700"
            onPress={() => logBreak(b)}
            activeOpacity={0.7}
          >
            <View
              className="w-14 h-14 rounded-2xl items-center justify-center mr-4"
              style={{ backgroundColor: `${b.color}20` }}
            >
              <Ionicons name={b.icon} size={28} color={b.color} />
            </View>
            <View className="flex-1">
              <Text className="text-white text-base font-semibold">
                {b.label}
              </Text>
              <Text className="text-slate-400 text-sm mt-0.5">{b.desc}</Text>
            </View>
            <View className="bg-slate-700 px-2.5 py-1 rounded-lg">
              <Text className="text-slate-300 text-xs font-medium">
                {b.duration}m
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}
