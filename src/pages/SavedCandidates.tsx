import React, { useEffect, useState } from 'react';
import { Candidate } from '../interfaces/Candidate.interface';

const SavedCandidates: React.FC = () => {
  const [savedCandidates, setSavedCandidates] = useState<Candidate[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('savedCandidates');
    if (saved) {
      setSavedCandidates(JSON.parse(saved));
    } else {
      setError('No candidates have been accepted.');
    }
  }, []);

  const handleReject = (candidateId: number) => {
    const updatedCandidates = savedCandidates.filter(candidate => candidate.id !== candidateId);
    
    localStorage.setItem('savedCandidates', JSON.stringify(updatedCandidates));
    
    setSavedCandidates(updatedCandidates);
  };

  if (savedCandidates.length === 0) {
    return <p>{error}</p>;
  }

  return (
    <div className="saved-candidates">
      <h1>Potential Candidates</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Location</th>
            <th>Email</th>
            <th>Company</th>
            <th>Bio</th>
            <th>Reject</th>
          </tr>
        </thead>
        <tbody>
          {savedCandidates.map((candidate) => (
            <tr key={candidate.id}>
              <td>
                <img src={candidate.avatar_url} alt={`${candidate.login}'s avatar`} width={50} />
              </td>
              <td>{candidate.login}</td>
              <td>{candidate.location || 'N/A'}</td>
              <td>{candidate.email || 'N/A'}</td>
              <td>{candidate.company || 'N/A'}</td>
              <td>need to complete</td>
              <td>
                <button onClick={() => handleReject(candidate.id)}>Reject</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SavedCandidates;
