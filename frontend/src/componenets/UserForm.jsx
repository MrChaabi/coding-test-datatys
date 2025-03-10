// src/components/UserForm/UserForm.jsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import './UserForm.css'; // Import du fichier CSS

const UserForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [avatar, setAvatar] = useState(null);

  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      setAvatar(acceptedFiles[0]);
    },
  });

  const onSubmit = async (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });
    if (avatar) {
      formData.append('avatar', avatar);
    }

    try {
      const response = await axios.post('http://localhost:3002/users', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('Réponse du serveur :', response.data);
      alert('Utilisateur créé avec succès !');
    } catch (error) {
      alert('Erreur lors de la création du profil');
    }
  };

  return (
    <div className="user-form-container">
      <div className="user-form">
        <h1>Créer un Profil Utilisateur</h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Prénom */}
          <div>
            <label htmlFor="first_name">Prénom *</label>
            <input
              id="first_name"
              {...register('first_name', { required: 'Ce champ est requis' })}
            />
            {errors.first_name && (
              <p className="error-message">{errors.first_name.message}</p>
            )}
          </div>

          {/* Nom */}
          <div>
            <label htmlFor="last_name">Nom *</label>
            <input
              id="last_name"
              {...register('last_name', { required: 'Ce champ est requis' })}
            />
            {errors.last_name && (
              <p className="error-message">{errors.last_name.message}</p>
            )}
          </div>

          {/* Pays */}
          <div>
            <label htmlFor="country">Pays *</label>
            <input
              id="country"
              {...register('country', { required: 'Ce champ est requis' })}
            />
            {errors.country && (
              <p className="error-message">{errors.country.message}</p>
            )}
          </div>

          {/* Ville */}
          <div>
            <label htmlFor="city">Ville *</label>
            <input
              id="city"
              {...register('city', { required: 'Ce champ est requis' })}
            />
            {errors.city && (
              <p className="error-message">{errors.city.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email">Email *</label>
            <input
              id="email"
              type="email"
              {...register('email', {
                required: 'Email requis',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Email invalide',
                },
              })}
            />
            {errors.email && (
              <p className="error-message">{errors.email.message}</p>
            )}
          </div>

          {/* Téléphone */}
          <div>
            <label htmlFor="phone_number">Téléphone *</label>
            <input
              id="phone_number"
              {...register('phone_number', { required: 'Ce champ est requis' })}
            />
            {errors.phone_number && (
              <p className="error-message">{errors.phone_number.message}</p>
            )}
          </div>

          {/* Zone de téléchargement de l'avatar */}
          <div {...getRootProps()} className="dropzone">
            <input {...getInputProps()} />
            <p>Glissez votre avatar ici ou cliquez pour sélectionner un fichier</p>
            {avatar && (
              <p className="file-selected">Fichier sélectionné : {avatar.name}</p>
            )}
          </div>

          {/* Bouton de soumission */}
          <button type="submit">Créer le profil</button>
        </form>
      </div>
    </div>
  );
};

export default UserForm;
