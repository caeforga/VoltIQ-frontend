import { createBrowserRouter } from "react-router-dom";
import MainLayout from "@/shared/components/MainLayout";
import ErrorPage from "@/shared/components/ErrorPage";
import Login from "@/modules/auth/components/Login";
import Home from "@/modules/dashboard/pages/Home";
import Projects from "@/modules/dashboard/pages/Projects";

const router = createBrowserRouter([
    {
        path: "/login", element: <Login />,
    },
    {
        path: "/",
        element: <MainLayout />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: "/init",
                element: <Home />,
            },
            {
                path: "/projects",
                element: <Projects />,
            },
        ],
    }
]);

export default router;