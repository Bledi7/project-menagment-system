import { Route, Routes } from "react-router-dom";
import pagesData from "./pagesData";

const Router = () => {
  const pageRoutes = pagesData.map(({ path, title, element, layout }) => {
    return (
      <Route
        key={title}
        path={`/${path}`}
        element={layout ? <layout>{element}</layout> : element}
      />
    );
  });

  return <Routes>{pageRoutes}</Routes>;
};

export default Router;
