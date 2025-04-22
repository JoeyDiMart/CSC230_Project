import React from 'react';


function base64ToByteArray(base64Str) {
    const binaryStr = atob(base64Str); // Decode base64 to binary string
    const byteArray = new Uint8Array(binaryStr.length);
    for (let i = 0; i < binaryStr.length; i++) {
        byteArray[i] = binaryStr.charCodeAt(i);
    }
    return byteArray;
}

function Pubs({ pubs, onPublicationClick }) {
    return (
        <div className="pubs-scroll-wrapper">
            {pubs.length > 0 ? (
                pubs.map((publication, idx) => {
                    const fileName = publication.file?.name;
                    const binaryVersionOfData = base64ToByteArray(publication.file?.data);
                    const theBlob = new Blob([binaryVersionOfData], { type: publication.file?.type });
                    const downloadLink = window.URL.createObjectURL(theBlob);

                    return (
                        <div key={idx}
                             className="publication-container"
                             onClick={() => onPublicationClick?.(publication)} >
                            <div className="publication-title">
                                <p><strong>{publication.title}</strong></p>
                            </div>
                            <p><strong>Author(s):</strong> {publication.author?.join(", ")}</p>
                            <p><strong>Keywords:</strong> {publication.keywords?.join(", ")}</p>

                            {downloadLink && (
                                <a
                                    href={downloadLink}
                                    download={fileName}
                                    onClick={(e) => e.stopPropagation()}
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
                <div>
                    <p>No Publications</p>

                    {/*
                <div key="empty" className="publication-container">
                    <div className="publication-title">
                        <p><strong>{'The Title'}</strong></p>
                    </div>
                    <p><strong>Author(s):</strong> {'Test Author'}</p>
                    <p><strong>Keywords:</strong> {'Keyword1, keyword2'}</p>

                    <a
                        href="#"
                        download="placeholder.txt"
                        style={{
                            color: "blue",
                            textDecoration: "underline",
                            display: "inline-block",
                            marginTop: "8px"
                        }}
                    >
                        Download File
                    </a>
                </div>
                */}

                </div>
            )}
        </div>
    );
}

export default Pubs;
