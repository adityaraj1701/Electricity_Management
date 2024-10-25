import React, { useState } from 'react';
import { Box, AppBar, Toolbar, IconButton, Typography, Button, BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import { Home, BarChart, Battery, Settings } from 'lucide-react';
import ElectricityManagement from './Main';
import Report from "./Report";
import EnergyAnalytics from './analytica';
import Dashboard from './forecasting';
const Navigation = ({ activePage, setActivePage }) => (
  <AppBar position="static" color="default" elevation={1}>
    <Toolbar>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Battery className="h-6 w-6 mr-2" />
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
          EMS
        </Typography>
      </Box>
      
      <Box sx={{ display: { xs: 'none', sm: 'flex' }, ml: 6 }}>
        <Button
          startIcon={<Home />}
          onClick={() => setActivePage('overview')}
          color={activePage === 'overview' ? 'primary' : 'inherit'}
        >
          Overview
        </Button>
        
        <Button
          startIcon={<BarChart />}
          onClick={() => setActivePage('dashboard')}
          color={activePage === 'dashboard' ? 'primary' : 'inherit'}
        >
          Dashboard
        </Button>
        
        <Button
          startIcon={<BarChart />}
          onClick={() => setActivePage('analytics')}
          color={activePage === 'analytics' ? 'primary' : 'inherit'}
        >
          Analytics
        </Button>
        
        <Button
          startIcon={<Settings />}
          onClick={() => setActivePage('settings')}
          color={activePage === 'settings' ? 'primary' : 'inherit'}
        >
          forecasting
        </Button>
      </Box>
    </Toolbar>
  </AppBar>
);

const MobileNav = ({ activePage, setActivePage }) => (
  <Paper 
    sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, display: { sm: 'none' } }} 
    elevation={3}
  >
    <BottomNavigation
      value={activePage}
      onChange={(event, newValue) => setActivePage(newValue)}
    >
      <BottomNavigationAction
        label="Home"
        value="overview"
        icon={<Home />}
      />
      <BottomNavigationAction
        label="Dashboard"
        value="dashboard"
        icon={<BarChart />}
      />
      <BottomNavigationAction
        label="Analytics"
        value="analytics"
        icon={<Battery />}
      />
      <BottomNavigationAction
        label="Settings"
        value="settings"
        icon={<Settings />}
      />
    </BottomNavigation>
  </Paper>
);

function App() {
  const [activePage, setActivePage] = useState('overview');

  const renderPage = () => {
    switch (activePage) {
      case 'overview':
        return <ElectricityManagement />;
      case 'dashboard':
        return <Report />;
      case 'analytics':
        return <EnergyAnalytics/>; // Add your Analytics component
      case 'settings':
        return <Dashboard/> // Add your Settings component
      default:
        return <ElectricityManagement />;
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      bgcolor: 'grey.50',
      pb: { xs: 7, sm: 0 } // padding bottom for mobile nav
    }}>
      <Navigation activePage={activePage} setActivePage={setActivePage} />
      <Box component="main">
        {renderPage()}
      </Box>
      <MobileNav activePage={activePage} setActivePage={setActivePage} />
    </Box>
  );
}

export default App;