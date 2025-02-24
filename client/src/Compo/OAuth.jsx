import { Button } from 'flowbite-react';
import { AiFillGoogleCircle } from 'react-icons/ai';
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { signInFailure, signInSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';
import React from 'react';

function OAuth() {
  const auth = getAuth(app);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleClick = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });

    try {
      const resultsFromGoogle = await signInWithPopup(auth, provider);
      const res = await fetch('/server/auth/google', {   // Added 'await'
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: resultsFromGoogle.user.displayName,
          email: resultsFromGoogle.user.email,
          googlePhotoUrl: resultsFromGoogle.user.photoURL,
        }),
      });
      const data = await res.json();
      
      if (res.ok) {
        dispatch(signInSuccess(data));
        navigate('/');
      } else {
        dispatch(signInFailure('Failed to sign in'));
        console.error('Error:', data);
      }
    } catch (error) {
      dispatch(signInFailure(error.message));  // Proper error handling
      console.error('Sign in error:', error);
    }
  };

  return (
    <Button 
      type="button" 
      gradientDuoTone="pinkToOrange" 
      outline 
      onClick={handleGoogleClick}
    >
      <AiFillGoogleCircle className="w-6 h-6 mr-2" />
      Continue With Google
    </Button>
  );
}

export default OAuth;
