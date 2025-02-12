import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import supertokens from 'supertokens-node';
import { middleware, errorHandler } from 'supertokens-node/framework/express';
import { SuperTokensConfig } from './config';  // ✅ Ensure correct import
import apiRouter from './api';  // ✅ Ensure API routes are imported

dotenv.config();

// ✅ Initialize SuperTokens with the Correct Config
supertokens.init(SuperTokensConfig);

const app = express();
app.use(express.json());

app.use((req, _res, next) => {
    console.log(`[REQUEST] ${req.method} ${req.url}`);
    console.log(`Headers:`, req.headers);
    console.log(`Body:`, req.body);
    next();
});
app.use(cors());

// SuperTokens Middleware
app.use(middleware());

// API Routes
app.use('/api', apiRouter);

// SuperTokens Error Handler (Always at the end)
app.use(errorHandler());

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

