#!/usr/bin/env python3

import os
import sys
import json
import gzip
import shutil
import requests
import psycopg2
from packaging.version import Version, InvalidVersion
import argparse

# PostgreSQL database connection details
DB_CONFIG = {
    "dbname": "cve_database",
    "user": "postgres",
    "password": "change_me",
    "host": "localhost",
    "port": 5432
}

BASE_DIR = "../data/CVEs"


# === CODE BLOCK 1: Download and Extract CVE Data ===
def download_and_extract_cve_data(start_year=2002, end_year=2024, base_url="https://nvd.nist.gov/feeds/json/cve/1.1/"):
    # List of additional links in .gz format
    extra_links = [
        {"name": "recent", "url": f"{base_url}nvdcve-1.1-recent.json.gz"},
        {"name": "modified", "url": f"{base_url}nvdcve-1.1-modified.json.gz"}
    ]

    # Process yearly CVE files
    for year in range(start_year, end_year + 1):
        url = f"{base_url}nvdcve-1.1-{year}.json.gz"
        folder_name = f"../data/CVEs/{str(year)}"
        file_name = f"nvdcve-1.1-{year}.json.gz"
        output_json = f"nvdcve-1.1-{year}.json"

        if not os.path.exists(folder_name):
            os.makedirs(folder_name)
        
        # Download the file
        print(f"Downloading {file_name}...")
        response = requests.get(url, stream=True)
        gz_path = os.path.join(folder_name, file_name)
        with open(gz_path, 'wb') as gz_file:
            gz_file.write(response.content)
        
        # Extract the .gz file
        print(f"Extracting {file_name}...")
        json_path = os.path.join(folder_name, output_json)
        with gzip.open(gz_path, 'rb') as f_in:
            with open(json_path, 'wb') as f_out:
                shutil.copyfileobj(f_in, f_out)
        
        print(f"Extracted {output_json} to folder {folder_name}.\n")

    # Process the extra links
    for link in extra_links:
        name = link["name"]
        url = link["url"]
        folder_name = "../data/CVEs/extra"
        file_name = f"nvdcve-1.1-{name}.json.gz"
        output_json = f"nvdcve-1.1-{name}.json"


        if not os.path.exists(folder_name):
            os.makedirs(folder_name)

        # Download and extract
        print(f"Downloading {file_name}...")
        response = requests.get(url, stream=True)
        gz_path = os.path.join(folder_name, file_name)
        with open(gz_path, 'wb') as gz_file:
            gz_file.write(response.content)

        print(f"Extracting {file_name}...")
        json_path = os.path.join(folder_name, output_json)
        with gzip.open(gz_path, 'rb') as f_in:
            with open(json_path, 'wb') as f_out:
                shutil.copyfileobj(f_in, f_out)

        print(f"Extracted {output_json} to folder {folder_name}.\n")

    print("Download and extraction completed.")


