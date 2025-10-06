# NIST Data API
The NIST Data API provides endpoints to retrieve information about CVEs (Common Vulnerabilities and Exposures) and CPEs (Common Platform Enumerations).

---


## ⚠️ Important Notice: NIST Data Format Change

> **Note (October 2025):**  
> The original pipeline for fetching and processing **CVE/CPE data** no longer works because the **NVD (NIST Vulnerability Database)** has permanently **retired its XML and legacy JSON 1.0 feeds** and migrated to the **JSON 2.0 REST API**.  
>  
> As a result, any steps in this repository that rely on downloading data from URLs such as  
> `https://nvd.nist.gov/feeds/json/...` or `https://nvd.nist.gov/feeds/xml/...`  
> will now fail or return **HTTP 403 Forbidden**.  
>  
> ✅ **Workaround:**  
> - Use the **CLI tool** to generate SBOMs.  
> - To explore CPE/CVE information or perform historical analysis, upload your SBOM to the following web app:  
>   🔗 [https://sbom.coreid.com/sbom-analysis](https://sbom.coreid.com/sbom-analysis)  
> - **Currently affected commands:**  
>   - `listCpeDetails`  
>   - `getCves`  
>   - `getCveInfo`  
>   - `getHistory`  
>  
> A future update will migrate this pipeline to use the new **NVD JSON 2.0 data format**.


## Features

* Fetch CVEs for a given CPE.
* Retrieve available CPE versions for a given CPE.
* Get detailed information about a specific CVE by ID.

---


## Prerequisites

* Node.js (v16 or higher)
* npm (Node Package Manager)
* Environment variables configured in a .env file.

---

## Installation

Clone the repository:

```bash
git clone git@github.com:nqminds/SBOM-GAP.git
cd packages/sbom-gap-cli/nist-data-api
```
Install dependencies:

```bash
npm install
```
Create a .env file in the project root and add postgreSQL details(a PG database can be created using these [instructions](../Sbom-GAP-Firmware-Prediction-Model/notebooks/README.md)):

```makefile
PORT=3000
DB_USER='postgres'
DB_HOST='localhost'
DB_NAME='cve_database'
DB_PASSWORD='password'
DB_PORT=5432
```

Start the server:

```bash
npm start
```
---

## API Endpoints
1. Fetch CVEs by CPE

* Endpoint: /api/cve
* Method: POST
* Request Body:

```json

{
  "cpe": "cpe:2.3:a:busybox:busybox:1.33.2"
}
```

Response:

200 OK:
```json
{
  "message": "CVE data fetched successfully",
  "matches": 42,
  "data": [ ... ]
}
```
---

2. Fetch CPE Versions

* Endpoint: /api/cpe-versions
* Method: POST
* Request Body:

```json
{
  "cpe": "cpe:2.3:a:busybox:busybox:1.33.2"
}
```
Response:

200 OK:
```json
{
  "message": "CPE versions fetched successfully",
  "matches": 3,
  "cpes": [ ... ]
}
```

---

3. Fetch CVE by ID

* Endpoint: /api/cve-id
* Method: POST
* Request Body:

```json
{
  "cveId": "CVE-2022-48174"
}
```

Response:

200 OK:
```json
{
  "message": "CVE CVE-2022-48174 fetched successfully",
  "data": { ... }
}
```

---

## Deployment (optional)
Install PM2 to manage the API:

```bash
npm install -g pm2
```

Start the API with PM2:

```bash
pm2 start index.js --name "nist-data-api"
```

Save PM2 configuration:

```bash
pm2 save
```

Configure your server to restart PM2 processes on reboot:

```bash
pm2 startup
```

---

## Testing the API

Use the following curl commands to test each endpoint:

* Fetch CVEs by CPE:

```bash
curl -X POST http://localhost:3000/api/cve \
-H "Content-Type: application/json" \
-d '{"cpe": "cpe:2.3:a:busybox:busybox:1.33.2"}'
```

* Fetch CPE Versions:

```bash
curl -X POST http://localhost:3000/api/cpe-versions \
-H "Content-Type: application/json" \
-d '{"cpe": "cpe:/a:microsoft:windows"}'
```

* Fetch CVE by ID:

```bash
curl -X POST http://localhost:3000/api/cve-id \
-H "Content-Type: application/json" \
-d '{"cveId": "CVE-2022-48174"}'
```