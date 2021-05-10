import TextField from '@material-ui/core/TextField';

export default function CaptionUpload({ setCaption }) {
    const handleChange = (e) => {
        setCaption(e.target.value);
    };
    return (
        <div>
            <TextField
                id="full-width-text-field"
                label="What's on your mind?"
                multiline
                rows={4}
                fullWidth={true}
                onChange={handleChange}
            />
        </div>
    )
}