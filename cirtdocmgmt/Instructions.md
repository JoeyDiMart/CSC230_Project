Check out the Code

# Run the Backend

Go to backend folder

Create an environment File with the following entries

URI for MongoDB if you want you create your own instance by going to https://www.mongodb.com/cloud/atlas/register

Similarly, you setup AWS Accesskey & Secret Key for the File storage and Supertokens for authentication. I am using the free tier where AWS undger 5 GB it is free and Supertokens under 5000 users it is free.

```
MONGODB_URI=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION="us-east-2"
AWS_S3_BUCKET="csc230cirtdev"
SUPERTOKENS_CONNECTION_URI=https://try.supertokens.com
SUPERTOKENS_API_KEY=
API_DOMAIN=http://localhost:3001
WEBSITE_DOMAIN=http://localhost:3000
```

Once the setup is complete. Run the following to install all the dependent node modules

```
npm install
```

After completion, go back to the parent folder and run

```
npm start
```
or 
```
npm run start:backend
```

If everything goes well you will see something like 

```
✅ Server running on port 3000
Connected to MongoDB
```

Now the server is ready for accepting the requests

# Run the client

Go to another Command/Terminal window

go to the clienttest folder

run the following command

```

npm install ts-node
npm install fs form-data axios
```

Now you run the client side functions to invoke the server API

```
npx ts-node client.ts

```



