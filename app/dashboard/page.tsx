'use client';

import { useState, useEffect } from "react";
import Link from 'next/link'
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
import { addNewWorkoutSession, getActiveSessions, getAllEquipmentsByUser, getRecentWorkouts } from "@/lib/api";

export default function Dashboard() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [recentSessions, setRecentSessions] = useState<WorkoutSession[]>([]);
  const [activeSession, setActiveSession] = useState<WorkoutSession| null>(
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
  }, [loading, user,recentSessions]);

  const fetchEquipment = async () => {
    try {
      const token = localStorage.getItem('token');
      const data = await getAllEquipmentsByUser(token)
      setEquipment(data || []);
    } catch (error) {
      console.error("Error fetching equipment:", error);
    }
  };

  const fetchRecentSessions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await getRecentWorkouts(token);
      setRecentSessions(response || []);
    } catch (error) {
      console.error("Error fetching recent sessions: ", error);
    }
  };

  const checkActiveSession = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await getActiveSessions(token);
      setActiveSession(response);
    } catch (error) {
      console.error("Error checking active session:", error);
    }
  };

  const startNewWorkout = async () => {
    try {
      const token = localStorage.getItem('token');
      const data = {
        date: new Date().toISOString().split("T")[0],
        startTime: new Date().toISOString(),
      }
      const response = await addNewWorkoutSession(token, data)
      setActiveSession(response);
      return response

    } catch (error) {
      console.error("Error starting workout:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#f2f6f9]  p-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-semibold text-slate-800 flex items-center gap-3 ">
                Today's Workout
              </h1>
              <p className="text-slate-600 mt-2">
                Track your progress and crush your goals.
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
                <Link href={`/workout/${activeSession.id}`} className="bg-black text-white hover:bg-emerald-400 hover:text-black hover:cursor-hand rounded-md">
                  <Button>Continue Workout</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow bg-white border-[#e3e8f0]"
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

          <Card className="cursor-pointer hover:shadow-lg transition-shadow bg-white border-[#e3e8f0]">
            <Link href="/progress">
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
            </Link>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow bg-white border-[#e3e8f0]">
            <Link href="/equipment">
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
            </Link>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 ">
          <div className="lg:col-span-2">
            <Card className="bg-white border-[#e3e8f0]">
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
                    <p className="text-slate-500 mb-12">
                      No equipment available
                    </p>
                    <Link href="/equipment">
                      <Button className="bg-black text-white">
                        <Plus className="h-4 w-4 mr-2 bg-b" />
                          Add Equipment
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    {equipment.map((item) => (
                      <EquipmentCard
                        key={item.id}
                        equipment={item}
                        onSelect={async () => {
                          if (activeSession) {
                            window.location.href = `/workout/${activeSession.id}?equipment=${item.id}`;
                          } else {
                            const response = await startNewWorkout();
                            router.push(`/workout/${response.id}?equipment=${item.id}`);
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
            <Card className="bg-white border-[#e3e8f0]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Recent Workouts
                </CardTitle>
              </CardHeader>
              <CardContent className="border-[#e3e8f0]">
                <WorkoutHistory sessions={recentSessions} limit={5} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
