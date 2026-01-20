import { create } from 'zustand';
import { Sprint } from '@/types';

interface SprintStore {
  sprints: Sprint[];
  selectedSprint: Sprint | null;
  setSprints: (sprints: Sprint[]) => void;
  addSprint: (sprint: Sprint) => void;
  updateSprint: (id: number, sprint: Partial<Sprint>) => void;
  deleteSprint: (id: number) => void;
  setSelectedSprint: (sprint: Sprint | null) => void;
  getSprintsByProject: (projectId: number) => Sprint[];
}

export const useSprintStore = create<SprintStore>((set, get) => ({
  sprints: [],
  selectedSprint: null,

  setSprints: (sprints) => set({ sprints }),

  addSprint: (sprint) =>
    set((state) => ({
      sprints: [...state.sprints, sprint],
    })),

  updateSprint: (id, updates) =>
    set((state) => ({
      sprints: state.sprints.map((s) =>
        s.id === id ? { ...s, ...updates } : s
      ),
      selectedSprint:
        state.selectedSprint?.id === id
          ? { ...state.selectedSprint, ...updates }
          : state.selectedSprint,
    })),

  deleteSprint: (id) =>
    set((state) => ({
      sprints: state.sprints.filter((s) => s.id !== id),
      selectedSprint:
        state.selectedSprint?.id === id ? null : state.selectedSprint,
    })),

  setSelectedSprint: (sprint) => set({ selectedSprint: sprint }),

  getSprintsByProject: (projectId) => {
    return get().sprints.filter((s) => s.projectId === projectId);
  },
}));
