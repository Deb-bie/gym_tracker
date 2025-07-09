'use client';

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Equipment, WorkoutSession } from "../../shared/api";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Plus, Dumbbell, Activity, TrendingUp, Calendar } from "lucide-react";
import { EquipmentCard } from "../../components/EquipmentCard";
import { WorkoutHistory } from "../../components/WorkoutHistory";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [recentSessions, setRecentSessions] = useState<WorkoutSession[]>([]);
  const [activeSession, setActiveSession] = useState<WorkoutSession | null>(
    null,
  );
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    fetchEquipment();
    fetchRecentSessions();
    checkActiveSession();

    if (!loading && !user) {
      router.push('/login');
    }
  }, [loading, user]);

  const fetchEquipment = async () => {
    try {
      const response = await fetch("/api/equipment");
      const data = await response.json();
      setEquipment(data.equipment || []);
    } catch (error) {
      console.error("Error fetching equipment:", error);
    }
  };

  const fetchRecentSessions = async () => {
    try {
      const response = await fetch("/api/workouts?limit=5");
      const data = await response.json();
      setRecentSessions(data.sessions || []);
    } catch (error) {
      console.error("Error fetching recent sessions:", error);
    }
  };

  const checkActiveSession = async () => {
    try {
      const response = await fetch("/api/workouts/active");
      if (response.ok) {
        const data = await response.json();
        setActiveSession(data.session);
      }
    } catch (error) {
      console.error("Error checking active session:", error);
    }
  };

  const startNewWorkout = async () => {
    try {
      const response = await fetch("/api/workouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: new Date().toISOString().split("T")[0],
          startTime: new Date().toISOString(),
        }),
      });
      const data = await response.json();
      setActiveSession(data.session);
    } catch (error) {
      console.error("Error starting workout:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-semibold text-slate-800 flex items-center gap-3 ">
                Today's Workout
              </h1>
              <p className="text-slate-600 mt-2">
                Track your progress and ccrush your goals.
              </p>
            </div>
          </div>
        </div>

        {activeSession && (
          <Card className="mb-6 border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Activity className="h-6 w-6 text-green-600" />
                  <div>
                    <h3 className="font-semibold text-green-800">
                      Active Workout Session
                    </h3>
                    <p className="text-green-600 text-sm">
                      Started at{" "}
                      {new Date(activeSession.startTime).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                {/* <Link to={`/workout/${activeSession.id}`}> */}
                  <Button>Continue Workout</Button>
                {/* </Link> */}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={startNewWorkout}
          >
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Plus className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Start New Workout</h3>
                  <p className="text-sm text-slate-600">
                    Begin tracking your exercises
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            {/* <Link to="/progress"> */}
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-green-100 rounded-full">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">View Progress</h3>
                    <p className="text-sm text-slate-600">
                      See your improvement over time
                    </p>
                  </div>
                </div>
              </CardContent>
            {/* </Link> */}
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            {/* <Link to="/equipment"> */}
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-purple-100 rounded-full">
                    <Dumbbell className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Manage Equipment</h3>
                    <p className="text-sm text-slate-600">
                      Add or edit gym equipment
                    </p>
                  </div>
                </div>
              </CardContent>
            {/* </Link> */}
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Dumbbell className="h-5 w-5" />
                  Available Equipment
                </CardTitle>
                <CardDescription>
                  Select equipment to start logging your exercises
                </CardDescription>
              </CardHeader>
              <CardContent>
                {equipment.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-slate-500 mb-4">
                      No equipment available
                    </p>
                    {/* <Link to="/equipment"> */}
                      <Button>Add Equipment</Button>
                    {/* </Link> */}
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    {equipment.map((item) => (
                      <EquipmentCard
                        key={item.id}
                        equipment={item}
                        onSelect={() => {
                          if (activeSession) {
                            window.location.href = `/workout/${activeSession.id}?equipment=${item.id}`;
                          } else {
                            startNewWorkout().then(() => {
                              window.location.href = `/workout?equipment=${item.id}`;
                            });
                          }
                        }}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Recent Workouts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <WorkoutHistory sessions={recentSessions} limit={5} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
