import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import User from "./pages/User";
import Role from "./pages/Role";
import Admin from "./pages/Admin";
import Artist from "./pages/Artist";
import Donor from "./pages/Donor";
import Catalog from "./pages/Catalog";
import Artwork from "./pages/Artwork";
import Index from "./pages/Index";

export const routes = createBrowserRouter([
    {
        id: 'app-start',
        path: '/',
        element: <App />,
        children: [
            {
                index: true,
                element: <Index />
            },
            {
                path: 'user',
                element: <Admin />,
                children: [
                    {
                        index: true,
                        path: ':noteId?/*',
                        element: <User />,
                    },
                    {
                        path: 'role/:noteId?/*',
                        element: <Role />
                    }
                ]
            },
            {
                path: 'catalog',
                element: <Admin />,
                children: [
                    {
                        index: true,
                        element: <Catalog />,
                    },
                    {
                        path: 'artwork/:noteId?/*',
                        element: <Artwork />,
                    },
                    {
                        path: 'artist/:noteId?/*',
                        element: <Artist />,
                    },
                    {
                        path: 'donor/:noteId?/*',
                        element: <Donor />,
                    },
                ]
            },
        ]
    },

])