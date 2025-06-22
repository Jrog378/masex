import { createBrowserRouter } from "react-router";
import App from "./App";
import index from "./pages";

export let routes = createBrowserRouter([
    {
        id: 'app-start',
        path: '/',
        Component: App,
        children: [
            {
                index: true,
                Component: index
            },
            {
                path: '/users',
                // Component:
            }
        ]
    }
])