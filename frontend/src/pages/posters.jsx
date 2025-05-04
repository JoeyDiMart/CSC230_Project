import React from 'react';

function base64ToByteArray(base64Str) {
    const binaryStr = atob(base64Str); // Decode base64 to binary string
    const byteArray = new Uint8Array(binaryStr.length);
    for (let i = 0; i < binaryStr.length; i++) {
        byteArray[i] = binaryStr.charCodeAt(i);
    }
    return byteArray;
}

function Posters({ posters, onPosterClick }) {
    return (
        <div className="posters-scroll-wrapper">
            {posters.length > 0 ? (
                posters.map((poster, idx) => {
                    const fileName = poster.file?.name;
                    const binaryVersionOfData = base64ToByteArray(poster.file?.data);
                    const theBlob = new Blob([binaryVersionOfData], { type: poster.file?.type });
                    const downloadLink = window.URL.createObjectURL(theBlob);

                    return (
                        <div key={idx}
                             className="poster-container"
                             onClick={() => onPosterClick?.(poster)} >
                            <div className="poster-title">
                                <p><strong>{poster.title}</strong></p>
                            </div>
                            <p><strong>Author:</strong> {poster.author}</p>
                            <p><strong>Keywords:</strong> {poster.keywords?.join(", ")}</p>
                            
                            {/* Show thumbnail preview if it's an image */}
                            {poster.file?.type.startsWith('image/') && (
                                <div className="poster-thumbnail">
                                    <img src={downloadLink} alt={poster.title} />
                                </div>
                            )}

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
                    <p>No Posters</p>
                </div>
            )}
        </div>
    );
}

export default Posters;
