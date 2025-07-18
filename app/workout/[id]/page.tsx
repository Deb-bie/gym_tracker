'use client';

import { useState, useEffect } from "react";
import { useSearchParams, useParams } from 'next/navigation';
import { WorkoutSession, Equipment } from "@/shared/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Dumbbell, Plus, Check } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { addNewExercise, endWorkoutSession, getAllEquipmentsByUser, getWorkoutSessionById } from "@/lib/api";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function WorkoutSessionPage() {
  const { id } = useParams<{ id: any }>();
  const searchParams = useSearchParams();
  const preselectedEquipmentId = searchParams.get("equipment");
  const [session, setSession] = useState<WorkoutSession | null>(null);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [exercises, setExercises] = useState<any[]>([]);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(
    null,
  );
  const [sets, setSets] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showExerciseForm, setShowExerciseForm] = useState(false);
  const [setsFormData, setSetsFormData] = useState({
    weight: "",
    setNumber: "",
    reps: "",
  })

  useEffect(() => {
    if (id) {
      fetchSession();
    }
    fetchEquipment();
  }, [id, exercises]);

  useEffect(() => {
    if (preselectedEquipmentId && equipment.length > 0) {
      const preselected = equipment.find(
        (eq) => eq.id === Number(preselectedEquipmentId),
      );
      if (preselected) {
        setSelectedEquipment(preselected);
        setShowExerciseForm(true);
      }
    }
    const saved = localStorage.getItem("savedSets");
    if (saved) {
      setSets(JSON.parse(saved));
    }
  }, [preselectedEquipmentId, equipment, session]);

  useEffect(() => {
    localStorage.setItem("savedSets", JSON.stringify(sets));
  }, [sets]);

  const fetchSession = async () => {
    try {
      const token = localStorage.getItem('token');
      const data = await getWorkoutSessionById(token, id)

      const workSession: WorkoutSession = {
        id: data.id,
        date: data.date,
        startTime: data.startTime,
        endTime: data.endTime,
        workoutExercises: data.workoutExercises,
        notes: data.notes
      }
      setSession(workSession);
    } catch (error) {
      console.error("Error fetching session:", error);
    }
  };

  const fetchEquipment = async () => {
    try {
      const token = localStorage.getItem('token');
      const data = await getAllEquipmentsByUser(token)
      setEquipment(data || []);
    } catch (error) {
      console.error("Error fetching equipment:", error);
    }
  };

  const addSet = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const newExerciseSet = {
        ...setsFormData,
        exerciseId: selectedEquipment?.id
      };
      setSets([...sets, newExerciseSet]);

      setSetsFormData({
        weight: "",
        setNumber: "",
        reps: "",
      })

    } catch (error) {
      console.error("Error adding set:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addExercise = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      const newExercise = {
        equipmentId: selectedEquipment?.id,
        workoutSessionId: Number(id),
        sets: sets.map(s => ({
          weight: Number(s.weight),
          reps: Number(s.reps),
        }))
      }

      const response = await addNewExercise(token, newExercise)
      if (response) {
        localStorage.removeItem("savedSets");
      }
      setExercises([response])
      setShowExerciseForm(false)
      await fetchSession()
    } catch (error) {
      console.error("Error submitting exercise:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const endWorkout = async () => {
    if (!session) return;

    try {
      const token = localStorage.getItem('token');
      const data = {
        endTime: new Date().toISOString()
      }

      const response = await endWorkoutSession(token, Number(id), data)
      setSession({
        ...session,
        endTime: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error ending workout:", error);
    }
  };

  const formatDuration = (startTime: string, endTime?: string) => {
    const start = new Date(startTime);
    const end = endTime ? new Date(endTime) : new Date();
    const diff = Math.round((end.getTime() - start.getTime()) / (1000 * 60));

    if (diff < 60) return `${diff}m`;
    const hours = Math.floor(diff / 60);
    const minutes = diff % 60;
    return `${hours}h ${minutes}m`;
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <p className="text-slate-500">Loading workout session...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div>
                <h1 className="text-2xl font-bold text-slate-800">
                  Workout Session
                </h1>
                <div className="flex items-center gap-4 text-sm text-slate-600 mt-1">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>
                      {formatDuration(session.startTime, session.endTime)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Dumbbell className="h-4 w-4" />
                    <span>{session.workoutExercises.length || 0} exercises</span>
                  </div>
                </div>
              </div>
            </div>
            {!session.endTime && (
              <Button
                onClick={endWorkout}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Check className="h-4 w-4 mr-2" />
                End Workout
              </Button>
            )}
          </div>
        </div>

        {session.endTime && (
          <Card className="mb-6 border-green-200 bg-green-50">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-600" />
                <span className="font-semibold text-green-800">
                  Workout Completed!
                </span>
                <Badge variant="secondary">
                  {new Date(session.endTime).toLocaleString()}
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}

        {showExerciseForm && selectedEquipment ? (
          <Card className="mb-6 bg-white border-[#e3e8f0]">
            <div className="">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="">
                    <CardTitle>{selectedEquipment.name}</CardTitle>
                    <CardDescription>
                      Enter your sets, reps, and weight for this exercise
                    </CardDescription>
                  </div>
                  <Button className="bg-black text-white hover:text-black hover:bg-green-500" onClick={addExercise}>
                    Finish Exercise
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={addSet} className="space-y-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="weight">Weight (lbs)</Label>
                      <Input
                        id="weight"
                        type="number"
                        min="1"
                        value={setsFormData.weight}
                        onChange={(e) =>
                          setSetsFormData({ ...setsFormData, weight: e.target.value })
                        }
                        placeholder="e.g., 185"
                        required
                        className="border-[#e3e8f0]"
                      />
                    </div>

                    <div>
                      <Label htmlFor="reps">Reps</Label>
                      <Input
                        id="reps"
                        type="number"
                        min="1"
                        value={setsFormData.reps}
                        onChange={(e) =>
                          setSetsFormData({ ...setsFormData, reps: e.target.value })
                        }
                        placeholder="e.g., 8"
                        required
                        className="border-[#e3e8f0]"
                      />
                    </div>

                    <div>
                      <Label htmlFor="setNumber">Set Number</Label>
                      <Input
                        id="set"
                        type="number"
                        min="1"
                        value={setsFormData.setNumber}
                        onChange={(e) =>
                          setSetsFormData({ ...setsFormData, setNumber: e.target.value })
                        }
                        placeholder="e.g., 1"
                        required
                        className="border-[#e3e8f0]"
                      />
                    </div>

                  </div>

                  <div className="flex gap-2">
                    <Button type="submit" disabled={isSubmitting} className="flex-1 bg-black text-white hover:text-black hover:bg-green-500">
                      {isSubmitting ? "Completing..." : "Complete Set"}
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowExerciseForm(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </div>

            <div>
              <CardHeader className="py-2 font-bold">
                Set History
              </CardHeader>
              <CardContent>
                {sets.length == 0 ? (
                  <p className="text-slate-500 mb-4 text-center py-4">No set has been added</p>
                ) : (
                  <div>
                    {sets.map((set, index) => {
                      return (
                        <div key={index} className="my-2">
                          <div className="bg-[#eef2f6] border-[#e3e8f0] flex justify-between items-center p-2 rounded-md font-medium">
                            <span>Set {set.setNumber}</span>
                            <span>{set.weight} lbs x {set.reps} reps</span>
                            <Check className="h-4 w-4 mr-2" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </div>


          </Card>
        ) : (<></>)}

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="bg-white border-[#e3e8f0]">
              <CardHeader>
                <CardTitle>Exercises</CardTitle>
                <CardDescription>
                  Track your sets, reps, and weights for each exercise
                </CardDescription>
              </CardHeader>
              <CardContent>
                {session.workoutExercises.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-slate-500 mb-4">No exercises yet</p>
                    <p className="text-sm text-slate-400">
                      Select equipment to start adding exercises
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {session.workoutExercises.map((exercise, index) => {
                      return (
                        <div
                          key={exercise.id}
                          className="p-4 border rounded-lg bg-slate-50 border-[#e3e8f0]"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold">

                              {exercise.equipment.name || "Unknown Equipment"}
                            </h4>
                            <Badge variant="outline">#{index + 1}</Badge>
                          </div>
                          {exercise.sets.length > 0 ? (
                            <div>
                              {exercise.sets.map((set, id) => {
                                return (
                                  <div key={id} className="grid grid-cols-3 gap-4  pb-2 text-sm">
                                    <div>
                                      <span className="text-slate-500">Set:</span>
                                      <p className="font-medium">
                                        {id + 1}
                                      </p>
                                    </div>
                                    <div>
                                      <span className="text-slate-500">Weight:</span>
                                      <p className="font-medium">{set.weight} lbs</p>
                                    </div>
                                    <div>
                                      <span className="text-slate-500">Reps:</span>
                                      <p className="font-medium">{set.reps}</p>
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                          ) : (
                            <></>
                          )}
                          {exercise.notes && (
                            <p className="text-xs text-slate-500 mt-2">
                              {exercise.notes}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div>
            {preselectedEquipmentId ?
              <></>

              :

              <>
                {!session.endTime && (
                  <Card className="bg-white border-[#e3e8f0]">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Plus className="h-5 w-5" />
                        Add Exercise
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="text-sm text-slate-600 mb-4">
                          Select equipment to add an exercise:
                        </p>
                        {equipment.map((item) => (
                          <Button
                            key={item.id}
                            variant="outline"
                            className="w-full justify-start border-[#e3e8f0]"
                            onClick={() => {
                              setSelectedEquipment(item);
                              setShowExerciseForm(true);
                            }}
                          >
                            {item.name}
                          </Button>
                        ))}
                      </div>

                    </CardContent>
                  </Card>
                )}
              </>
            }
          </div>
        </div>
      </div>
    </div>
  );
}
