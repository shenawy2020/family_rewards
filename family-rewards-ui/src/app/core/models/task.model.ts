export interface FamilyTask {
  id: number;
  title: string;
  description: string;
  stars: number;
  type: string;
  createdBy: number;
  createdByName: string;
  createdAt: string;
  icon?: string;
}

export interface CreateTaskDto {
  title: string;
  description: string;
  stars: number;
  type: number; // 1=Daily, 2=Weekly, 3=Custom
  icon?: string;
}

export interface TaskCompletion {
  id: number;
  taskId: number;
  taskTitle: string;
  stars: number;
  childId: number;
  childName: string;
  childAvatarUrl?: string;
  status: string;
  completedAt: string;
  notes?: string;
  imageProofUrl?: string;
}

export interface CompleteTaskDto {
  taskId: number;
  notes?: string;
}

export interface ApproveTaskDto {
  completionId: number;
  status: number; // 2=Approved, 3=Rejected
  notes?: string;
}
