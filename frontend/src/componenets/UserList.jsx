import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './UserList.css'; // ✅ Import du fichier CSS
import { FaEdit, FaTrashAlt } from 'react-icons/fa';

const UserList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3002/users');
        setUsers(response.data);
      } catch (error) {
        console.error('❌ Erreur lors de la récupération des utilisateurs :', error);
      }
    };

    fetchUsers();
  }, []);

  const handleEdit = (id) => {
    console.log('Éditer utilisateur avec id :', id);
  };

  const handleDelete = (id) => {
    console.log('Supprimer utilisateur avec id :', id);
  };

  return (
    <div className="user-list-container">
      <h2 className="user-list-title">📋 Liste des Utilisateurs</h2>

      {users.length === 0 ? (
        <p className="no-users">Aucun utilisateur trouvé.</p>
      ) : (
        <div className="user-list-grid">
          {users.map((user) => (
            <div key={user.id} className="user-card">
              {user.avatar_path && (
                <div className="user-avatar">
                  <img
                    src={`http://localhost:3002/${user.avatar_path}`}
                    alt="Avatar"
                    className="avatar-image"
                  />
                </div>
              )}

              <div className="user-info">
                <h3>{user.first_name} {user.last_name}</h3>
                <p className="user-email">{user.email}</p>
                <p><strong>📍 Pays :</strong> {user.country}, {user.city}</p>
                <p><strong>📞 Téléphone :</strong> {user.phone_number}</p>
              </div>

              <div className="user-actions">
                <button className="action-btn edit-btn" onClick={() => handleEdit(user.id)}>
                  <FaEdit className="icon" /> Modifier
                </button>
                <button className="action-btn delete" onClick={() => handleDelete(user.id)}>
                  <FaTrashAlt className="icon" /> Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserList;
