import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { FaCloudUploadAlt, FaLink, FaTrash } from 'react-icons/fa';
import './News.css';

const NewsUpload = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    files: [],
    driveLinks: []
  });
  const [driveLink, setDriveLink] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Get user department from localStorage (in a real app, this would come from an API)
  const userDepartment = localStorage.getItem('userBranch') || 'Computer Science and Engineering (CSE)';

  const onDrop = useCallback(acceptedFiles => {
    // In a real app, you would upload these files to a server or cloud storage
    // For this demo, we'll just store them in the component state
    const newFiles = acceptedFiles.map(file => ({
      name: file.name,
      size: file.size,
      type: file.type,
      // In a real app, this would be a URL from your server or cloud storage
      // For demo purposes, we'll create a local object URL
      url: URL.createObjectURL(file)
    }));

    setFormData(prev => ({
      ...prev,
      files: [...prev.files, ...newFiles]
    }));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': [],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-powerpoint': ['.ppt'],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
      'text/plain': ['.txt']
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddDriveLink = () => {
    if (!driveLink) return;
    
    // Basic validation for Google Drive link
    if (!driveLink.includes('drive.google.com')) {
      setError('Please enter a valid Google Drive link');
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      driveLinks: [...prev.driveLinks, { url: driveLink, name: `Drive Link ${prev.driveLinks.length + 1}` }]
    }));
    setDriveLink('');
    setError('');
  };

  const handleRemoveFile = (index) => {
    setFormData(prev => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index)
    }));
  };

  const handleRemoveDriveLink = (index) => {
    setFormData(prev => ({
      ...prev,
      driveLinks: prev.driveLinks.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    // Basic validation
    if (!formData.title) {
      setError('Title is required');
      return;
    }
    
    // In a real app, this would be an API call to save the news post
    // For demo purposes, we'll just simulate a successful post
    
    // Create a news object
    const newsItem = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      department: userDepartment,
      files: formData.files,
      driveLinks: formData.driveLinks,
      date: new Date().toISOString(),
      author: localStorage.getItem('userName') || 'Anonymous'
    };
    
    // Get existing news from localStorage or initialize empty array
    const existingNews = JSON.parse(localStorage.getItem('newsItems') || '[]');
    
    // Add new news item to the array
    const updatedNews = [newsItem, ...existingNews];
    
    // Save back to localStorage
    localStorage.setItem('newsItems', JSON.stringify(updatedNews));
    
    // Show success message
    setSuccess('News posted successfully!');
    
    // Reset form
    setFormData({
      title: '',
      description: '',
      files: [],
      driveLinks: []
    });
    
    // Redirect to department page after a short delay
    setTimeout(() => {
      navigate('/department');
    }, 2000);
  };

  return (
    <div className="news-upload-container">
      <div className="news-upload-card">
        <h2>Post News for {userDepartment}</h2>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
        <form onSubmit={handleSubmit} className="news-upload-form">
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter news title"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter news description (optional)"
              rows="4"
            />
          </div>
          
          <div className="form-group">
            <label>Upload Files</label>
            <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
              <input {...getInputProps()} />
              <FaCloudUploadAlt className="upload-icon" />
              {isDragActive ? (
                <p>Drop the files here...</p>
              ) : (
                <p>Drag & drop files here, or click to select files</p>
              )}
              <em>Supports images, PDFs, Word, Excel, PowerPoint, and text files</em>
            </div>
          </div>
          
          {formData.files.length > 0 && (
            <div className="uploaded-files">
              <h3>Uploaded Files</h3>
              <ul className="file-list">
                {formData.files.map((file, index) => (
                  <li key={index} className="file-item">
                    <span className="file-name">{file.name}</span>
                    <button 
                      type="button" 
                      className="remove-file-btn"
                      onClick={() => handleRemoveFile(index)}
                    >
                      <FaTrash />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="form-group">
            <label>Add Google Drive Links</label>
            <div className="drive-link-input">
              <input
                type="text"
                value={driveLink}
                onChange={(e) => setDriveLink(e.target.value)}
                placeholder="Paste Google Drive link here"
              />
              <button 
                type="button" 
                className="add-link-btn"
                onClick={handleAddDriveLink}
              >
                <FaLink /> Add
              </button>
            </div>
          </div>
          
          {formData.driveLinks.length > 0 && (
            <div className="drive-links">
              <h3>Added Drive Links</h3>
              <ul className="file-list">
                {formData.driveLinks.map((link, index) => (
                  <li key={index} className="file-item">
                    <a href={link.url} target="_blank" rel="noopener noreferrer" className="file-name">
                      {link.name}
                    </a>
                    <button 
                      type="button" 
                      className="remove-file-btn"
                      onClick={() => handleRemoveDriveLink(index)}
                    >
                      <FaTrash />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <button type="submit" className="submit-btn">Post News</button>
        </form>
      </div>
    </div>
  );
};

export default NewsUpload;