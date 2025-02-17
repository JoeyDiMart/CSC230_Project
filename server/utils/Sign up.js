const bcrypt = require('bcryptjs');
const {client,connectToDatabase} = require("./Mongodb");


async function insertUserData(email,password) {
    try{

        await connectToDatabase();
        // connect to database
        const db =  client.db('CIRT');

        // access all the users in the collection
        const collection  = db.collection('USERS');

        // secure passowrd
        const hashedPassword = await bcrypt.hash(password, 10);

        // create the user object
        const user = {
            email: email,
            password: hashedPassword
        };

            // insert the user into the collection
        try {
            // wait until a user is inputted
            const result = await collection.insertOne(user);
            console.log("User Inserted with ID", result.insertedId);
        }
        catch(err) {
            console.log("Error inserting user data ", err);
        }


    } catch (error) {
        console.log("Error inserting user data: ", error);
    }
}

insertUserData("test@test.com", "testPassword");