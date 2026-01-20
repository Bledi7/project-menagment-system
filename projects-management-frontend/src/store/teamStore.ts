import { create } from 'zustand';
import { Team } from '@/types';

interface TeamStore {
  teams: Team[];
  selectedTeam: Team | null;
  setTeams: (teams: Team[]) => void;
  addTeam: (team: Team) => void;
  updateTeam: (id: number, team: Partial<Team>) => void;
  deleteTeam: (id: number) => void;
  setSelectedTeam: (team: Team | null) => void;
}

export const useTeamStore = create<TeamStore>((set) => ({
  teams: [],
  selectedTeam: null,

  setTeams: (teams) => set({ teams }),

  addTeam: (team) =>
    set((state) => ({
      teams: [...state.teams, team],
    })),

  updateTeam: (id, updates) =>
    set((state) => ({
      teams: state.teams.map((t) =>
        t.id === id ? { ...t, ...updates } : t
      ),
      selectedTeam:
        state.selectedTeam?.id === id
          ? { ...state.selectedTeam, ...updates }
          : state.selectedTeam,
    })),

  deleteTeam: (id) =>
    set((state) => ({
      teams: state.teams.filter((t) => t.id !== id),
      selectedTeam:
        state.selectedTeam?.id === id ? null : state.selectedTeam,
    })),

  setSelectedTeam: (team) => set({ selectedTeam: team }),
}));
