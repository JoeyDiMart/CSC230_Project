import React, { useState } from "react";
import styles from "./fellowPage.module.css";

const initialFellowsData = [
    {
        id: 1,
        name: "John Doe",
        year: "2023",
        bio: "John worked on AI research with Dr. Smith.",
        fellowshipTopic: "Artificial Intelligence in Healthcare",
        faculty: "Dr. Smith",
        image: "/images/Fellows/image6.jpeg",
        publishedLink: "https://example.com/publication1",
    },
    {
        id: 2,
        name: "Jane Smith",
        year: "2022",
        bio: "Jane focused on renewable energy solutions.",
        fellowshipTopic: "Sustainable Energy Systeimport React, { useState } from \"react\";\n" +
            "import styles from \"./fellowPage.module.css\";\n" +
            "\n" +
            "const FellowsPerPage = 8;\n" +
            "\n" +
            "function FellowPage({ role }) {\n" +
            "    const [fellowsData, setFellowsData] = useState(initialFellowsData);\n" +
            "    const [expandedFellow, setExpandedFellow] = useState(null);\n" +
            "    const [newFellow, setNewFellow] = useState({\n" +
            "        name: \"\",\n" +
            "        year: \"\",\n" +
            "        bio: \"\",\n" +
            "        fellowshipTopic: \"\",\n" +
            "        faculty: \"\",\n" +
            "        image: \"\",\n" +
            "        publishedLink: \"\",\n" +
            "    });\n" +
            "    const [currentPage, setCurrentPage] = useState(1);\n" +
            "\n" +
            "    const totalPages = Math.ceil(fellowsData.length / FellowsPerPage);\n" +
            "    const startIndex = (currentPage - 1) * FellowsPerPage;\n" +
            "    const endIndex = startIndex + FellowsPerPage;\n" +
            "    const currentFellows = fellowsData.slice(startIndex, endIndex);\n" +
            "\n" +
            "    const handleExpand = (fellow) => {\n" +
            "        setExpandedFellow(fellow);\n" +
            "    };\n" +
            "\n" +
            "    const handleClose = () => {\n" +
            "        setExpandedFellow(null);\n" +
            "    };\n" +
            "\n" +
            "    const handleInputChange = (e) => {\n" +
            "        const { name, value } = e.target;\n" +
            "        setNewFellow((prev) => ({ ...prev, [name]: value }));\n" +
            "    };\n" +
            "\n" +
            "    const handleAddFellow = (e) => {\n" +
            "        e.preventDefault();\n" +
            "        const newFellowData = { ...newFellow, id: fellowsData.length + 1 };\n" +
            "        setFellowsData((prev) => [...prev, newFellowData]);\n" +
            "        setNewFellow({\n" +
            "            name: \"\",\n" +
            "            year: \"\",\n" +
            "            bio: \"\",\n" +
            "            fellowshipTopic: \"\",\n" +
            "            faculty: \"\",\n" +
            "            image: \"\",\n" +
            "            publishedLink: \"\",\n" +
            "        });\n" +
            "    };\n" +
            "\n" +
            "    const handleNextPage = () => {\n" +
            "        if (currentPage < totalPages) {\n" +
            "            setCurrentPage((prev) => prev + 1);\n" +
            "        }\n" +
            "    };\n" +
            "\n" +
            "    const handlePreviousPage = () => {\n" +
            "        if (currentPage > 1) {\n" +
            "            setCurrentPage((prev) => prev - 1);\n" +
            "        }\n" +
            "    };\n" +
            "\n" +
            "    return (\n" +
            "        <div className={styles.fellowPage}>\n" +
            "            <h1 className={styles.pageTitle}>Fellows</h1>\n" +
            "            {role === \"admin\" && (\n" +
            "                <form className={styles.adminForm} onSubmit={handleAddFellow}>\n" +
            "                    <h2>Add New Fellow</h2>\n" +
            "                    <input\n" +
            "                        type=\"text\"\n" +
            "                        name=\"name\"\n" +
            "                        placeholder=\"Name\"\n" +
            "                        value={newFellow.name}\n" +
            "                        onChange={handleInputChange}\n" +
            "                        required\n" +
            "                    />\n" +
            "                    <input\n" +
            "                        type=\"text\"\n" +
            "                        name=\"year\"\n" +
            "                        placeholder=\"Year\"\n" +
            "                        value={newFellow.year}\n" +
            "                        onChange={handleInputChange}\n" +
            "                        required\n" +
            "                    />\n" +
            "                    <textarea\n" +
            "                        name=\"bio\"\n" +
            "                        placeholder=\"Bio\"\n" +
            "                        value={newFellow.bio}\n" +
            "                        onChange={handleInputChange}\n" +
            "                        required\n" +
            "                    />\n" +
            "                    <input\n" +
            "                        type=\"text\"\n" +
            "                        name=\"fellowshipTopic\"\n" +
            "                        placeholder=\"Fellowship Topic\"\n" +
            "                        value={newFellow.fellowshipTopic}\n" +
            "                        onChange={handleInputChange}\n" +
            "                        required\n" +
            "                    />\n" +
            "                    <input\n" +
            "                        type=\"text\"\n" +
            "                        name=\"faculty\"\n" +
            "                        placeholder=\"Faculty\"\n" +
            "                        value={newFellow.faculty}\n" +
            "                        onChange={handleInputChange}\n" +
            "                        required\n" +
            "                    />\n" +
            "                    <input\n" +
            "                        type=\"url\"\n" +
            "                        name=\"image\"\n" +
            "                        placeholder=\"Image URL\"\n" +
            "                        value={newFellow.image}\n" +
            "                        onChange={handleInputChange}\n" +
            "                        required\n" +
            "                    />\n" +
            "                    <input\n" +
            "                        type=\"url\"\n" +
            "                        name=\"publishedLink\"\n" +
            "                        placeholder=\"Published Work Link\"\n" +
            "                        value={newFellow.publishedLink}\n" +
            "                        onChange={handleInputChange}\n" +
            "                        required\n" +
            "                    />\n" +
            "                    <button type=\"submit\">Add Fellow</button>\n" +
            "                </form>\n" +
            "            )}\n" +
            "            <div className={styles.fellowGrid}>\n" +
            "                {currentFellows.map((fellow) => (\n" +
            "                    <div\n" +
            "                        key={fellow.id}\n" +
            "                        className={styles.fellowCard}\n" +
            "                        onClick={() => handleExpand(fellow)}\n" +
            "                    >\n" +
            "                        <button className={styles.fellowButton}>\n" +
            "                            <img\n" +
            "                                src={fellow.image}\n" +
            "                                alt={fellow.name}\n" +
            "                                className={styles.fellowImage}\n" +
            "                            />\n" +
            "                            <div className={styles.fellowInfo}>\n" +
            "                                <h2 className={styles.fellowName}>{fellow.name}</h2>\n" +
            "                                <p className={styles.fellowYear}>{fellow.year}</p>\n" +
            "                            </div>\n" +
            "                        </button>\n" +
            "                    </div>\n" +
            "                ))}\n" +
            "            </div>\n" +
            "\n" +
            "            <div className={styles.pagination}>\n" +
            "                <button\n" +
            "                    onClick={handlePreviousPage}\n" +
            "                    disabled={currentPage === 1}\n" +
            "                >\n" +
            "                    Previous\n" +
            "                </button>\n" +
            "                <span>\n" +
            "                    Page {currentPage} of {totalPages}\n" +
            "                </span>\n" +
            "                <button\n" +
            "                    onClick={handleNextPage}\n" +
            "                    disabled={currentPage === totalPages}\n" +
            "                >\n" +
            "                    Next\n" +
            "                </button>\n" +
            "            </div>\n" +
            "\n" +
            "            {expandedFellow && (\n" +
            "                <div className={`${styles.expandedContentContainer} ${styles.open}`}>\n" +
            "                    <div className={styles.expandedContent}>\n" +
            "                        <button\n" +
            "                            className={styles.closeButton}\n" +
            "                            onClick={handleClose}\n" +
            "                        >\n" +
            "                            &times;\n" +
            "                        </button>\n" +
            "                        <img\n" +
            "                            src={expandedFellow.image}\n" +
            "                            alt={expandedFellow.name}\n" +
            "                            className={styles.expandedImage}\n" +
            "                        />\n" +
            "                        <div className={styles.expandedDetails}>\n" +
            "                            <h2 className={styles.fellowName}>\n" +
            "                                {expandedFellow.name} ({expandedFellow.year})\n" +
            "                            </h2>\n" +
            "                            <p className={styles.fellowBio}>{expandedFellow.bio}</p>\n" +
            "                            <p>\n" +
            "                                <strong>Fellowship Topic:</strong>{\" \"}\n" +
            "                                {expandedFellow.fellowshipTopic}\n" +
            "                            </p>\n" +
            "                            <p>\n" +
            "                                <strong>Faculty:</strong> {expandedFellow.faculty}\n" +
            "                            </p>\n" +
            "                            <a\n" +
            "                                href={expandedFellow.publishedLink}\n" +
            "                                target=\"_blank\"\n" +
            "                                rel=\"noopener noreferrer\"\n" +
            "                                className={styles.publishedLink}\n" +
            "                            >\n" +
            "                                View Published Work\n" +
            "                            </a>\n" +
            "                        </div>\n" +
            "                    </div>\n" +
            "                </div>\n" +
            "            )}\n" +
            "        </div>\n" +
            "    );\n" +
            "}\n" +
            "\n" +
            "export default FellowPage;ms",
        faculty: "Dr. Johnson",
        image: "/images/Fellows/image5.jpeg",
        publishedLink: "https://example.com/publication2",
    },
    {
        id: 3,
        name: "John Doe",
        year: "2023",
        bio: "John worked on AI research with Dr. Smith.",
        fellowshipTopic: "Artificial Intelligence in Healthcare",
        faculty: "Dr. Smith",
        image: "/images/Fellows/image6.jpeg",
        publishedLink: "https://example.com/publication1",
    },
    {
        id: 4,
        name: "Jane Smith",
        year: "2022",
        bio: "Jane focused on renewable energy solutions.",
        fellowshipTopic: "Sustainable Energy Systems",
        faculty: "Dr. Johnson",
        image: "/images/Fellows/image5.jpeg",
        publishedLink: "https://example.com/publication2",
    },{
        id: 5,
        name: "John Doe",
        year: "2023",
        bio: "John worked on AI research with Dr. Smith.",
        fellowshipTopic: "Artificial Intelligence in Healthcare",
        faculty: "Dr. Smith",
        image: "/images/Fellows/image4.jpeg",
        publishedLink: "https://example.com/publication1",
    },
    // Existing fellows
    {
        id: 6,
        name: "Alice Johnson",
        year: "2021",
        bio: "Alice explored quantum computing applications.",
        fellowshipTopic: "Quantum Computing in Cryptography",
        faculty: "Dr. Brown",
        image: "/images/Fellows/image3.jpeg",
        publishedLink: "https://example.com/publication3",
    },
    {
        id: 7,
        name: "Bob Williams",
        year: "2020",
        bio: "Bob developed machine learning models for finance.",
        fellowshipTopic: "Machine Learning in Financial Markets",
        faculty: "Dr. Green",
        image: "/images/Fellows/image2.jpeg",
        publishedLink: "https://example.com/publication4",
    },
    {
        id: 8,
        name: "Catherine Lee",
        year: "2019",
        bio: "Catherine worked on renewable energy storage systems.",
        fellowshipTopic: "Energy Storage Solutions",
        faculty: "Dr. White",
        image: "/images/Fellows/image1.jpeg",
        publishedLink: "https://example.com/publication5",
    },
    {
        id: 9,
        name: "David Kim",
        year: "2023",
        bio: "David researched blockchain technology.",
        fellowshipTopic: "Blockchain for Supply Chain Management",
        faculty: "Dr. Black",
        image: "/images/Fellows/image0.jpeg",
        publishedLink: "https://example.com/publication6",
    },
];

