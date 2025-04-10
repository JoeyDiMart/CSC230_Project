import React from 'react';

function Pubs({ pubs }) {
    return (
        <div>
            {pubs.length > 0 ? (
                pubs.map((publication, idx) => (
                    <div key={idx} className="publication-container">
                        <h3>{publication.title}</h3>
                        <p><strong>Author(s):</strong> {publication.author?.join(", ")}</p>
                        <p><strong>Keywords:</strong> {publication.keywords?.join(", ")}</p>
                    </div>
                ))
            ) : (
                <p>No publications found.</p>
            )}
        </div>
    );
}
export default Pubs;
