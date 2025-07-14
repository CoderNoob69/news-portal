import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FaUser, FaCamera } from 'react-icons/fa';
import './UserProfile.css';

const UserProfile = ({ onUserNameChange }) => {
  // In a real app, this would come from an API or context
  const [profile, setProfile] = useState({
    name: localStorage.getItem('userName') || 'John Doe',
    branch: localStorage.getItem('userBranch') || 'Computer Science and Engineering (CSE)',
    designation: localStorage.getItem('userDesignation') || 'Assistant Professor',
    email: localStorage.getItem('userEmail') || 'john.doe@example.com',
    photo: localStorage.getItem('userPhoto') || null
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(profile);

  const departments = [
    'Computer Science and Engineering (CSE)',
    'Information Technology (IT)',
    'Electronics and Communication Engineering (ECE)',
    'Electrical Engineering (Elec)',
    'Mechanical Engineering (Mech)',
    'Chemical Engineering (Chem)',
    'Mineral and Metallurgical Engineering (Meta)',
    'Civil Engineering (Civil)',
    'Biotech Engineering (BTE)',
    'Biomed Engineering (BME)',
    'Architecture (Arch)'
  ];

  const onDrop = useCallback(acceptedFiles => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const photoUrl = reader.result;
        setFormData(prev => ({ ...prev, photo: photoUrl }));
        // In a real app, you would upload this to a server
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    maxFiles: 1
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would be an API call to update the profile
    // Update localStorage for demo purposes
    localStorage.setItem('userName', formData.name);
    localStorage.setItem('userBranch', formData.branch);
    localStorage.setItem('userDesignation', formData.designation);
    localStorage.setItem('userEmail', formData.email);
    if (formData.photo) {
      localStorage.setItem('userPhoto', formData.photo);
    }
    // Re-sync state from localStorage to ensure UI updates
    const updatedProfile = {
      name: localStorage.getItem('userName') || 'John Doe',
      branch: localStorage.getItem('userBranch') || 'Computer Science and Engineering (CSE)',
      designation: localStorage.getItem('userDesignation') || 'Assistant Professor',
      email: localStorage.getItem('userEmail') || 'john.doe@example.com',
      photo: localStorage.getItem('userPhoto') || null
    };
    setProfile(updatedProfile);
    setFormData(updatedProfile);
    setIsEditing(false);
    if (onUserNameChange) {
      onUserNameChange(updatedProfile.name);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2>User Profile</h2>
        
        {isEditing ? (
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="profile-photo-upload" {...getRootProps()}>
              <input {...getInputProps()} />
              {formData.photo ? (
                <img src={formData.photo} alt="Profile" className="profile-photo" />
              ) : (
                <div className="profile-photo-placeholder">
                  <FaUser />
                </div>
              )}
              <div className="upload-overlay">
                <FaCamera />
                <span>{isDragActive ? 'Drop the image here' : 'Upload Photo'}</span>
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="branch">Department</label>
              <select
                id="branch"
                name="branch"
                value={formData.branch}
                onChange={handleChange}
                required
              >
                {departments.map((dept, index) => (
                  <option key={index} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="designation">Designation</label>
              <input
                type="text"
                id="designation"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                readOnly
              />
            </div>
            
            <div className="profile-actions">
              <button type="button" className="cancel-btn" onClick={() => setIsEditing(false)}>Cancel</button>
              <button type="submit" className="save-btn">Save Changes</button>
            </div>
          </form>
        ) : (
          <div className="profile-info">
            <div className="profile-photo-container">
              {profile.photo ? (
                <img src={profile.photo} alt="Profile" className="profile-photo" />
              ) : (
                <div className="profile-photo-placeholder">
                  <FaUser />
                </div>
              )}
            </div>
            
            <div className="profile-details">
              <div className="profile-field">
                <span className="field-label">Name:</span>
                <span className="field-value">{profile.name}</span>
              </div>
              
              <div className="profile-field">
                <span className="field-label">Department:</span>
                <span className="field-value">{profile.branch}</span>
              </div>
              
              <div className="profile-field">
                <span className="field-label">Designation:</span>
                <span className="field-value">{profile.designation}</span>
              </div>
              
              <div className="profile-field">
                <span className="field-label">Email:</span>
                <span className="field-value">{profile.email}</span>
              </div>
            </div>
            
            <button className="edit-profile-btn" onClick={() => setIsEditing(true)}>Edit Profile</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;