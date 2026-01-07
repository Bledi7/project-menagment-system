import { BrowserRouter } from "react-router-dom";
import Router from "./config/routing/router";

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