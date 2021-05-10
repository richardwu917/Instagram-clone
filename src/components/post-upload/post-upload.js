import { useState, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { db, storage } from '../../lib/firebase';
import CaptionUpload from './caption-upload';
import ImageUpload from './image-upload';
import UserContext from '../../context/user';
import GetUserObj from '../../hooks/get-user-obj';

import "./post-upload.css";

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
      width: '400px',
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

export default function PostUpload({ setOpenPost }) {
    const { user: loggedInUser } = useContext(UserContext);
    const { user } = GetUserObj(loggedInUser?.uid);
    const classes = useStyles();
    const [modalStyle] = useState(getModalStyle);
    
    const [image, setImage] = useState(null);
    const [imageURL, setImageURL] = useState("");
    const [caption, setCaption] = useState('');

    const isInvalid = image === null || caption === '';

    const handleUpload = (e) => {
      e.preventDefault();

      const uploadTask = storage.ref(`images/${image.name}`).put(image);
      
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
          }, () => { 
              storage
                  .ref("images")
                  .child(image.name)
                  .getDownloadURL()
                  .then(url => { 
                      db.collection("photos").add({
                        userId: user.userId,
                        imageSrc: url,
                        caption: caption,
                        likes: [],
                        comments: [],
                        dateCreated: Date.now()
                      });
                      setCaption("");
                      setImage(null);
                      setOpenPost(false);
                  });
          }
      );
  };

    return (
        <div style={modalStyle} className={classes.paper}>
          <h1 className="post__header">Create Post</h1>
            <form onSubmit={handleUpload} className={classes.root} noValidate autoComplete="off">
                <CaptionUpload setCaption={setCaption} />
                <img className="upload__image" src={imageURL} alt="" />
                <ImageUpload setImage={setImage} setImageURL={setImageURL}/>
                <button className="upload__button"
                  disabled={isInvalid}
                  type="submit"
                >
                  Post
                </button>
            </form>
        </div>
    )
}