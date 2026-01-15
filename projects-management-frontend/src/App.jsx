import { BrowserRouter } from "react-router-dom";
import Router from "./config/routing/router";
import { useSelector } from "react-redux";

const App = () => {



  return (
    <div className="app">
      <main className="content">
  
        <BrowserRouter>
          <Router />
        </BrowserRouter>
      </main>
    </div>
  );
};

export default App;

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//--> In order to not have access to every path; Protecting the paths, if authenticated can enter, otherwise not
//
// const currentUser = false;
// const RequireAuth = ({ children }) => {
//   return currentUser ? children : <Navigate to="/login" />;
// };
//
//
// <Route
//           path="/productOwner"
//           element={
//             <RequireAuth>
//               <ProductOwner />
//             </RequireAuth>
//           }
//         />
//         <Route
//           path="/scrumMaster"
//           element={
//             <RequireAuth>
//               <ScrumMaster />
//             </RequireAuth>
//           }
//         />
//         <Route
//           path="/developer"
//           element={
//             <RequireAuth>
//               <Developer />
//             </RequireAuth>
//           }
//         />
