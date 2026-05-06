import React, { useEffect, useState } from 'react';
import API from '../api';

function Person() {
  const [developer, setDeveloper] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    API.get('/person')
      .then(response => setDeveloper(response.data))
      .catch(err => setError('Failed to load profile'));
  }, []);

  if (error) return <p>{error}</p>;
  if (!developer) return <p>Loading...</p>;

  return (
    <div>
      <h1>{developer.name}</h1>
      <p>{developer.introduction}</p>
      <p>Email: {developer.email}</p>
      <a href={developer.gitHub} target="_blank" rel="noreferrer">GitHub</a>
      {' | '}
      <a href={developer.linkedIn} target="_blank" rel="noreferrer">LinkedIn</a>
    </div>
  );
}

export default Person;