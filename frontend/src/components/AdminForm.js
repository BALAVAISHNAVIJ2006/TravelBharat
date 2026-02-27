import React, { useState } from 'react';
import axios from 'axios';

const AdminForm = ({ onAdd }) => {
  const [formData, setFormData] = useState({
    name: '', state: '', city: '', category: '', description: '', bestTimeToVisit: '', location: '', images: '', entryFees: '', timings: '', nearbyAttractions: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/admin/places`, formData, {
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      onAdd(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Name" onChange={handleChange} required />
      <input name="state" placeholder="State" onChange={handleChange} required />
      <input name="city" placeholder="City" onChange={handleChange} required />
      <input name="category" placeholder="Category" onChange={handleChange} required />
      <textarea name="description" placeholder="Description" onChange={handleChange} required />
      <input name="bestTimeToVisit" placeholder="Best Time" onChange={handleChange} required />
      <input name="location" placeholder="Location" onChange={handleChange} />
      <input name="images" placeholder="Images (comma separated URLs)" onChange={handleChange} />
      <input name="entryFees" placeholder="Entry Fees" onChange={handleChange} />
      <input name="timings" placeholder="Timings" onChange={handleChange} />
      <input name="nearbyAttractions" placeholder="Nearby (comma separated)" onChange={handleChange} />
      <button type="submit">Add Place</button>
    </form>
  );
};

export default AdminForm;