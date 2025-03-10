import React, { useState } from 'react';
import UserForm from './componenets/UserForm';
import UserList from './componenets/UserList';

const App = () => {
  const [users, setUsers] = useState([]);
  const [showCreateUser, setShowCreateUser] = useState(true);
  const [showUserList, setShowUserList] = useState(false);

  const handleUserCreated = (userData) => {
    console.log('Utilisateur créé :', userData);
    setUsers((prevUsers) => [...prevUsers, userData]);
  };

  const handleShowCreateUser = () => {
    setShowCreateUser(true);
    setShowUserList(false);
  };

  const handleShowUserList = () => {
    setShowCreateUser(false);
    setShowUserList(true);
  };

  return (
    <div className="app-container">
      <div className="menu">
        <div className="menu-buttons">
          <button 
            onClick={handleShowCreateUser}
            className={showCreateUser ? "active" : ""}
          >
            Créer un utilisateur
          </button>
          <button
            onClick={handleShowUserList}
            className={showUserList ? "active" : ""}
          >
            Afficher la liste
          </button>
        </div>
      </div>

      <div className="user-section">
        {showCreateUser && (
          <>
            <h1>Créer un utilisateur</h1>
            <UserForm onUserCreated={handleUserCreated} />
          </>
        )}

        {showUserList && (
          <>
            <h2>Liste des Utilisateurs</h2>
            <UserList users={users} />
          </>
        )}
      </div>
    </div>
  );
};

export default App;
