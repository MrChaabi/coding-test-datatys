import React from 'react';
import './Menu.css';

const Menu = ({ onShowCreateUser, onShowUserList }) => {
  return (
    <nav className="menu-container">
      <button className="menu-button" onClick={onShowCreateUser}>
        ➕ Créer un utilisateur
      </button>
      <button className="menu-button" onClick={onShowUserList}>
        📋 Afficher la liste
      </button>
    </nav>
  );
};

export default Menu;
