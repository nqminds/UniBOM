---
title: FAQ & Troubleshooting
---

Below are answers to some commonly asked questions and solutions to potential issues you may encounter while using the SBOM generation tool and its visualisation capabilities.

## Bad Request Error and Historical CPEs Fetching Error

If you encounter a "bad request" error or "Error: Error fetching historical CPEs" while using the `unibom -getHistory` or `unibom -getHistoricalCpes` commands, please ensure the following:

* The .env file containing your NIST API key is correctly placed in the SBOM-GAP directory.
* When using `unibom -getHistoricalCpes`, omit the surrounding quotation marks, i.e., use `unibom -getHistoricalCpes cpe:2.3:\a:\busybox:busybox:1.33.2`.



## Common causes for these errors include:

* An invalid NIST API key.
* A poor internet connection.
* The NIST API may apply temporary restrictions on your key if there's a high volume of requests for the same CPE in a short period. This is part of their measures to ensure fair access for all users. If you encounter such restrictions, consider spacing out your requests.


## Identifying Memory-Related CVE/CWEs

To determine which CVE/CWEs are related to memory protection issues and potentially addressable with CHERI, we utilise OpenAI's GPT 3.5 turbo model. All CWEs descriptions are classified into memory-related or not memory-related categories and stored in `sbom-gap/vulnerability-reports/cwe_classifications.csv`.

## Troubleshooting Steps

* Verify the validity of your NIST API key and ensure it's correctly placed within the `.env` file.
* Check your internet connection and retry the operation.
* Keep in mind that, like any service, the NIST API may occasionally experience high demand or other issues leading to temporary slowdowns or limitations. If your request doesn't go through, it might be worthwhile to wait a bit before attempting it again.

We hope these guidelines assist you in resolving any issues you encounter. Further improvements and enhancements to the tool are ongoing, and we welcome any feedback or additional questions you may have.
