import { Button } from "@mui/material";
import { Link } from "react-router";

export default function index() {
    return (
        <>
            <h1>Index</h1>
            <Link to={'/users'}><Button>Dashboard</Button></Link>
        </>
    )
}