/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable consistent-return */
/* eslint-disable no-console */
/* eslint-disable prefer-promise-reject-errors */
const dotenv = require('dotenv');
const { Pool } = require('pg');

dotenv.config();

const {
  DB_USER,
  DB_HOST,
  DB_NAME,
  DB_PASSWORD,
  DB_PORT,
  DB_STATEMENT_TIMEOUT_MS,
} = process.env;
// PostgreSQL database connection details
const pool = new Pool({
  user: DB_USER,
  host: DB_HOST,
  database: DB_NAME,
  password: DB_PASSWORD,
  port: DB_PORT,
  // Stop a runaway query (e.g. a missing index) from running for minutes
  statement_timeout: Number(DB_STATEMENT_TIMEOUT_MS) || 60000,
});

/**
 * Escape LIKE wildcards so CPE characters such as "_" are matched literally.
 *
 * @param {string} value - The raw CPE string.
 * @returns {string} The escaped string, safe to use as a LIKE prefix.
 */
function escapeLike(value) {
  return value.replace(/[\\%_]/g, '\\$&');
}

/**
 * Query CVE data by CPE.
 * @param {string} cpe - The CPE string to search for (e.g., cpe:2.3:a:solarwinds:serv-u:*:*:*:*:*:*:*:*).
 * @returns {Promise<{ matches: number, data: object[] }>} - A promise that resolves to the match count and matching CVEs.
 */
async function getCVEsByCPE(cpe) {
  try {
    const query = `
      SELECT cve_id, cve_data, COUNT(*) OVER () AS total_matches
      FROM cve
      WHERE cpe_id LIKE $1
    `;
    const values = [`${escapeLike(cpe)}%`];

    // Execute the query
    const { rows } = await pool.query(query, values);

    if (rows.length === 0) {
      return { matches: 0, data: [] };
    }

    // Total matches are the same for all rows due to `COUNT(*) OVER ()`
    const matches = rows[0].total_matches;

    return { matches, data: rows };
  } catch (err) {
    return Promise.reject(`Database query failed: ${err.message}`);
  }
}

/**
 * Extract vendor and product name from a full CPE string.
 *
 * @param {string} cpe - The full CPE string in the form: cpe:2.3:a:vendor:product:***.
 * @returns {string} The base CPE identifier (up to the product name).
 */
function extractBaseCPE(cpe) {
  const parts = cpe.split(':');
  return parts.slice(0, 5).join(':');
}

/**
 * Get all known versions of a CPE.
 *
 * @param {string} cpe - The input CPE string to match.
 * @returns {object} An object containing the matches and unique CPEs.
 */
async function getCPEVersions(cpe) {
  try {
    const baseCPE = extractBaseCPE(cpe);
    const query = `
      SELECT DISTINCT cpe_id
      FROM cve
      WHERE cpe_id LIKE $1
    `;
    const values = [`${escapeLike(baseCPE)}%`];

    // Execute the query
    const { rows } = await pool.query(query, values);

    if (rows.length === 0) {
      return { matches: 0, cpes: [] };
    }

    // Remove duplicates and return
    const uniqueCPEs = [...new Set(rows)];

    return { matches: uniqueCPEs.length, cpes: uniqueCPEs };
  } catch (err) {
    return Promise.reject(`Database query failed: ${err.message}`);
  }
}

module.exports = {
  getCVEsByCPE,
  getCPEVersions,
};
