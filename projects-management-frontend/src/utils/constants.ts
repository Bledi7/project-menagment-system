export const ROLES = {
  ADMIN: 'Admin',
  PRODUCT_OWNER: 'Product Owner',
  SCRUM_MASTER: 'Scrum Master',
  DEVELOPER: 'Developer',
} as const;

export const USER_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
} as const;

export const CARD_STATUS = {
  TODO: 'todo',
  IN_PROGRESS: 'in_progress',
  DONE: 'done',
} as const;

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  ADMIN: '/admin',
  PRODUCT_OWNER: '/productOwner',
  SCRUM_MASTER: '/scrumMaster',
  DEVELOPER: '/developer',
  PROJECTS: '/projects',
  PROJECT_DASHBOARD: '/projectDashboard',
  SPRINTS: '/sprints',
  REPORTS: '/reports',
  MY_REPORTS: '/myReports',
  TEAM: '/team',
  TEAM_MEMBERS: '/teammembers',
  PROFILE: '/userProfile',
  UPDATE_PROFILE: '/updateUserProfile',
  CREATE_PROJECT: '/createProject',
  CREATE_REPORT: '/createReport',
  SCRUM_REPORT: '/scrumReportForm',
} as const;
