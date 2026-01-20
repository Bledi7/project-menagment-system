export const queryKeys = {
  // Auth
  auth: ['auth'] as const,
  currentUser: ['auth', 'current'] as const,

  // Users
  users: ['users'] as const,
  user: (id: number) => ['users', id] as const,
  userById: (id: number) => ['users', 'byId', id] as const,

  // Projects
  projects: ['projects'] as const,
  project: (id: number) => ['projects', id] as const,
  projectByKey: (key: string) => ['projects', 'key', key] as const,
  projectStatistics: (key: string) => ['projects', 'statistics', key] as const,

  // Teams
  teams: ['teams'] as const,
  team: (id: number) => ['teams', id] as const,

  // Sprints
  sprints: ['sprints'] as const,
  sprint: (id: number) => ['sprints', id] as const,
  sprintsByProject: (projectId: number) => ['sprints', 'project', projectId] as const,

  // Cards
  cards: ['cards'] as const,
  card: (id: number) => ['cards', id] as const,
  cardsBySprint: (sprintId: number) => ['cards', 'sprint', sprintId] as const,

  // Reports
  reports: ['reports'] as const,
  report: (id: number) => ['reports', id] as const,
  reportsByUser: (userId: number) => ['reports', 'user', userId] as const,
  myReports: ['reports', 'my'] as const,

  // Conversations
  conversations: ['conversations'] as const,
  conversation: (id: number) => ['conversations', id] as const,
  conversationsByUser: (userId: number) => ['conversations', 'user', userId] as const,

  // Messages
  messages: (conversationId: number) => ['messages', conversationId] as const,
} as const;