# === CODE BLOCK 2: Build and Populate Database ===
def build_database():
    """Create and populate the PostgreSQL database with CVE and CPE data."""
    conn = psycopg2.connect(**DB_CONFIG)
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS cpe (
        cpe_id TEXT PRIMARY KEY
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS cve (
        cpe_id TEXT,
        cve_id TEXT,
        cve_data JSONB,
        PRIMARY KEY (cpe_id, cve_id),
        FOREIGN KEY (cpe_id) REFERENCES cpe (cpe_id)
    )
    """)

    # The API filters with `cpe_id LIKE 'prefix%'`; the primary key cannot serve
    # that under a non-C collation, so add a pattern index
    cursor.execute("""
    CREATE INDEX IF NOT EXISTS cve_cpe_id_pattern_idx
        ON cve (cpe_id text_pattern_ops)
    """)
    conn.commit()

    def process_json(file_path):
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)

        cpe_cve_map = {}
        for item in data.get("CVE_Items", []):
            cve_id = item.get("cve", {}).get("CVE_data_meta", {}).get("ID", "Unknown")
            cve_full_data = json.dumps(item)
            configurations = item.get("configurations", {}).get("nodes", [])
            for node in configurations:
                for cpe in node.get("cpe_match", []):
                    cpe_uri = cpe.get("cpe23Uri")
                    if cpe_uri:
                        if cpe_uri not in cpe_cve_map:
                            cpe_cve_map[cpe_uri] = []
                        if cve_id not in [entry["cve_id"] for entry in cpe_cve_map[cpe_uri]]:
                            cpe_cve_map[cpe_uri].append({"cve_id": cve_id, "cve_data": cve_full_data})
        return cpe_cve_map

    def save_to_database(cpe_cve_map):
        for cpe, cves in cpe_cve_map.items():
            cursor.execute("INSERT INTO cpe (cpe_id) VALUES (%s) ON CONFLICT DO NOTHING", (cpe,))
            for cve_entry in cves:
                cursor.execute("""
                INSERT INTO cve (cpe_id, cve_id, cve_data)
                VALUES (%s, %s, %s)
                ON CONFLICT DO NOTHING
                """, (cpe, cve_entry["cve_id"], cve_entry["cve_data"]))
        conn.commit()

    for root, _, files in os.walk(BASE_DIR):
        for file in files:
            if file.endswith(".json"):
                file_path = os.path.join(root, file)
                print(f"Processing file: {file_path}")
                cpe_cve_map = process_json(file_path)
                save_to_database(cpe_cve_map)

    cursor.close()
    conn.close()
    print("Database created and populated successfully!")

# === CODE BLOCK 3: Update Database with Version Ranges ===
def update_database():
    """Update the database with version ranges."""
    conn = psycopg2.connect(**DB_CONFIG)
    cursor = conn.cursor()

    def parse_version(version_str):
        try:
            return Version(version_str)
        except InvalidVersion:
            return None
        
    def is_version_in_range(version, start_including=None, end_excluding=None):
        """Check if a version is within a given range."""
        version_obj = parse_version(version)
        if not version_obj:
            return False

        if start_including:
            start_version = parse_version(start_including)
            if start_version and version_obj < start_version:
                return False
        if end_excluding:
            end_version = parse_version(end_excluding)
            if end_version and version_obj >= end_version:
                return False
        return True

    def process_json_for_version_ranges(file_path):
        """Identify CVEs with version ranges and update the PostgreSQL database."""
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)

        for item in data.get("CVE_Items", []):
            cve_id = item.get("cve", {}).get("CVE_data_meta", {}).get("ID", "Unknown")
            full_cve_data = json.dumps(item)  # Store the full CVE object

            configurations = item.get("configurations", {}).get("nodes", [])
            for node in configurations:
                for cpe in node.get("cpe_match", []):
                    cpe_uri = cpe.get("cpe23Uri")
                    version_start = cpe.get("versionStartIncluding")
                    version_end = cpe.get("versionEndExcluding")

                    if cpe_uri and (version_start or version_end):
                        # Extract the base CPE name
                        base_cpe = ":".join(cpe_uri.split(":")[:5])

                        # Query the database for all matching CPEs
                        cursor.execute("SELECT cpe_id FROM cpe WHERE cpe_id LIKE %s", (f"{base_cpe}%",))
                        matching_cpes = cursor.fetchall()

                        for matching_cpe_row in matching_cpes:
                            matching_cpe = matching_cpe_row[0]
                            # Extract the version from the matching CPE
                            cpe_parts = matching_cpe.split(":")
                            if len(cpe_parts) > 5:  # Ensure version exists
                                version = cpe_parts[5]
                                if is_version_in_range(version, version_start, version_end):
                                    # Add the CVE to the database for this CPE
                                    cursor.execute("""
                                    INSERT INTO cve (cpe_id, cve_id, cve_data)
                                    VALUES (%s, %s, %s)
                                    ON CONFLICT (cpe_id, cve_id) DO NOTHING
                                    """, (matching_cpe, cve_id, full_cve_data))
        conn.commit()


    for root, _, files in os.walk(BASE_DIR):
        for file in files:
            if file.endswith(".json"):
                file_path = os.path.join(root, file)
                print(f"Processing file for version ranges: {file_path}")
                process_json_for_version_ranges(file_path)

    cursor.close()
    conn.close()
    print("Database updated successfully!")

# === MAIN FUNCTION ===
if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="CVE Data Processor")
    parser.add_argument("command", choices=["extract_cve_data", "build_database", "update_database"],
                        help="Command to run: extract_cve_data, build_database, or update_database")
    args = parser.parse_args()

    if args.command == "extract_cve_data":
        download_and_extract_cve_data()
    elif args.command == "build_database":
        build_database()
    elif args.command == "update_database":
        update_database()
