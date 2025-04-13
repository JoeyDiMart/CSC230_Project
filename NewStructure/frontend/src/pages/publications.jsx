import React from 'react';

function Pubs({ pubs }) {
    return (
        <div className="pubs-scroll-wrapper">
            {pubs.length > 0 ? (
                pubs.map((publication, idx) => {
                    const fixedPath = publication.filePath.replace(/\\/g, "/");
                    const fileName = fixedPath.split("/").pop();

                    return (
                        <div key={idx} className="publication-container">
                            <p><strong>Title:</strong> {publication.title}</p>
                            <p><strong>Author(s):</strong> {publication.author?.join(", ")}</p>
                            <p><strong>Keywords:</strong> {publication.keywords?.join(", ")}</p>
                            <a
                                href={`http://localhost:8081/${fixedPath}`}
                                download={fileName}
                                style={{ color: "blue", textDecoration: "underline", display: "inline-block", marginTop: "8px" }}
                            >
                                Download File {`http://localhost:8081/${fixedPath}`}
                            </a>
                        </div>
                    );
                })
            ) : (
                <p>No publications found.</p>
            )}
        </div>

    );
}
export default Pubs;
