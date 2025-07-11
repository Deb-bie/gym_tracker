import { Equipment } from "../shared/api";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Dumbbell, Heart, Zap, Target } from "lucide-react";

interface EquipmentCardProps {
  equipment: Equipment;
  onSelect: () => void;
}

const typeIcons = {
  cardio: Heart,
  strength: Dumbbell,
  "free_weights": Zap,
  machine: Target,
};

const typeColors = {
  cardio: "bg-red-100 text-red-700",
  strength: "bg-blue-100 text-blue-700",
  "free_weights": "bg-yellow-100 text-yellow-700",
  machine: "bg-green-100 text-green-700",
};

export function EquipmentCard({ equipment, onSelect }: EquipmentCardProps) {
  const Icon = typeIcons[equipment.type];

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer group border-[#e3e8f0]">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-full ${typeColors[equipment.type]}`}>
              <Icon className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">{equipment.name}</h3>
              <Badge variant="secondary" className="text-xs mt-1 bg-gray-200">
                {equipment.type.replace("_", " ")}
              </Badge>
            </div>
          </div>
        </div>

        {equipment.description && (
          <p className="text-sm text-slate-600 mb-3 line-clamp-2">
            {equipment.description}
          </p>
        )}

        {equipment.targetMuscles.length > 0 && (
          <div className="mb-3">
            <p className="text-xs text-slate-500 mb-1">Target Muscles:</p>
            <div className="flex flex-wrap gap-1">

              {equipment.targetMuscles?.slice(0, 3).map((muscleObj: { id: number; muscle: string }) => (
                <Badge key={muscleObj.id} variant="outline" className="text-xs border-gray-200">
                  {muscleObj.muscle}
                </Badge>
              ))}
              {equipment.targetMuscles.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{equipment.targetMuscles.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}

        <Button
          onClick={onSelect}
          className="w-full hover:bg-black hover:text-white transition-colors"
          variant="outline"
        >
          Use Equipment
        </Button>
      </CardContent>
    </Card>
  );
}

