import { useState } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { auth } from '../../lib/firebase';
import { Link, useHistory } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';

import Avatar from "@material-ui/core/Avatar";
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem'
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import SettingsOutlinedIcon from '@material-ui/icons/SettingsOutlined';
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';


const useStyles = makeStyles((theme) => ({
    icon: {
        '& > *': {
          margin: theme.spacing(1),
        },
    },
    root: {
      width: '100%',
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
    },
  }));

  const StyledMenu = withStyles({
    paper: {
      border: '1px solid #d3d4d5',
    },
  })((props) => (
    <Menu
      elevation={0}
      getContentAnchorEl={null}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      {...props}
    />
  ));
  
  const StyledMenuItem = withStyles((theme) => ({
    root: {
      '&:focus': {
        backgroundColor: theme.palette.primary.main,
        '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
          color: theme.palette.common.white,
        },
      },
    },
  }))(MenuItem);

  export default function SettingsNavbar({username, avatarImgSrc}) {
      const [anchorEl, setAnchorEl] = useState(null);
      const classes = useStyles();
      const history = useHistory();

      return (
          <div>
            <IconButton 
                className={classes.icon}
                aria-controls="settings-menu"
                aria-haspopup="true"
                variant="contained"
                color="primary"
                onClick={(event) => {setAnchorEl(event.currentTarget)}}
            >
                <Avatar
                    className="post__avatar"
                    src={avatarImgSrc}
                />
            </IconButton>
            <StyledMenu
                id="settings-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={() => {setAnchorEl(null)}}
            >
                <StyledMenuItem button component={Link} to={ROUTES.SETTINGS}>
                    <ListItemIcon>
                        <SettingsOutlinedIcon />
                    </ListItemIcon>
                    <ListItemText primary="Settings" />
                </StyledMenuItem>
                <StyledMenuItem component={Link} to={`/p/${username}`}>
                    <ListItemIcon>
                        <AccountCircleOutlinedIcon />
                    </ListItemIcon>
                    <ListItemText primary="Profile" />
                </StyledMenuItem>
                <Divider />
                <StyledMenuItem
                    onClick={() => {
                        auth.signOut();
                        history.push(ROUTES.LOGIN);
                    }}
                >
                    <ListItemText primary="Logout" />
                </StyledMenuItem>
            </StyledMenu>
        </div>
      )
  }