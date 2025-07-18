'use client';

import { useState, useEffect } from "react";
import { Equipment, ProgressData } from "@/shared/api";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Calendar, Weight } from "lucide-react";
import { ProgressChart } from "@/components/ProgressChart";
import { getAllEquipmentsByUser, getEquipmentProgress } from "@/lib/api";

export default function ProgressPage() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [selectedEquipmentId, setSelectedEquipmentId] = useState<string>("");
  const [progressData, setProgressData] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(false);
  

  useEffect(() => {
    fetchEquipment();
  }, []);

  useEffect(() => {
    if (selectedEquipmentId) {
      fetchProgress(selectedEquipmentId);
    }
  }, [selectedEquipmentId]);

  const fetchEquipment = async () => {
    const token = localStorage.getItem('token');
    try {
      const data = await getAllEquipmentsByUser(token)
      setEquipment(data || []);
      if (data.length > 0) {
        setSelectedEquipmentId(data[0].id);
      }
    } catch (error) {
      console.error("Error fetching equipments:", error);
    }
  };

  const fetchProgress = async (id: string) => {
    setLoading(true);
    const equipmentId = Number(id);
    const token = localStorage.getItem('token');

    try {
      const response = await getEquipmentProgress(token, equipmentId);
      setProgressData(response || []);
    } catch (error) {
      console.error("Error fetching progress:", error);
    } finally {
      setLoading(false);
    }
  };

  const selectedEquipment = equipment.find(
    (eq) => eq.id === Number(selectedEquipmentId),
  );

  return (
    <div className="min-h-screen bg-[#f2f6f9] p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div>
                <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                  Progress Tracking
                </h1>
                <p className="text-slate-600 mt-1">
                  Monitor your improvement over time
                </p>
              </div>
            </div>
          </div>
        </div>

        {equipment.length === 0 ? (
          <Card>
            <CardContent className="pt-8">
              <div className="text-center py-12">
                <p className="text-slate-500 mb-12">
                  No equipment available for progress tracking
                </p>
                <Link href="/equipment">
                  <Button className="bg-black text-white">Add Equipment</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            <Card className="mb-6 bg-white border-[#e3e8f0]">
              <CardHeader>
                <CardTitle>Select Equipment</CardTitle>
                <CardDescription>
                  Choose equipment to view your progress
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Select
                  value={selectedEquipmentId}
                  onValueChange={setSelectedEquipmentId}
                >
                  <SelectTrigger className="w-full md:w-64 bg-white border-[#e3e8f0]">
                    <SelectValue placeholder="Select equipment" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-[#e3e8f0]">
                    {equipment.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {selectedEquipment && (
              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 ">
                  <Card className="bg-white border-[#e3e8f0]">
                    <CardHeader>
                      <CardTitle>
                        Progress Chart - {selectedEquipment.name}
                      </CardTitle>
                      <CardDescription>
                        Track your weight progression over time
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {loading ? (
                        <div className="text-center py-12">
                          <p className="text-slate-500">Loading progress...</p>
                        </div>
                      ) : progressData && progressData.exercises.length > 0 ? (
                        <ProgressChart exercises={progressData.exercises} />
                      ) : (
                        <div className="text-center py-12">
                          <p className="text-slate-500 mb-4">
                            No exercise data found for this equipment
                          </p>
                          <p className="text-sm text-slate-400">
                            Start using this equipment to see your progress
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <Card className="bg-white border-[#e3e8f0]">
                    <CardHeader>
                      <CardTitle>Statistics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {progressData ? (
                        <div className="space-y-4">
                          <div className="p-3 bg-blue-50 rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                              <Weight className="h-4 w-4 text-blue-600" />
                              <span className="text-sm font-medium text-blue-800">
                                Max Weight
                              </span>
                            </div>
                            <p className="text-2xl font-bold text-blue-700">
                              {progressData.maxWeight} kg
                            </p>
                          </div>

                          <div className="p-3 bg-green-50 rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                              <TrendingUp className="h-4 w-4 text-green-600" />
                              <span className="text-sm font-medium text-green-800">
                                Total Volume
                              </span>
                            </div>
                            <p className="text-2xl font-bold text-green-700">
                              {progressData.totalVolume.toLocaleString()} kg
                            </p>
                          </div>

                          <div className="p-3 bg-purple-50 rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                              <Calendar className="h-4 w-4 text-purple-600" />
                              <span className="text-sm font-medium text-purple-800">
                                Last Workout
                              </span>
                            </div>
                            <p className="text-lg font-semibold text-purple-700">
                              {new Date(
                                progressData.lastWorkout,
                              ).toLocaleDateString()}
                            </p>
                          </div>

                          <div className="pt-4 border-t">
                            <h4 className="font-medium mb-2">Target Muscles</h4>
                            <div className="flex flex-wrap gap-1">
                              {selectedEquipment.targetMuscles.map((muscle, id) => (
                                <Badge key={id} variant="outline" className="border-[#e3e8f0]">
                                  {muscle.muscle}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-slate-500">
                            {loading ? "Loading..." : "No data available"}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
