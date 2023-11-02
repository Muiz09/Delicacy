import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import Detail from "../pages/Detail";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />
  },
  {
    path: "/detailRecipies/:id",
    element: <Detail />,
  },
  // {
  //   path: "/favorite",
  //   element: <FavoriteApp />,
  // },
]);

export default router;