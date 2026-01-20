/**
 * Enhanced Project Store with Event Bus Integration
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Project } from '@/types';
import { eventBus, EventCategory, emitProjectEvent } from '@/eventBus';

interface ProjectStore {
  projects: Project[];
  selectedProject: Project | null;
  recentProjects: Project[];
  pinnedProjects: number[];
  setProjects: (projects: Project[]) => void;
  addProject: (project: Project) => void;
  updateProject: (id: number, project: Partial<Project>) => void;
  deleteProject: (id: number) => void;
  setSelectedProject: (project: Project | null) => void;
  pinProject: (projectId: number) => void;
  unpinProject: (projectId: number) => void;
  addToRecent: (project: Project) => void;
}

export const useProjectStore = create<ProjectStore>()(
  persist(
    (set, get) => ({
      projects: [],
      selectedProject: null,
      recentProjects: [],
      pinnedProjects: [],

      setProjects: (projects) => {
        set({ projects });
        // Emit event for project list update
        eventBus.emit(EventCategory.PROJECT, 'list_updated', { projects });
      },

      addProject: (project) => {
        set((state) => ({
          projects: [...state.projects, project],
        }));
        emitProjectEvent('created', project.id, project);
      },

      updateProject: (id, updates) => {
        set((state) => {
          const updatedProjects = state.projects.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          );
          const updatedProject = updatedProjects.find((p) => p.id === id);
          return {
            projects: updatedProjects,
            selectedProject:
              state.selectedProject?.id === id
                ? { ...state.selectedProject, ...updates }
                : state.selectedProject,
            recentProjects: state.recentProjects.map((p) =>
              p.id === id ? { ...p, ...updates } : p
            ),
          };
        });
        emitProjectEvent('updated', id, updates);
      },

      deleteProject: (id) => {
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
          selectedProject:
            state.selectedProject?.id === id ? null : state.selectedProject,
          recentProjects: state.recentProjects.filter((p) => p.id !== id),
          pinnedProjects: state.pinnedProjects.filter((pid) => pid !== id),
        }));
        emitProjectEvent('deleted', id);
      },

      setSelectedProject: (project) => {
        set({ selectedProject: project });
        if (project) {
          get().addToRecent(project);
          emitProjectEvent('selected', project.id, project);
        }
      },

      pinProject: (projectId) => {
        set((state) => ({
          pinnedProjects: [...state.pinnedProjects, projectId],
        }));
      },

      unpinProject: (projectId) => {
        set((state) => ({
          pinnedProjects: state.pinnedProjects.filter((id) => id !== projectId),
        }));
      },

      addToRecent: (project) => {
        set((state) => {
          const recent = state.recentProjects.filter((p) => p.id !== project.id);
          return {
            recentProjects: [project, ...recent].slice(0, 10), // Keep last 10
          };
        });
      },
    }),
    {
      name: 'project-storage',
      partialize: (state) => ({
        recentProjects: state.recentProjects,
        pinnedProjects: state.pinnedProjects,
        selectedProject: state.selectedProject,
      }),
    }
  )
);
