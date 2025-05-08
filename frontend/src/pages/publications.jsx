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

function Pubs({ pubs, showStatus, onPublicationClick }) {

    const handleDownload = (e, publication) => {
        e.stopPropagation();
        const binaryVersionOfData = base64ToByteArray(publication.file?.data);
        const theBlob = new Blob([binaryVersionOfData], { type: publication.file?.type || publication.file?.contentType || 'application/pdf' });
        const downloadLink = window.URL.createObjectURL(theBlob);
        const a = document.createElement('a');
        a.href = downloadLink;
        a.download = publication.file?.name || 'download.pdf';
        a.click();
    };

    return (
        <div className="pubs-scroll-wrapper">
            {pubs.length > 0 ? (
                pubs.map((publication, idx) => {
                    return (
                        <div key={idx} className="publication-container" style={ {height: "315px"} } onClick={() => onPublicationClick(publication)} >
                            <div className="top-bar"></div>
                            {/* take base64 and make it the thumbnail */}
                            {publication.thumbnail && (
                                <img
                                    src={`data:image/png;base64,${publication.thumbnail}`}
                                    alt="PDF thumbnail"
                                    style={{ width: "100%", maxHeight: "300px", objectFit: "contain" }}
                                />
                            )}

                            <div className="publication-info-wrapper">
                                {showStatus && (
                                    <p className="publication-status">{publication.status}</p>
                                )}

                                {publication.file?.data && (
                                    <button
                                        onClick={(e) => handleDownload(e, publication)}
                                        className="publication-download"
                                    >
                                        Download File
                                    </button>
                                )}
                            </div>
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
