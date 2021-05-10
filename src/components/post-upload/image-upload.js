import "./post-upload.css";

export default function ImageUpload({ setImage, setImageURL }) {
    const handleChange = (e) => {
        if (e.target.files[0]) { 
            setImage(e.target.files[0]); 
            setImageURL(URL.createObjectURL(e.target.files[0]));
        }
    };

    return (
        <div className="photo__upload">
            <label for="file">
                <svg xmlns="http://www.w3.org/2000/svg" 
                    className="photo__svg" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
                    />
                </svg>
            </label>
            <input className="upload__input" id="file" type="file" onChange={handleChange} />
        </div>
    )
}