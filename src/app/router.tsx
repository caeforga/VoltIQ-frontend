import { createBrowserRouter } from "react-router-dom";
import MainLayout from "@/shared/components/MainLayout";
import ErrorPage from "@/shared/components/ErrorPage";
import Login from "@/modules/auth/components/Login";

const router = createBrowserRouter([
    {
        path: "/login", element: <Login />,
    },
    {
        path: "/",
        element: <MainLayout />,
        errorElement: <ErrorPage />,
    }
]);

export default router;