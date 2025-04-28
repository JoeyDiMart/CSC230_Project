import React from 'react';


// all the stuff in base 64 convert back to the file/image 
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
                        <div key={idx} className="publication-container" onClick={() => onPublicationClick?.(publication)} >
                            <div className="top-bar"></div>
                            {/* take base64 and make it the thumbnail */}
                                <img
                                    src={publication.thumbnail}
                                    alt="Thumbnail"
                                    className="publication-thumbnail"
                                    loading="lazy"
                                />
                            {/*
                            <p className="publication-title-text">{publication.title}</p>

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
                            */}
                        </div>
                    );
                })
            ) : (
                <div>
                    <p>No Publications</p>
                </div>
            )}
        </div>
    );
}

export default Pubs;
