import React from 'react';
import { useSelector } from 'react-redux';

export default function UserProfile() {
  const user = useSelector(state => state.user);

  const imageUrl = `http://localhost:4000/api/getProfilePicture/${user._id}`;
  console.log('imageUrl', imageUrl)

  return (
    <div>
      {/* Display user information */}
      <h1>{user.firstName} {user.lastName}</h1>
      {/* Display user's profile picture */}
      {imageUrl && <img src={imageUrl} alt="Profile" />}
      {/* ... other user information ... */}
    </div>
  );
}
