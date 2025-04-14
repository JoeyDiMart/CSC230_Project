import React from 'react';


function base64ToByteArray(base64Str) {
    console.log(base64Str);
    const binaryStr = atob(base64Str); // Decode base64 to binary string
    console.log(binaryStr);
    const byteArray = new Uint8Array(binaryStr.length);
    console.log(byteArray);
    for (let i = 0; i < binaryStr.length; i++) {
        byteArray[i] = binaryStr.charCodeAt(i);
    }
    return byteArray;
}

function Pubs({ pubs }) {
    return (
        <div className="pubs-scroll-wrapper">
            {pubs.length > 0 ? (
                pubs.map((publication, idx) => {
                    const fileName = publication.file?.name;
                    // const downloadLink = fileName ? `http://localhost:8081/files/${fileName}` : null;

                    // TODO: Convert publication.file?.data from Base64 to Binary
                    const binaryVersionOfData = base64ToByteArray(publication.file?.data)
                    var theBlob = new Blob([binaryVersionOfData], {type: publication.file?.type});
                    console.log(theBlob);
                    const downloadLink = window.URL.createObjectURL(theBlob);
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
