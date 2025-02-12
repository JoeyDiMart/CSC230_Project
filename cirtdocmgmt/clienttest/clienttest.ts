import * as fs from 'fs';
import axios from 'axios';
import FormData from 'form-data';

const BASE_URL = 'http://localhost:3000';
const COOKIE_FILE = 'cookies.txt';

// Function to save access token
const saveAccessToken = (token: string) => {
    fs.writeFileSync(COOKIE_FILE, token);
};

// Function to read access token
const getAccessToken = (): string => {
    return fs.existsSync(COOKIE_FILE) ? fs.readFileSync(COOKIE_FILE, 'utf8') : '';
};

// Function to Sign In a User
const signIn = async (email: string, password: string) => {
    try {
        const response = await axios.post(`${BASE_URL}/auth/signin`, {
            formFields: [
                { id: 'email', value: email },
                { id: 'password', value: password }
            ]
        });

        console.log('✅ Sign In Successful:', response.data);
        const accessToken = response.headers['st-access-token'];
        if (accessToken) {
            saveAccessToken(accessToken);
            console.log('✅ Access Token Saved');
        } else {
            console.error('❌ No access token received!');
        }
    } catch (error: any) {
        console.error('❌ Sign In Failed:', error.response?.data || error.message);
    }
};

// Function to Create a User
const createUser = async (email: string, first: string, last: string, role: string) => {
    try {
        const response = await axios.post(
            `${BASE_URL}/api/users`,
            { email, first, last, role },
            { headers: { Authorization: `Bearer ${getAccessToken()}` } }
        );
        console.log('✅ User Created:', response.data);
    } catch (error: any) {
        console.error('❌ User Creation Failed:', error.response?.data || error.message);
    }
};

// Function to Get All Users
const getUsers = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/api/users`, {
            headers: { Authorization: `Bearer ${getAccessToken()}` }
        });
        console.log('✅ Users Retrieved:', response.data);
    } catch (error: any) {
        console.error('❌ Failed to Get Users:', error.response?.data || error.message);
    }
};

// Function to Logout
const logout = async () => {
    try {
        await axios.post(`${BASE_URL}/auth/signout`, {}, {
            headers: { Authorization: `Bearer ${getAccessToken()}` }
        });
        console.log('✅ Logout Successful');
        fs.unlinkSync(COOKIE_FILE);
    } catch (error: any) {
        console.error('❌ Logout Failed:', error.response?.data || error.message);
    }
};

// Function to Upload a File
const uploadFile = async (filePath: string, fileType: string, keywords: string[]) => {
    try {
        const formData = new FormData();
        formData.append('file', fs.createReadStream(filePath));
        formData.append('filetype', fileType);
        formData.append("fileName","myfileName.pdf")
        formData.append('keywords', keywords.join(','));

        const response = await axios.post(`${BASE_URL}/api/upload`, formData, {
            headers: {
                Authorization: `Bearer ${getAccessToken()}`,
                ...formData.getHeaders(),
            }
        });

        console.log('✅ File Uploaded:', response.data);
        return response.data._id;
    } catch (error: any) {
        console.error('❌ File Upload Failed:', error.response?.data || error.message);
    }
};

// Function to Retrieve Uploaded Files
const getUploadedFiles = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/api/files`, {
            headers: { Authorization: `Bearer ${getAccessToken()}` }
        });

        console.log('✅ Uploaded Files:', response.data);
        return response.data;
    } catch (error: any) {
        console.error('❌ Failed to Get Uploaded Files:', error.response?.data || error.message);
    }
};

// Function to Download a File
const downloadFile = async (fileId: string, outputPath: string) => {
    try {
        const response = await axios.get(`${BASE_URL}/api/download/${fileId}`, {
            headers: { Authorization: `Bearer ${getAccessToken()}` },
            responseType: 'stream',
        });

        const writer = fs.createWriteStream(outputPath);
        response.data.pipe(writer);

        writer.on('finish', () => console.log(`✅ File Downloaded: ${outputPath}`));
        writer.on('error', (err) => console.error('❌ Download Failed:', err.message));
    } catch (error: any) {
        console.error('❌ Download Failed:', error.response?.data || error.message);
    }
};

// **Test Execution Flow**
const testClient = async () => {
    const testEmail = 'john.doe@example.com';
    const testPassword = 'SecurePass123';

    await signIn(testEmail, testPassword);
    await createUser(testEmail, 'John', 'Doe', 'admin');
    await getUsers();
    const testFileType = 'Poster';
    const testKeywords = ['summer', 'June', 'Crime'];

    const testFilePath = 'testfile.pdf';
    const uploadedFileId = await uploadFile(testFilePath, testFileType, testKeywords);

    if (uploadedFileId) {
        const files = await getUploadedFiles();
        if (files.length > 0) {
            await downloadFile(uploadedFileId, 'downloaded_testfile.pdf');
        }
    }
    await logout();
};

// Run the client tests
testClient();
