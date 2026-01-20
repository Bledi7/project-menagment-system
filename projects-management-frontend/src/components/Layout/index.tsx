import { Outlet } from 'react-router-dom';
import { WorkspaceLayout } from './WorkspaceLayout';

export default function Layout() {
  return (
    <WorkspaceLayout>
      <Outlet />
    </WorkspaceLayout>
  );
}
