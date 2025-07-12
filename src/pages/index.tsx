import { Button, Stack } from "@mui/material";
import { Link } from "react-router-dom";

export default function Index() {
    return (
        <Stack style={{alignItems:'center'}}>
            <div style={{width: '50rem'}}>
            <h1>Mason Exhibitions Catalog</h1>
            <Link to={'/user'}><Button variant="outlined">Admin Dashboard</Button></Link>
            </div>
        </Stack>
    )
}