const FellowsPerPage = 8;

function FellowPage({ role }) {
    const [fellowsData, setFellowsData] = useState(initialFellowsData);
    const [expandedFellow, setExpandedFellow] = useState(null);
    const [newFellow, setNewFellow] = useState({
        name: "",
        year: "",
        bio: "",
        fellowshipTopic: "",
        faculty: "",
        image: "",
        publishedLink: "",
    });
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(fellowsData.length / FellowsPerPage);
    const startIndex = (currentPage - 1) * FellowsPerPage;
    const endIndex = startIndex + FellowsPerPage;
    const currentFellows = fellowsData.slice(startIndex, endIndex);

    const handleExpand = (fellow) => {
        setExpandedFellow(fellow);
    };

    const handleClose = () => {
        setExpandedFellow(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewFellow((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddFellow = (e) => {
        e.preventDefault();
        const newFellowData = { ...newFellow, id: fellowsData.length + 1 };
        setFellowsData((prev) => [...prev, newFellowData]);
        setNewFellow({
            name: "",
            year: "",
            bio: "",
            fellowshipTopic: "",
            faculty: "",
            image: "",
            publishedLink: "",
        });
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage((prev) => prev + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prev) => prev - 1);
        }
    };

    return (
        <div className={styles.fellowPage}>
            <h1 className={styles.pageTitle}>Fellows</h1>
            {role === "admin" && (
                <form className={styles.adminForm} onSubmit={handleAddFellow}>
                    <h2>Add New Fellow</h2>
                    <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={newFellow.name}
                        onChange={handleInputChange}
                        required
                    />
                    <input
                        type="text"
                        name="year"
                        placeholder="Year"
                        value={newFellow.year}
                        onChange={handleInputChange}
                        required
                    />
                    <textarea
                        name="bio"
                        placeholder="Bio"
                        value={newFellow.bio}
                        onChange={handleInputChange}
                        required
                    />
                    <input
                        type="text"
                        name="fellowshipTopic"
                        placeholder="Fellowship Topic"
                        value={newFellow.fellowshipTopic}
                        onChange={handleInputChange}
                        required
                    />
                    <input
                        type="text"
                        name="faculty"
                        placeholder="Faculty"
                        value={newFellow.faculty}
                        onChange={handleInputChange}
                        required
                    />
                    <input
                        type="url"
                        name="image"
                        placeholder="Image URL"
                        value={newFellow.image}
                        onChange={handleInputChange}
                        required
                    />
                    <input
                        type="url"
                        name="publishedLink"
                        placeholder="Published Work Link"
                        value={newFellow.publishedLink}
                        onChange={handleInputChange}
                        required
                    />
                    <button type="submit">Add Fellow</button>
                </form>
            )}
            <div className={styles.fellowGrid}>
                {currentFellows.map((fellow) => (
                    <div
                        key={fellow.id}
                        className={styles.fellowCard}
                        onClick={() => handleExpand(fellow)}
                    >
                        <button className={styles.fellowButton}>
                            <img
                                src={fellow.image}
                                alt={fellow.name}
                                className={styles.fellowImage}
                            />
                            <div className={styles.fellowInfo}>
                                <h2 className={styles.fellowName}>{fellow.name}</h2>
                                <p className={styles.fellowYear}>{fellow.year}</p>
                            </div>
                        </button>
                    </div>
                ))}
            </div>

            <div className={styles.pagination}>
                <button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                <span>
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>

            {expandedFellow && (
                <div className={`${styles.expandedContentContainer} ${styles.open}`}>
                    <div className={styles.expandedContent}>
                        <button
                            className={styles.closeButton}
                            onClick={handleClose}
                        >
                            &times;
                        </button>
                        <img
                            src={expandedFellow.image}
                            alt={expandedFellow.name}
                            className={styles.expandedImage}
                        />
                        <div className={styles.expandedDetails}>
                            <h2 className={styles.fellowName}>
                                {expandedFellow.name} ({expandedFellow.year})
                            </h2>
                            <p className={styles.fellowBio}>{expandedFellow.bio}</p>
                            <p>
                                <strong>Fellowship Topic:</strong>{" "}
                                {expandedFellow.fellowshipTopic}
                            </p>
                            <p>
                                <strong>Faculty:</strong> {expandedFellow.faculty}
                            </p>
                            <a
                                href={expandedFellow.publishedLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.publishedLink}
                            >
                                View Published Work
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default FellowPage;