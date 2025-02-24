import { client } from './Mongodb.js';

/**
 * Submits a manuscript to the database.
 * This function is responsible for inserting a new manuscript into the database.
 * It takes in the manuscript data, file, and user ID as parameters.
 * It returns an object containing the submission ID.
 * If no file is uploaded, it throws an error.
 * 
 * @param {Object} manuscriptData - The data of the manuscript including title, abstract, authors, and keywords.
 * @param {File} file - The manuscript file uploaded by the user.
 * @param {string} userId - The ID of the user submitting the manuscript.
 * @returns {Object} - An object containing the submission ID.
 * @throws {Error} - Throws an error if no file is uploaded.
 */
export const submitManuscript = async (manuscriptData, file, userId) => {
    const { title, abstract, authors, keywords } = manuscriptData;

    if (!file) {
        throw new Error('No manuscript file uploaded');
    }

    const db = client.db('CIRT');
    const result = await db.collection('SUBMISSIONS').insertOne({
        title,
        abstract,
        authors: Array.isArray(authors) ? authors : JSON.parse(authors),
        keywords: typeof keywords === 'string' ? keywords.split(',').map(k => k.trim()) : keywords,
        filePath: file.path,
        submittedBy: userId,
        submissionDate: new Date(),
        status: 'Received',
        reviews: [],
        currentVersion: 1,
        isPublished: false
    });

    return { submissionId: result.insertedId };
};

/**
 * Retrieves submissions that are available for review.
 * This function is responsible for fetching submissions that are either received or under review.
 * It returns an array of submissions.
 * 
 * @returns {Array} - An array of submissions that are either received or under review.
 */
export const getSubmissionsForReview = async () => {
    const db = client.db('CIRT');
    const submissions = await db.collection('SUBMISSIONS')
        .find({
            status: { $in: ['Received', 'Under Review'] },
            isPublished: false
        })
        .project({
            title: 1,
            abstract: 1,
            keywords: 1,
            status: 1,
            submissionDate: 1
        })
        .toArray();

    return submissions;
};

/**
 * Submits a review for a manuscript.
 * This function is responsible for inserting a new review into the database.
 * It takes in the submission ID, review data, file, and reviewer ID as parameters.
 * It returns a message indicating successful submission of the review.
 * If the submission is not found or already reviewed, it throws an error.
 * 
 * @param {string} submissionId - The ID of the submission being reviewed.
 * @param {Object} reviewData - The review data including comments and decision.
 * @param {File} file - The annotated file uploaded by the reviewer.
 * @param {string} reviewerId - The ID of the reviewer.
 * @returns {Object} - A message indicating successful submission of the review.
 * @throws {Error} - Throws an error if the submission is not found or already reviewed.
 */
export const submitReview = async (submissionId, reviewData, file, reviewerId) => {
    const { comments, decision, confidentialComments } = reviewData;

    const db = client.db('CIRT');
    const result = await db.collection('SUBMISSIONS').updateOne(
        { _id: submissionId },
        {
            $push: {
                reviews: {
                    reviewerId,
                    comments,
                    confidentialComments,
                    decision,
                    annotatedFilePath: file?.path,
                    reviewDate: new Date()
                }
            },
            $set: { status: 'Under Review' }
        }
    );

    if (result.modifiedCount === 0) {
        throw new Error('Submission not found or already reviewed');
    }

    return { message: 'Review submitted successfully' };
};

/**
 * Makes a decision on a manuscript submission by the editor.
 * This function is responsible for updating the submission status and recording the editor's decision.
 * It takes in the submission ID and decision data as parameters.
 * It returns a message indicating successful recording of the decision.
 * If the submission is not found, it throws an error.
 * 
 * @param {string} submissionId - The ID of the submission being decided on.
 * @param {Object} decisionData - The decision data including the decision and editor comments.
 * @returns {Object} - A message indicating successful recording of the decision.
 * @throws {Error} - Throws an error if the submission is not found.
 */
export const makeDecision = async (submissionId, decisionData) => {
    const { decision, editorComments } = decisionData;
    const db = client.db('CIRT');
    
    const result = await db.collection('SUBMISSIONS').updateOne(
        { _id: submissionId },
        {
            $set: {
                status: decision,
                editorComments,
                decisionDate: new Date()
            }
        }
    );

    if (result.modifiedCount === 0) {
        throw new Error('Submission not found');
    }

    return { message: 'Decision recorded successfully' };
};

/**
 * Creates a new issue in the database.
 * This function is responsible for inserting a new issue into the database.
 * It takes in the issue data as a parameter.
 * It returns a message indicating successful creation of the issue.
 * 
 * @param {Object} issueData - The data of the issue including volume, number, season, year, and articles.
 * @returns {Object} - A message indicating successful creation of the issue.
 */
export const createIssue = async (issueData) => {
    const { volume, number, season, year, articles } = issueData;
    const db = client.db('CIRT');

    const result = await db.collection('ISSUES').insertOne({
        volume,
        number,
        season,
        year,
        articles,
        createdDate: new Date()
    });

    return { message: 'Issue created successfully', issueId: result.insertedId };
};

/**
 * Retrieves all published issues from the database.
 * This function is responsible for fetching all published issues from the database.
 * It returns an array of published issues.
 * 
 * @returns {Array} - An array of published issues.
 */
export const getPublishedIssues = async () => {
    const db = client.db('CIRT');
    const issues = await db.collection('ISSUES').find({}).toArray();
    return issues;
};
