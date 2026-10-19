import React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import FlagIcon from '@mui/icons-material/Flag';
import { NavLink } from 'react-router-dom';
import type { CSSProperties } from '@mui/material/styles';


type SideBarProps = {
    drawerWidth: number;
    mobileOpen:boolean;
    handleDrawerClose: () => void;
    handleDrawerTransitionEnd: () => void;
}

interface menuItem {
    text:string,
    path:string,
    icon:React.ComponentType,
}
    const SideBar = ({drawerWidth, mobileOpen,handleDrawerClose,handleDrawerTransitionEnd}:SideBarProps) => {

        const MenuItems:menuItem[] = [
            {text:"Home", path:"/", icon:HomeWorkIcon},
            {text:"Report", path:"/report", icon:FlagIcon},
        ]

        const baseLinkStyle:CSSProperties = {
            textDecoration:"none",
            color: "inherit",
            display:"block",
        }

        const activeLinkStyle:CSSProperties= {
                color: 'white',
                backgroundColor:'gray',
                fontWeight: 'bold',
        };

            const drawer = (
            <div>
              <Toolbar />
              <Divider />
              <List>
                {MenuItems.map((item, index) => (
                    <NavLink to={item.path} style={({isActive}) => {
                        return {
                          ...baseLinkStyle,
                          ...(isActive ? activeLinkStyle : {})
                        }
                    }}>
                  <ListItem key={index} disablePadding>
                    <ListItemButton>
                      <ListItemIcon>
                        {/* {index % 2 === 0 ? <InboxIcon /> : <MailIcon />} */}
                        <item.icon />
                      </ListItemIcon>
                      <ListItemText primary={item.text} />
                    </ListItemButton>
                  </ListItem>
                    </NavLink>
                ))}
              </List>
            </div>
          );

    return (
        <>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          slotProps={{
            root: {
              keepMounted: true, // Better open performance on mobile.
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
        </>
    )
}

export default SideBar