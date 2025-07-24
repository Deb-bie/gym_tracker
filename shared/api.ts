export interface User {
  id: number;
  email: string;
  username: string;
  password?: string;
  equipments?: Equipment[];
  workouts?: WorkoutSession[];
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
    // rememberMe?: boolean;
}

export interface SignupData {
  username: string;
  email: string;
  password: string;   
}

export interface Equipment {
  id: number;
  name: string;
  type: "cardio" | "strength" | "free_weights" | "machine";
  description?: string;
  targetMuscles: TargetMuscle[];
  createdBy: User;
  workoutExercises: Exercise[];
  createdAt: string;
  updatedAt: string;
}

export interface TargetMuscle {
  id: number;
  muscle: string;
  equipment: Equipment;
}

export interface Exercise {
  id: number;
  workoutSession: WorkoutSession;
  equipment: Equipment;
  sets: Set[];
  notes?: string;
}

export interface Set {
  id: number;
  reps: number;
  weight: number;
  workoutExercise: Exercise;
} 

export interface WorkoutSession {
  id: number;
  date: string;
  startTime: string;
  endTime?: string;
  workoutExercises: Exercise[];
  notes?: string;
  user?: User
}

export interface ProgressData {
  equipmentId: number;
  exercises: Exercise[];
  maxWeight: number;
  totalVolume: number;
  lastWorkout: string;
}
