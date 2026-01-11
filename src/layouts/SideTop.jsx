import { useState } from "react";
import Sidebar from "../components/organisms/Sidebar/Sidebar";
import Topbar from "../components/organisms/Topbar/Topbar";

const SideTopLayout = ({ children }) => {
  const [isSidebar, setIsSidebar] = useState(true);

  return (
    <div className="app">
      <Sidebar isSidebar={isSidebar} />
      <main className="content">
        <Topbar setIsSidebar={setIsSidebar} />
        {children}
      </main>
    </div>
  );
};

export default SideTopLayout;
