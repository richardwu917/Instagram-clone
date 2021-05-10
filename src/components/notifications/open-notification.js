import { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { db } from '../../lib/firebase';
import NotificationPost from '../post/notification-post';
import { makeStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import { getUserDBByUsername } from '../../firebase-calls/firebase';

import "./open-notification.css"

function getModalStyle() {
    const top = 50;
    const left = 50;
  
    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`,
    };
  }
  
  const useStyles = makeStyles((theme) => ({
    paper: {
      position: 'absolute',
      borderRadius: 15,
      width: '600px',
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
      minHeight: '428px%',
      height: 'auto',
    },
    root: {
      '& .MuiTextField-root': {
        margin: theme.spacing(1),
        width: '100%',
      },
      '& label.Mui-focused': {
        color: 'black',
      },
      '& .MuiInput-underline:after': {
        borderBottomColor: 'black',
      },
    },
  }));

export default function OpenNotificationPost({username, docId, userSender, verb, time, handleClose}) {
    const [openNotificationPost, setOpenNotificationPost] = useState(false);
    const [post, setPost] = useState(null);

    const classes = useStyles();
    const [modalStyle] = useState(getModalStyle);

    useEffect(() => {
       db.collection("photos").doc(docId).onSnapshot({
        includeMetadataChanges: true
        }, async (snapshot) => {
            const userDB = await getUserDBByUsername(username);
            let userLikedPhoto = false;
            if (snapshot.data().likes.includes(userDB[0].userId)) {
                userLikedPhoto = true;
            }
             setPost({ username, ...snapshot.data(), docId, userLikedPhoto })
           }
        )
      }, [docId]);

    return(
        <div>
            <Modal
                open={openNotificationPost}
                onClose={() => {
                    setOpenNotificationPost(false);
                    handleClose();
                }}
            >
                <div style={modalStyle} className={classes.paper}>
                    {!post ? (
                        <Skeleton count={1} width={640} height={500} className="skeleton__styling" />
                    ) : (
                        <NotificationPost key={post.docId+Date.now()} content={post} />
                    )}
                </div>
            </Modal>
            <Typography
                color="default"
                variant="body1"
                onClick={() => {setOpenNotificationPost(true)}}
            >
                {userSender} {verb} your post {time} ago
            </Typography>
        </div>
    );
}