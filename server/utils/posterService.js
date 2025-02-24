import { client } from './Mongodb.js';

export const createPoster = async (posterData, file, userId) => {
    const { title, authors, semester, year, keywords } = posterData;

    if (!file) {
        throw new Error('No poster file uploaded');
    }

    const db = client.db('CIRT');
    const result = await db.collection('POSTERS').insertOne({
        title,
        authors: Array.isArray(authors) ? authors : JSON.parse(authors),
        semester,
        year: parseInt(year),
        keywords: typeof keywords === 'string' ? keywords.split(',').map(k => k.trim()) : keywords,
        filePath: file.path,
        uploadedBy: userId,
        uploadDate: new Date(),
        isPublic: true
    });

    return { posterId: result.insertedId };
};

export const searchPosters = async (filters) => {
    const { year, semester, keywords, author } = filters;
    const query = { isPublic: true };

    if (year) query.year = parseInt(year);
    if (semester) query.semester = semester;
    if (keywords) {
        const keywordList = typeof keywords === 'string' ? keywords.split(',').map(k => k.trim()) : keywords;
        query.keywords = { $in: keywordList };
    }
    if (author) {
        query['authors.name'] = { $regex: author, $options: 'i' };
    }

    const db = client.db('CIRT');
    const posters = await db.collection('POSTERS')
        .find(query)
        .sort({ uploadDate: -1 })
        .toArray();

    return posters;
};

export const getPosterById = async (posterId) => {
    const db = client.db('CIRT');
    const poster = await db.collection('POSTERS').findOne({
        _id: posterId,
        isPublic: true
    });

    if (!poster) {
        throw new Error('Poster not found');
    }

    return poster;
};

export const updatePoster = async (posterId, updateData) => {
    const { title, authors, keywords, isPublic } = updateData;
    const db = client.db('CIRT');
    
    const result = await db.collection('POSTERS').updateOne(
        { _id: posterId },
        {
            $set: {
                ...(title && { title }),
                ...(authors && { authors: Array.isArray(authors) ? authors : JSON.parse(authors) }),
                ...(keywords && { keywords: typeof keywords === 'string' ? keywords.split(',').map(k => k.trim()) : keywords }),
                ...(isPublic !== undefined && { isPublic }),
                lastModified: new Date()
            }
        }
    );

    if (result.modifiedCount === 0) {
        throw new Error('Poster not found or no changes made');
    }

    return { message: 'Poster updated successfully' };
};
