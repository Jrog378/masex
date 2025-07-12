import { DashboardLayout } from "@toolpad/core";
import { ReactRouterAppProvider } from "@toolpad/core/react-router";
import { Outlet } from "react-router-dom";

export default function Admin() {

    return (
        <>
            {/* branding={{ title: '', logo: <></>, homeUrl: '' }} */}

            {/* <BasicMenu/> */}
            <Outlet />

        </>
    )
}