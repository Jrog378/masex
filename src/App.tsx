import { NavLink, Outlet } from 'react-router-dom'
import { Stack } from '@mui/material'
import { ReactRouterAppProvider } from '@toolpad/core/react-router'

function App() {
  return (
    <>
      <Stack style={{ border: ".05rem solid grey", borderRadius: '1rem' }}>
        <Stack direction={'row'} sx={{ justifyContent: 'space-between', width: '100%' }}>
          <Stack direction={'row'}>
            <NavLink to={'/'} className={'nav-links'}><h1>Home</h1></NavLink>
            <NavLink to={'/catalog'} className={'nav-links'}><h1>Catalog</h1></NavLink>
            <NavLink to={'/catalog/artwork'} className={'nav-links'}><h1>Artwork</h1></NavLink>
            <NavLink to={'/catalog/artist'} className={'nav-links'}><h1>Artists</h1></NavLink>
            <NavLink to={'/catalog/donor'} className={'nav-links'}><h1>Donors</h1></NavLink>
          </Stack>
          <Stack direction={'row'}>
            <NavLink to={'/user'} className={'nav-links'}><h1>Admin</h1></NavLink>
          </Stack>
        </Stack>
      </Stack>
      <ReactRouterAppProvider>
          <Outlet />
      </ReactRouterAppProvider>
    </>
  )
}

export default App
