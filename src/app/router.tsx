import { createBrowserRouter } from "react-router-dom";
import MainLayout from "@/shared/components/MainLayout";
import ErrorPage from "@/shared/components/ErrorPage";
import Login from "@/modules/auth/components/Login";
import Home from "@/modules/dashboard/pages/Home";
import Projects from "@/modules/dashboard/pages/Projects";
import { NetworkViewer } from "@/modules/network-viewer/pages/NetworkViewer";

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
                path: "/create-project",
                element: <Home />,
            },
            {
                path: "/my-projects",
                element: <Projects />,
            },
            {
                path: "/network",
                element: <NetworkViewer />,
            },
        ],
    }
]);

export default router;