/* eslint-disable consistent-return */
/* eslint-disable prettier/prettier */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/extensions */
/* eslint-disable no-console */

const express = require('express');
const cors = require('cors');
const compression = require('compression');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const xssClean = require('xss-clean');
const { body, validationResult } = require('express-validator');
const { getCVEsByCPE, getCPEVersions } = require('./src/cpeServices');
const { getCVEById } = require('./src/cveServices');

dotenv.config();

const app = express();
const { PORT } = process.env;

// Middleware
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(helmet());
app.use(xssClean());


// Rate limiter
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60, // Limit each IP to 60 requests per window (1 minute)
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again later.',
});

app.use('/api', limiter);

// Routes
app.post(
  '/api/cve',
  [
    body('cpe')
      .isString()
      .withMessage('CPE must be a string')
      .notEmpty()
      .withMessage('CPE is required')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { cpe } = req.body;

    try {
      const result = await getCVEsByCPE(cpe);
      return res.status(200).json({
        message: 'CVE data fetched successfully',
        matches: result.matches,
        data: result.data,
      });
    } catch (err) {
      console.error('Error fetching CVEs:', err);
      return res.status(500).json({ error: 'Failed to fetch CVE data' });
    }
  }
);

app.post(
  '/api/cpe-versions',
  [
    body('cpe')
      .isString()
      .withMessage('CPE must be a string')
      .notEmpty()
      .withMessage('CPE is required')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { cpe } = req.body;

    try {
      const result = await getCPEVersions(cpe);
      return res.status(200).json({
        message: 'CPE versions fetched successfully',
        matches: result.matches,
        cpes: result.cpes,
      });
    } catch (err) {
      console.error('Error fetching CPE versions:', err);
      return res.status(500).json({ error: 'Failed to fetch CPE versions' });
    }
  }
);

app.post(
  '/api/cve-id',
  [
    body('cveId')
      .isString()
      .trim()
      .notEmpty()
      .withMessage('CVE ID is required')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { cveId } = req.body;

    try {
      const cveData = await getCVEById(cveId);

      if (!cveData) {
        return res.status(404).json({ error: `CVE ${cveId} not found` });
      }

      return res.status(200).json({
        message: `CVE ${cveId} fetched successfully`,
        data: cveData,
      });
    } catch (err) {
      console.error('Error fetching CVE by ID:', err);
      return res.status(500).json({ error: 'Failed to fetch CVE data' });
    }
  }
);

// Global error handler
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    console.error('Invalid JSON:', err.message);
    return res.status(400).json({ error: 'Invalid JSON payload' });
  }
  next(err);
});

// Export the app for testing
module.exports = app;

// Start the server (only if not in a testing environment)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`API server running at http://localhost:${PORT}`);
  });
}
