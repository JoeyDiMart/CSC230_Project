import React from 'react';

function Pubs({ pubs }) {
    return (
        <div className="pubs-scroll-wrapper">
            {pubs.length > 0 ? (
                pubs.map((publication, idx) => {
                    const fileName = publication.file?.name;
                    const downloadLink = fileName ? `http://localhost:8081/files/${fileName}` : null;
                    console.log(downloadLink);
                    return (
                        <div key={idx} className="publication-container">
                            <p><strong>Title:</strong> {publication.title}</p>
                            <p><strong>Author(s):</strong> {publication.author?.join(", ")}</p>
                            <p><strong>Keywords:</strong> {publication.keywords?.join(", ")}</p>
                            <p><strong>Status:</strong> {publication.status}</p>

                            {downloadLink && (
                                <a
                                    href={downloadLink}
                                    download={fileName}
                                    style={{
                                        color: "blue",
                                        textDecoration: "underline",
                                        display: "inline-block",
                                        marginTop: "8px"
                                    }}
                                >
                                    Download File
                                </a>
                            )}
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
