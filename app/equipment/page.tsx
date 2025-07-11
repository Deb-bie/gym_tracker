'use client';

import { useState, useEffect } from "react";
import Link from 'next/link';
import { Equipment } from "@/shared/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, ArrowLeft, Trash2 } from "lucide-react";
import { EquipmentCard } from "@/components/EquipmentCard";
import { addNewEquipment, getAllEquipmentsByUser, deleteUserEquipment } from "@/lib/api";

export default function EquipmentPage() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    type: "strength" as Equipment["type"],
    description: "",
    targetMuscles: "",
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchEquipment();
  }, []);

  const fetchEquipment = async () => {
    try {
      const data = await getAllEquipmentsByUser(token)
      setEquipment(data || []);
    } catch (error) {
      console.error("Error fetching equipments:", error);
    }
  };

  const addEquipment = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const newEquipment = {
        ...formData,
        targetMuscles: formData.targetMuscles
          .split(",")
          .map((muscle) => muscle.trim())
          .filter(Boolean),
      };

      const response = await addNewEquipment(token, newEquipment)
      setEquipment([...equipment, response]);
      setFormData({
        name: "",
        type: "strength",
        description: "",
        targetMuscles: "",
      });
      setShowForm(false);
    } catch (error) {
      console.error("Error adding equipment:", error);
    }
  };

  const deleteEquipment = async (id: any) => {
    try {
      await deleteUserEquipment(token, id);
      setEquipment(equipment.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting equipment:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div>
                <h1 className="text-3xl font-bold text-slate-800">
                  Equipment Management
                </h1>
                <p className="text-slate-600 mt-1">
                  Add and manage your gym equipment
                </p>
              </div>
            </div>
            <Button onClick={() => setShowForm(!showForm)} className="bg-black text-white">
              <Plus className="h-4 w-4 mr-2 bg-b text-white" />
              Add Equipment
            </Button>
          </div>
        </div>

        {showForm && (
          <Card className="mb-6 bg-white border-[#e3e8f0]">
            <CardHeader>
              <CardTitle>Add New Equipment</CardTitle>
              <CardDescription>
                Enter details for new gym equipment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={addEquipment} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Equipment Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="e.g., Bench Press"
                      required
                      className="border-[#e3e8f0]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="type">Type</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value: Equipment["type"]) =>
                        setFormData({ ...formData, type: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent className="bg-white ">
                        <SelectItem value="strength">Strength</SelectItem>
                        <SelectItem value="cardio">Cardio</SelectItem>
                        <SelectItem value="free_weights">
                          Free Weights
                        </SelectItem>
                        <SelectItem value="machine">Machine</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description (optional)</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Brief description of the equipment..."
                    rows={2}
                    className="border-[#e3e8f0]"
                  />
                </div>

                <div>
                  <Label htmlFor="targetMuscles">
                    Target Muscles (comma-separated)
                  </Label>
                  <Input
                    id="targetMuscles"
                    value={formData.targetMuscles}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        targetMuscles: e.target.value,
                      })
                    }
                    className="border-[#e3e8f0]"
                    placeholder="e.g., Chest, Triceps, Shoulders"
                  />
                </div>

                <div className="flex gap-2">
                  <Button type="submit" className="bg-black text-white">Add Equipment</Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <Card className="bg-white border-[#e3e8f0]
">
          <CardHeader>
            <CardTitle>Current Equipment ({equipment.length})</CardTitle>
            <CardDescription>
              All equipment available in your gym
            </CardDescription>
          </CardHeader>
          <CardContent>
            {equipment.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-slate-500 mb-12">No equipment added yet</p>
                <Button onClick={() => setShowForm(true)} className="bg-black text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Equipment
                </Button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {equipment.map((item) => (
                  <div key={item.id} className="relative group">
                    <EquipmentCard
                      equipment={item}
                      onSelect={() => {
                        // Navigate to workout with this equipment
                        window.location.href = `/gym?equipment=${item.id}`;
                      }}
                    
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2 bg-red-600 text-white hover:text-red-700 hover:bg-transparent cursor-hand transition-opacity"
                      onClick={() => deleteEquipment(item.id)}
                    >
                      <Trash2 className="h-3 w-3 " />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
