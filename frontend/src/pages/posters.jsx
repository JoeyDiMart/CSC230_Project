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
    const handleDownload = (poster, e) => {
        e.stopPropagation(); // Prevent triggering the click on the container
        const byteArray = base64ToByteArray(poster.file?.data);
        const blob = new Blob([byteArray], { type: poster.file?.type });
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = poster.file?.name || 'download';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url); // Clean up
    };

    return (
        <div className="posters-scroll-wrapper">
            {posters.length > 0 ? (
                posters.map((poster, idx) => (
                    <div key={idx}
                         className="poster-container"
                         onClick={() => onPosterClick?.(poster)} >
                        <div className="poster-title">
                            <p><strong>{poster.title}</strong></p>
                        </div>
                        <p><strong>Author:</strong> {poster.author}</p>
                        <p><strong>Keywords:</strong> {poster.keywords?.join(", ")}</p>

                        {/* Show image preview */}
                        {poster.file?.type?.startsWith('image/') && (
                            <div className="poster-thumbnail">
                                <img
                                    src={`data:${poster.file.type};base64,${poster.file.data}`}
                                    alt={poster.title}
                                />
                            </div>
                        )}

                        {poster.file && (
                            <button
                                onClick={(e) => handleDownload(poster, e)}
                                style={{
                                    color: "blue",
                                    textDecoration: "underline",
                                    display: "inline-block",
                                    marginTop: "8px",
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    padding: 0
                                }}
                            >
                                Download File
                            </button>
                        )}
                    </div>
                ))
            ) : (
                <div>
                    <p>No Posters</p>
                </div>
            )}
        </div>
    );
}

export default Posters;
