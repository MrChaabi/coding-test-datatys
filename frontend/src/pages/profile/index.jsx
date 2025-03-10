import React from 'react';
import UserForm from '../../componenets/UserForm.jsx';
import Profile from '../../componenets/Profile/index';
import '../../App.css'; // Chemin corrigé

const ProfilePage = () => {
  const [user, setUser] = React.useState(null);

  const handleUserCreated = (newUser) => {
    setUser(newUser);
  };

  return (
    <div className="container">
      {user ? (
        <Profile user={user} />
      ) : (
        <UserForm onUserCreated={handleUserCreated} />
      )}
    </div>
  );
};

export default ProfilePage;