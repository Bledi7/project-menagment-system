import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ProtectedRoute, PublicRoute } from './guards';
import { ROUTES, ROLES } from '@/utils/constants';
import { Suspense, lazy, ComponentType } from 'react';
import { Loading } from '@/components/ui/Loading';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';

// Layout
import Layout from '@/components/Layout';

// Helper component to wrap lazy-loaded components with Suspense
const withSuspense = <P extends object>(Component: ComponentType<P>) => {
  return (props: P) => (
    <Suspense fallback={<Loading />}>
      <Component {...props} />
    </Suspense>
  );
};

// Lazy load pages
const Home = withSuspense(lazy(() => import('@/pages/Home')));
const Login = withSuspense(lazy(() => import('@/pages/Auth/Login')));
const Register = withSuspense(lazy(() => import('@/pages/Auth/Register')));
const Admin = withSuspense(lazy(() => import('@/pages/Admin')));
const ProductOwner = withSuspense(lazy(() => import('@/pages/Dashboards/ProductOwner')));
const ScrumMaster = withSuspense(lazy(() => import('@/pages/Dashboards/ScrumMaster')));
const Developer = withSuspense(lazy(() => import('@/pages/Dashboards/Developer')));
const Projects = withSuspense(lazy(() => import('@/pages/Projects')));
const ProjectDashboard = withSuspense(lazy(() => import('@/pages/ProjectDashboard')));
const Sprints = withSuspense(lazy(() => import('@/pages/Sprints')));
const Reports = withSuspense(lazy(() => import('@/pages/Reports')));
const MyReports = withSuspense(lazy(() => import('@/pages/MyReports')));
const Team = withSuspense(lazy(() => import('@/pages/Team')));
const TeamMembers = withSuspense(lazy(() => import('@/pages/TeamMembers')));
const Profile = withSuspense(lazy(() => import('@/pages/Profile')));
const UpdateProfile = withSuspense(lazy(() => import('@/pages/UpdateProfile')));
const CreateProject = withSuspense(lazy(() => import('@/pages/CreateProject')));
const CreateReport = withSuspense(lazy(() => import('@/pages/CreateReport')));
const ScrumReport = withSuspense(lazy(() => import('@/pages/ScrumReport')));

export const router = createBrowserRouter(
  [
    {
      path: ROUTES.HOME,
      element: <Home />,
      errorElement: <ErrorBoundary />,
    },
    {
      element: <PublicRoute />,
      errorElement: <ErrorBoundary />,
      children: [
        {
          path: ROUTES.LOGIN,
          element: <Login />,
        },
        {
          path: ROUTES.REGISTER,
          element: <Register />,
        },
      ],
    },
  {
    element: <Layout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        element: <ProtectedRoute allowedRoles={[ROLES.ADMIN]} />,
        children: [
          {
            path: ROUTES.ADMIN,
            element: <Admin />,
          },
        ],
      },
      {
        element: <ProtectedRoute allowedRoles={[ROLES.PRODUCT_OWNER]} />,
        children: [
          {
            path: ROUTES.PRODUCT_OWNER,
            element: <ProductOwner />,
          },
          {
            path: ROUTES.PROJECTS,
            element: <Projects />,
          },
          {
            path: `${ROUTES.PROJECT_DASHBOARD}/:projectKey/:isJiraProject`,
            element: <ProjectDashboard />,
          },
          {
            path: ROUTES.REPORTS,
            element: <Reports />,
          },
          {
            path: ROUTES.MY_REPORTS,
            element: <MyReports />,
          },
          {
            path: ROUTES.CREATE_PROJECT,
            element: <CreateProject />,
          },
        ],
      },
      {
        element: <ProtectedRoute allowedRoles={[ROLES.SCRUM_MASTER]} />,
        children: [
          {
            path: ROUTES.SCRUM_MASTER,
            element: <ScrumMaster />,
          },
          {
            path: ROUTES.TEAM,
            element: <Team />,
          },
          {
            path: ROUTES.SCRUM_REPORT,
            element: <ScrumReport />,
          },
        ],
      },
      {
        element: <ProtectedRoute allowedRoles={[ROLES.DEVELOPER]} />,
        children: [
          {
            path: ROUTES.DEVELOPER,
            element: <Developer />,
          },
          {
            path: ROUTES.CREATE_REPORT,
            element: <CreateReport />,
          },
        ],
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: ROUTES.SPRINTS,
            element: <Sprints />,
          },
          {
            path: ROUTES.TEAM_MEMBERS,
            element: <TeamMembers />,
          },
          {
            path: ROUTES.PROFILE,
            element: <Profile />,
          },
          {
            path: ROUTES.UPDATE_PROFILE,
            element: <UpdateProfile />,
          },
        ],
      },
    ],
    },
    {
      path: '*',
      element: <Navigate to={ROUTES.HOME} replace />,
    }
  ]
);
