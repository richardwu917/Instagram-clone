import { useEffect, useState, Fragment } from 'react';
import { db } from '../../lib/firebase';
import { formatDistance } from 'date-fns';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Badge from '@material-ui/core/Badge';
import NotificationsIcon from '@material-ui/icons/Notifications';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ChatIcon from '@material-ui/icons/Chat';
import OpenNotificationPost from './open-notification';


export default function NotificationsNavbar({ username }) {
    const [notifications, setNotifications] = useState([]);
    const [notificationsIcon, setNotificationsIcon] = useState();
    const [notificationsMarkup, setNotificationsMarkup] = useState();
    const [anchorEl, setAnchorEl] = useState(null);

    const handleOpen = (event) => {
        setAnchorEl(event.target)
    };
    const handleClose = () => {
        setAnchorEl(null)
    };
    const onMenuOpened = () => {
        notifications
        .filter((not) => !not.read)
        .map((not) => db.collection('notification').doc(not.docid)
            .update({
                read: !not.read
            }));
    };

    useEffect(() => {
        if(username) {
            db.collection('notification').where("userReciever", "==", username).onSnapshot({
                includeMetadataChanges: true
            }, (snapshot) => {
                setNotifications(snapshot.docs.map((notification) => ({
                    ...notification.data(),
                    docid: notification.id
                })));
            })
        }
    }, [username]);

    useEffect(() => {
        if (notifications && notifications.length > 0) {
            notifications.filter((not) => not.read === false).length > 0 
            ? (setNotificationsIcon(
                <Badge 
                    badgeContent={
                        notifications.filter((not) => not.read === false).length
                    }
                    color="secondary"
                >
                    <NotificationsIcon />
                </Badge>
            ))
            : (setNotificationsIcon(<NotificationsIcon />));
        } else {
            setNotificationsIcon(<NotificationsIcon />);
        }

        setNotificationsMarkup(notifications && notifications.length > 0 ? (
            notifications.map((not) => {
                const verb = not.type === 'like' ? 'liked' : 'commented on';
                const time = formatDistance(not.dateCreated, new Date());
                const iconColor = not.read ? 'primary' : 'secondary';
                const icon = 
                    not.type === 'like' ? (
                        <FavoriteIcon color={iconColor} style={{ marginRight: 10 }} />
                    ) : (
                        <ChatIcon color={iconColor} style={{ marginRight: 10 }} />
                    );

                    return (
                        <MenuItem key={not.dateCreated}>
                            {icon}
                            <OpenNotificationPost username={username} docId={not.docId} userSender={not.userSender} verb={verb} time={time} handleClose={handleClose}/>
                        </MenuItem>
                    );
            })
        ) : (
            <MenuItem onClick={handleClose}>
                When someone likes or comments on one of your posts, you'll see it here.
            </MenuItem>
        ));
    }, [notifications])

    return (
        <Fragment>
            <Tooltip placement="top" title="Notifications">
                <IconButton
                aria-owns={anchorEl ? 'simple-menu' : undefined}
                aria-haspopup="true"
                onClick={handleOpen}
            >
                {notificationsIcon}
            </IconButton>
        </Tooltip>
        <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            onEntered={onMenuOpened}
        >
            {notificationsMarkup}
        </Menu>
        </Fragment>
    )
}