/**
 * Task Store with Event Bus Integration
 */

import { create } from 'zustand';
import { Card } from '@/types';
import { eventBus, EventCategory, emitTaskEvent } from '@/eventBus';

interface TaskStore {
  tasks: Card[];
  selectedTask: Card | null;
  filters: {
    status?: Card['status'];
    assignedTo?: number;
    projectId?: number;
    sprintId?: number;
  };
  setTasks: (tasks: Card[]) => void;
  addTask: (task: Card) => void;
  updateTask: (id: number, updates: Partial<Card>) => void;
  deleteTask: (id: number) => void;
  setSelectedTask: (task: Card | null) => void;
  setFilters: (filters: Partial<TaskStore['filters']>) => void;
  clearFilters: () => void;
  getFilteredTasks: () => Card[];
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  selectedTask: null,
  filters: {},

  setTasks: (tasks) => {
    set({ tasks });
    eventBus.emit(EventCategory.TASK, 'list_updated', { tasks });
  },

  addTask: (task) => {
    set((state) => ({
      tasks: [...state.tasks, task],
    }));
    emitTaskEvent('created', task.id, task.sprintId, undefined, task);
  },

  updateTask: (id, updates) => {
    set((state) => {
      const task = state.tasks.find((t) => t.id === id);
      const updatedTasks = state.tasks.map((t) =>
        t.id === id ? { ...t, ...updates } : t
      );
      const updatedTask = updatedTasks.find((t) => t.id === id);

      // Emit status change event if status changed
      if (task && updates.status && task.status !== updates.status) {
        emitTaskEvent(
          'status_changed',
          id,
          updatedTask?.sprintId,
          undefined,
          updatedTask,
          undefined,
          task.status,
          updates.status
        );
      } else {
        emitTaskEvent('updated', id, updatedTask?.sprintId, undefined, updatedTask);
      }

      return {
        tasks: updatedTasks,
        selectedTask:
          state.selectedTask?.id === id
            ? { ...state.selectedTask, ...updates }
            : state.selectedTask,
      };
    });
  },

  deleteTask: (id) => {
    set((state) => {
      const task = state.tasks.find((t) => t.id === id);
      return {
        tasks: state.tasks.filter((t) => t.id !== id),
        selectedTask: state.selectedTask?.id === id ? null : state.selectedTask,
      };
    });
    emitTaskEvent('deleted', id);
  },

  setSelectedTask: (task) => {
    set({ selectedTask: task });
    if (task) {
      eventBus.emit(EventCategory.TASK, 'selected', { taskId: task.id, task });
    }
  },

  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    }));
  },

  clearFilters: () => {
    set({ filters: {} });
  },

  getFilteredTasks: () => {
    const { tasks, filters } = get();
    return tasks.filter((task) => {
      if (filters.status && task.status !== filters.status) return false;
      if (filters.assignedTo && task.assignedTo !== filters.assignedTo) return false;
      if (filters.sprintId && task.sprintId !== filters.sprintId) return false;
      return true;
    });
  },
}));
