import Admin from "../../components/Pages/Admin";
import CreateProject from "../../components/Pages/Dashboards/ProductOwner/Projects/CreateProject";
import CreateReport from "../../components/Pages/Dashboards/Developer/DeveloperInnerPage/CreateReport";
import Developer from "../../components/Pages/Dashboards/Developer";
import Home from "../../components/Pages/Home";
import Login from "../../components/molecules/Login";
import ProductOwner from "../../components/Pages/Dashboards/ProductOwner";
import Projects from "../../components/Pages/Dashboards/ProductOwner/Projects/Project";
import ProjectDashboard from "../../components/Pages/Dashboards/Project";
import Register from "../../components/molecules/Register";
import Reports from "../../components/Pages/Dashboards/ProductOwner/reports";
import ScrumMaster from "../../components/Pages/Dashboards/ScrumMaster";
import ScrumReport from "../../components/Pages/Dashboards/ScrumMaster/Reports/ScrumReports";
import Sprints from "../../components/Pages/Sprints/Sprints";
import SideTopLayout from "../../layouts/SideTop";
import Team from "../../components/Pages/Dashboards/ScrumMaster/scenes/team";
import TeamMembers from "../../components/Pages/Members/index";
import Details from "../../components/Pages/Dashboards/ProductOwner/Projects/Details";
import MyReports from "../../components/Pages/Dashboards/ProductOwner/reports/myReport";
import ProfilePage from "../../components/Pages/User/profilePage";
import UpdateUserProfile from "../../components/Pages/User/UpdateUserProfile";
import UserProfileImage from "../../redux/userPhoto";
const pagesData = [
  {
    path: "/admin",
    element: (
      <SideTopLayout>
        <Admin />
      </SideTopLayout>
    ),
    title: "admin",
  },
  {
    path: "/login",
    element: <Login />,
    title: "login",
  },
  {
    path: "/register",
    element: <Register />,
    title: "register",
  },

  {
    path: "/createProject",
    element: (
      <SideTopLayout>
        <CreateProject />
      </SideTopLayout>
    ),
    title: "createProject",
  },
  {
    path: "/createReport",
    element: (
      <SideTopLayout>
        <CreateReport />
      </SideTopLayout>
    ),
    title: "createReport",
  },
  {
    path: "/developer",
    element: (
      <SideTopLayout>
        <Developer />
      </SideTopLayout>
    ),
    title: "developer",
  },
  {
    path: "/teammembers",
    element: (
      <SideTopLayout>
        <TeamMembers />
      </SideTopLayout>
    ),
    title: "teammembers",
  },
  {
    path: "/",
    element: <Home />,
    title: "home",
  },
  {
    path: "/productOwner",
    element: (
      <SideTopLayout>
        <ProductOwner />
      </SideTopLayout>
    ),
    title: "productOwner",
  },
  {
    path: "/projects",
    element: (
      <SideTopLayout>
        <Projects />
      </SideTopLayout>
    ),
    title: "projects",
  },
  {
    path: "/projectDashboard/:projectKey/:isJiraProject",
    element: (
      <SideTopLayout>
        <ProjectDashboard />
      </SideTopLayout>
    ),
    title: "projectDashboard",
  },
  {
    path: "/reports",
    element: (
      <SideTopLayout>
        <Reports />
      </SideTopLayout>
    ),
    title: "reports",
  },
  {
    path: "/scrumMaster",
    element: (
      <SideTopLayout>
        <ScrumMaster />
      </SideTopLayout>
    ),
    title: "scrumMaster",
  },
  {
    path: "/scrumReportForm",
    element: (
      <SideTopLayout>
        <ScrumReport />
      </SideTopLayout>
    ),
    title: "scrumReportForm",
  },
  {
    path: "/sprints",
    element: (
      <SideTopLayout>
        <Sprints />
      </SideTopLayout>
    ),
    title: "sprints",
  },
  {
    path: "/team",
    element: (
      <SideTopLayout>
        <Team />
      </SideTopLayout>
    ),
    title: "team",
  },
  {
    path: "/details/:projectKey/:isJiraProject",
    element: (
      <SideTopLayout>
        <Details />
      </SideTopLayout>
    ),
    title: "details",
  }, 
  {
    path: "/myReports",
    element: (
      <SideTopLayout>
        <MyReports />
      </SideTopLayout>
    ),
    title: "myReports",
  },
  {
    path: "/userProfile",
    element: (
      <SideTopLayout>
        <ProfilePage />
      </SideTopLayout>
    ),
    title: "userProfile",
  },
  {
    path: "/updateUserProfile",
    element: (
      <SideTopLayout>
        <UpdateUserProfile />
      </SideTopLayout>
    ),
    title: "userProfile",
  },
  
];

export default pagesData;
