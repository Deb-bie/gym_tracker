import { WorkoutSession } from "../shared/api";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Calendar, Clock, Dumbbell } from "lucide-react";
import Link from 'next/link'

interface WorkoutHistoryProps {
  sessions: WorkoutSession[];
  limit?: number;
}

export function WorkoutHistory({ sessions, limit }: WorkoutHistoryProps) {
  const displaySessions = limit ? sessions.slice(0, limit) : sessions;

  if (sessions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-500 mb-4">No workout history yet</p>
        <p className="text-sm text-slate-400">
          Start your first workout to see it here
        </p>
      </div>
    );
  }

  const formatDuration = (startTime: string, endTime?: string) => {
    if (!endTime) return "In progress";

    const start = new Date(startTime);
    const end = new Date(endTime);
    const diff = Math.round((end.getTime() - start.getTime()) / (1000 * 60));

    if (diff < 60) return `${diff}m`;
    const hours = Math.floor(diff / 60);
    const minutes = diff % 60;
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="space-y-3">
      {displaySessions.map((session, id) => (
        <div
          key={id}
          className="p-3 border rounded-lg hover:bg-slate-50 transition-colors border-[#e3e8f0]"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-slate-500" />
              <span className="text-sm font-medium">
                {new Date(session.date).toLocaleDateString()}
              </span>
            </div>
            <Badge variant={session.endTime ? "secondary" : "default"}>
              {session.endTime ? "Completed" : "Active"}
            </Badge>
          </div>

          <div className="flex items-center gap-4 text-sm text-slate-600 mb-2">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{formatDuration(session.startTime, session.endTime)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Dumbbell className="h-3 w-3" />
              <span>{session.workoutExercises.length} exercises</span>
            </div>
          </div>

          {session.notes && (
            <p className="text-xs text-slate-500 mb-2 line-clamp-1">
              {session.notes}
            </p>
          )}

          <Link href={`/workout/${session.id}`}>
            <Button variant="outline" size="sm" className="w-full text-xs border-[#e3e8f0]">
              View Details
            </Button>
          </Link>
        </div>
      ))}

      {limit && sessions.length > limit && (
        <div className="text-center pt-2">
          <Link href="/history">
            <Button variant="ghost" size="sm">
              View All ({sessions.length})
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
