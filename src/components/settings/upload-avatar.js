import Avatar from "@material-ui/core/Avatar";
import { useState, useContext, useEffect } from 'react';
import { db, storage } from "../../lib/firebase";
import LoggedInUserContext from '../../context/logged-in-user';
import { getUserDBByUserId } from '../../firebase-calls/firebase';

import "./upload-avatar.css";

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';


const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(2),
      margin: 'auto',
      maxWidth: 500,
    },
    large: {
        width: theme.spacing(9),
        height: theme.spacing(9),
    },
}));

export default function UploadAvatar() {
    const { user, setActiveUser } = useContext(LoggedInUserContext);
    const [avatar, setAvatar] = useState(null);
    const [avatarURL, setAvatarURL] = useState('');
    const [username, setUsername] = useState('');

    const classes = useStyles();

    useEffect(() => {
        if(user) {
            setAvatarURL(user.avatarImgSrc)
            setUsername(user.username)
        }
      }, [user]);
    
    const handleChange = (e) => {
        if (e.target.files[0]) { 
            setAvatar(e.target.files[0]); 
            setAvatarURL(URL.createObjectURL(e.target.files[0]));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
  
        const uploadTask = storage.ref(`avatars/${user.userId}/${avatar.name}`).put(avatar);
        
        uploadTask.on( 
            "state_changed",
            (snapshot) => { 
              const progress = Math.round(
                  (snapshot.bytesTransferred / snapshot.totalBytes) * 100
              );
              console.log(progress);
          }, (error) => { 
                console.log(error);
                alert(error.message);
            }, async () => { 
                await db.collection("users").doc(user.docId).get().then((doc) => {
                    if(doc.exists) {
                        storage.refFromURL(doc.data().avatarImgSrc).delete();
                    }
                });
                storage
                    .ref(`avatars/${user.userId}`)
                    .child(avatar.name)
                    .getDownloadURL()
                    .then(async url => { 
                        db.collection("users").doc(user.docId).update({
                          avatarImgSrc: url
                        });
                        const [updatedUserObj] = await getUserDBByUserId(user.userId);
                        setActiveUser(updatedUserObj);
                        setAvatarURL('');
                        setAvatar(null);
                    });
            }
        );
    };

    return (
        <div className = {classes.root}>
            <Paper className={classes.paper}>
                <Grid container spacing={2}>
                    <Grid item>
                        <label for="avatarUpload">
                            <Avatar
                                className={classes.large}
                                src={avatarURL}
                            />
                        </label>
                    </Grid>
                    <Grid item xs={12} sm container>
                        <Grid item xs={12} sm container direction="column" spacing={2}>
                            <Grid item xs>
                                <Typography gutterBottom variant="subtitle1">
                                    {username}
                                </Typography>
                                <Typography variant="body2" gutterBottom>
                                    <div className="fileInput__container">
                                        <p className="fileInput__text">Change profile picture</p>
                                        <input id="avatarUpload" type="file" onChange={handleChange} className="file__input"/>
                                    </div>
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant="body2" style={{ cursor: 'pointer' }}>
                                <button
                                    className="avatarSubmit__button"
                                    type="button"
                                    disabled={avatar === null || avatarURL === ''}
                                    onClick={handleSubmit}
                                >
                                Submit
                                </button>
                                </Typography>
                            </Grid>

                        </Grid>
                    </Grid>
                </Grid>
            </Paper> 
        </div>
    )
}