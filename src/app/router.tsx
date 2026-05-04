import { createBrowserRouter } from "react-router-dom";
import Dashboard from "@/modules/dashboard/components/Dashboard";
import ErrorPage from "@/shared/components/ErrorPage";
import Login from "@/modules/auth/components/Login";

const router = createBrowserRouter([
    {
        path: "/login", element: <Login />,
    },
    {
        path: "/",
        element: <Dashboard />,
        errorElement: <ErrorPage />,
    }
]);

export default router;