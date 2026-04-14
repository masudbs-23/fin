import Box from '@mui/material/Box';

import { useBoolean } from 'src/hooks/use-boolean';

import Main from './main';
import Header from './header';
import NavVertical from './nav-vertical';
import { HEADER } from '../config-layout';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function DashboardLayout({ children }: Props) {
  const nav = useBoolean();

  const renderNavVertical = <NavVertical openNav={nav.value} onCloseNav={nav.onFalse} />;

  return (
    <>
      <Header onOpenNav={nav.onTrue} />

      <Box
        sx={{
          mt: `${HEADER.H_DESKTOP}px`,
          minHeight: `calc(100vh - ${HEADER.H_DESKTOP}px)`,
          display: 'flex',
          flexDirection: { xs: 'column', lg: 'row' },
        }}
      >
        {renderNavVertical}

        <Main>{children}</Main>
      </Box>
    </>
  );
}
