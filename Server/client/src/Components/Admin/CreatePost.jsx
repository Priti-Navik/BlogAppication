import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react';
import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from "../../firebase";
import {useNavigate} from 'react-router-dom'


import 'react-quill/dist/quill.snow.css';

function CreatePost() {
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);

const navigate = useNavigate();

/*Function to get a cookie by name
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null; // Return null if the cookie is not found
}
  */

// Usage example


const handleSubmit = async (e) => {
  e.preventDefault();
  const token = localStorage.getItem('access_token');
  console.log(localStorage.getItem('access_token'));
  // Get the token
  console.log("token" , token);
 
  

  // No need to manually access the cookie for the token
  // The cookie with `httpOnly` will be automatically included in the request
  
  try {
      const res = await fetch(`/server/post/create`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`  // Add the token to the Authorization header
          },
          body: JSON.stringify(formData),
          // Ensure cookies are included in the request
      });

      const data = await res.json();
      if (res.ok) {
          setPublishError(null);
          navigate(`/post/${data.slug}`);
      } else {
          setPublishError(data.msg || "Failed to create post");
      }
  } catch (error) {
      setPublishError('Something went wrong');
      console.log(error);
  }
};




  async function handleUploadImage(e) {
    e.preventDefault(); // Prevent form submission
    try {
      if (!file) {
        setImageUploadError('Please select an image');
        return;
      }

      setImageUploadError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + '-' + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setImageUploadError('Image upload failed');
          setImageUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUploadProgress(null);
            setImageUploadError(null);
            setFormData({ ...formData, image: downloadURL });
          });
        }
      );
    } catch (error) {
      setImageUploadError('image upload failed');
      setImageUploadProgress(null);
      console.log(error);
    }
  }
  

  return (
    <div className='p-3 max-w-3xl mx-auto min-h-screen'>
      <h1 className='text-center text-3xl my-7 font-semibold'>Create Post</h1>
      <form className='flex flex-col gap-4'onSubmit={handleSubmit}>
        <div className='flex flex-col gap-4 sm:flex-row justify-between'>
          <TextInput type='text' placeholder='Title' required id='title' className='flex-1' onChange={(e)=>{
            setFormData({...formData , title:e.target.value});
          }} />
          <Select  onChange={(e)=>{
            setFormData({...formData , category:e.target.value});
          }} >
            <option value="uncategorized">Select a category</option>
            <option value="javascript">JavaScript</option>
            <option value="reactjs">React.js</option>
            <option value="nextjs">Next.js</option>
          </Select>
        </div>
        <div className='flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3'>
          <FileInput type='file' accept='image/*' onChange={(e) => { setFile(e.target.files[0]) }} />
          <Button type='button' gradientDuoTone='purpleToBlue' size='sm' onClick={handleUploadImage}>Upload Image</Button>
        </div>
        {imageUploadProgress && <p>Upload Progress: {imageUploadProgress}%</p>}
        {imageUploadError && <p className='text-red-500'>{imageUploadError}</p>}
        {formData.image &&(
          <img src={formData.image} alt='upload' className='w-full h-72-object-cover'/>
        )}
        <ReactQuill theme="snow" placeholder='Write something...' className='h-72 mb-12' required  onChange={(value)=>{
            setFormData({...formData , content:value});
          }}  />
        <Button type='submit'   gradientDuoTone='purpleToPink'>Publish</Button>
        {
          publishError &&<Alert color='failure' className='mt-3'>{publishError}</Alert>
        }
      </form>
    </div>
  );
}

export default CreatePost;
