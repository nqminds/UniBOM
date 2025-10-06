#!/usr/bin/env node
/* eslint-disable no-case-declarations */
/* eslint-disable no-console */
import path from 'node:path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';
import { getCpes } from './src/get-syft-cpes.mjs';
import {
  fetchCVEsWithRateLimit,
  fetchCVEsForCPE,
  writeCvesToFile,
} from './src/list-vulnerabilities.mjs';
import { fetchHistoricalCPEs } from './src/get-historical-cpes.mjs';
import { getCVEinfo } from './src/get-historical-cves.mjs';
import { getCweInfo } from './src/get-CWEs-info.mjs';
import { getVulnerabilities } from './src/get-grype-vulnerabilities.mjs';
import {
  generateVulnerabilityReport,
  generateImageVulnerabilityReport,
} from './src/generate_sbom.mjs';
import { generateConanFile } from './src/generate-conan-text-from-json.mjs';
import { generateDependencyList } from './src/generate-dep-list.mjs';
import { mapCPEs } from './src/get-cpes-from-dependecy.mjs';
import { generateDummySBOM } from './src/gen-bom-from-cpes.mjs';
import { getGHSAInfo, processVulnerabilities } from './src/get-git-ghsas.mjs';
import { classifyCwe } from './src/classify_cwe.mjs';
import { mapCpeCveCwe } from './src/show-cpe-history.mjs';
import { genGrypeReport, addCpeToSbom, getCpeVendor } from './src/utils.mjs';
import { generateBinwalkReport } from './src/binwalk-scan.mjs';
import { compareSBOMs, printComparisonResult } from './src/compare-sboms.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function main() {
  function displayHelp() {
    console.log(`

    Usage:
    unibom [argument] [filePath]
    unibom [argument] [text]
    unibom [argument] [filePath] [text]
    unibom [argument] [filePath] [filePath] [text] [filePath]
    unibom [argument] [text] [text]
    unibom [argument] [text] [argument]

    Arguments:
    -getCpes                Path to SBOM.json file
    -listCpeDetails         Path to SBOM.json file
    -getCves                CPE2.3 format e.g. "cpe:2.3:a:busybox:busybox:1.33.2"
    -writeCves              Path to SBOM.json file, absolute path to required output directory
    -getHistoricalCpes      CPE2.3 format e.g. "cpe:2.3:a:busybox:busybox:1.33.2"
    -getCveInfo             Supported CVE format: "CVE-2022-48174"
    -getCweInfo             CWE. If multiple CWEs, separate by commas without white space. e.g. 'CWE-476,CWE-681'
    -listVulnerabilities    Absolute path to grype vulnerability report file
    -generateSbom           Absolute path to project and a project name, optional --out absolute/path/to/output/dir
    -generateConan          Project Name. Please ensure the dependencies exist for /vulnerability-reports/ccsDependencies/<project_name>_dependencies
    -genDependencies        Absolute path to cppDierectory and projectName
    -mapCpes                Project Name. Please ensure that vulnerability-reports/conan-files/<project_name>/conanfile.txt exists
    -generateCSbom          Project Name, SBOM format (json or xml)
    -getGhsa                GHSA code. e.g GHSA-j8xg-fqg3-53r7
    -extractGhsas           Absolute path to grype vulnerability report file
    -classifyCwe            CWE Id, e.g. CWE-354
    -getHistory             CPE e.g. cpe:2.3:a:busybox:busybox:1.33.2
    -generateCCPPReport     Absolute path to project and a project name, optional --out absolute/path/to/output/dir
    -generateDockerSbom     Image name and a project name, e.g. nginx:latest nginx
    -addCpe                 Path to SBOM.json file and CPE 2.3 format, e.g. path/to/sbom.json "cpe:2.3:a:postgresql:postgresql:9.6.2:*:*:*:*:*:*:*"
    -binwalk                Current path(use "$(pwd)" for Linux) -binwalk_command file.bin
    -compare                Paths to sboms e.g. unibom -compare <absolute/path/to/sbom1> <absolute/path/to/sbom2>
    `);
  }

  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error('Please provide a valid flag.');
    process.exit(1);
  }

  try {
    switch (args[0]) {
      case '-help':
        displayHelp();
        break;
      case '-getCpes':
        if (args.length === 2) {
          const cpes = await getCpes(args[1]);
          console.log(cpes);
        } else if (args.length >= 3) {
          const cpes = await getCpes(args[1]);
          const outputDir = path.join(
            __dirname,
            'vulnerability-reports/cpe-lists',
          );
          const outputFile = path.join(outputDir, `${args[2]}.json`);
          console.log(`CPE list saved to ${outputDir}`);

          const jsonData = JSON.stringify(cpes, null, 2);

          await fs.promises.mkdir(outputDir, { recursive: true });
          await fs.promises.writeFile(outputFile, jsonData);
        } else {
          console.error('Please provide a valid path to SBOM.');
        }
        break;
      case '-listCpeDetails':
        if (args[1]) {
          console.log('Fetching cpe info from API ... ');
          const detailedCpes = await fetchCVEsWithRateLimit(args[1]);
          console.log(detailedCpes);
        } else {
          console.error('Please provide a valid path to SBOM.');
        }
        break;
      case '-getCves':
        if (args[1]) {
          console.log('Fetching CVEs from API for: ', args[1]);
          const cves = await fetchCVEsForCPE(args[1]);
          console.log(cves);
        } else {
          console.error('Please provide a valid CPE.');
        }
        break;
      case '-writeCves':
        if (args[2]) {
          console.log('Writing CVE data to cveData.json');
          await writeCvesToFile(args[1], args[2]);
          console.log('Writing file completed');
        } else {
          console.error(
            'Please provide a valid path to SBOM and output directory.',
          );
        }
        break;
      case '-getHistoricalCpes':
        if (args[1]) {
          console.log('Fetching historical CPEs from API');
          const histCPEs = await fetchHistoricalCPEs(args[1]);
          console.log(histCPEs);
        } else {
          console.error(
            "Please provide a valid CPE in format 2.3 e.g. 'cpe:2.3:a:busybox:busybox:1.33.2'",
          );
        }
        break;
      case '-getCveInfo':
        if (args[1]) {
          console.log('Fetching CVE Info from API');
          const histCVEs = await getCVEinfo(args[1]);
          console.log(histCVEs);
        } else {
          console.error('Please provide a valid CVE type. e.g. CVE-2022-48174');
        }
        break;
      case '-getCweInfo':
        if (args[1]) {
          const cwesArray = args[1].split(',');
          const cweInfo = getCweInfo(cwesArray);
          console.log(cweInfo);
        } else {
          console.error(
            "Please provide a valid list of CWEs separated by commas, without white space. e.g. 'CWE-476,CWE-681'",
          );
        }
        break;
      case '-listVulnerabilities':
        if (args[1]) {
          console.log('Creating vulnerability report');
          const report = await getVulnerabilities(args[1]);
          console.log(report);
        } else {
          console.error(
            'Please provide a valid absolute path to grype vulnerability report file.',
          );
        }
        break;
      case '-generateSbom':
        if (args[2]) {
          const outFlagIndex = args.indexOf('--out');
          const outputDir =
            outFlagIndex !== -1 && args[outFlagIndex + 1]
              ? args[outFlagIndex + 1]
              : null;
          await generateVulnerabilityReport(args[1], args[2], outputDir);
        } else {
          console.log(
            'Please ensure the path is correct and provide project name e.g: -generateSbom <project_path> <project_name>',
          );
        }
        break;
      case '-generateConan':
        if (args[1]) {
          try {
            console.log(
              `Writing conan file for ../vulnerability-reports/ccsDependencies/${args[1]}_dependencies to ../vulnerability-reports/conan-files/${args[1]}`,
            );
            await generateConanFile(args[1]);
            console.log('Writing completed');
          } catch (error) {
            console.error(
              `Please ensure the dependencies exist for ./vulnerability-reports/ccsDependencies/${args[1]}_dependencies \n ${error}`,
            );
          }
        }
        break;
      case '-genDependencies':
        if (args[2]) {
          try {
            console.log(`Trying to generate dependency list for ${args[2]}`);
            generateDependencyList(args[1], args[2]);
          } catch (error) {
            console.error(
              `Please ensure that all the paths are correct ${error}`,
            );
          }
        } else {
          console.log(
            'Please ensure that you added all the necessary paths and project_name',
          );
        }
        break;
      case '-mapCpes':
        if (args[1]) {
          let spinner;
          try {
            console.log('Trying to map CPEs, this may take a while...');
            const spinnerChars = ['|', '/', '-', '\\'];
            let spinnerIndex = 0;
            spinner = setInterval(() => {
              process.stdout.write(
                `\r${spinnerChars[spinnerIndex]}  Mapping...`,
              );
              spinnerIndex = (spinnerIndex + 1) % spinnerChars.length;
            }, 250);

            await mapCPEs(args[1]);

            clearInterval(spinner);
            process.stdout.write('\r');
            console.log(
              'Mapping completed. Please see the generated file in vulnerability-reports/cpes/cpeMapping.json',
            );
          } catch (error) {
            clearInterval(spinner);
            process.stdout.write('\r');
            console.error(`Error encountered processing the command: ${error}`);
          }
        } else {
          console.error(
            `Please ensure that vulnerability-reports/cpe_data.csv is available and vulnerability-reports/conan-files/${args[1]}/conanfile.txt exists`,
          );
        }
        break;
      case '-generateCSbom':
        if (args[2] === 'json' || args[2] === 'xml') {
          let spinner;
          try {
            console.log(
              `Trying to create SBOM for ${args[1]}, this may take a while...`,
            );
            const spinnerChars = ['|', '/', '-', '\\'];
            let spinnerIndex = 0;
            spinner = setInterval(() => {
              process.stdout.write(
                `\r${spinnerChars[spinnerIndex]}  Generating SBOM...`,
              );
              spinnerIndex = (spinnerIndex + 1) % spinnerChars.length;
            }, 250);

            await generateDummySBOM(args[1], args[2]);

            clearInterval(spinner);
            process.stdout.write('\r');
            console.log(
              `SBOM completed. Please see the generated file in vulnerability-reports/sboms/${args[1]}_sbom.${args[2]}`,
            );
          } catch (error) {
            console.error(`
                  Please ensure that /vulnerability-reports/conan-files/${args[1]}/conanfile.txt and /vulnerability-reports/cpe_data.csv exists before running the command
                  Error encountered processing the command: ${error}`);
          }
        } else {
          console.error(`
                Please provide a project name and a valid format. Only json and xml are permitted
                Please ensure that /vulnerability-reports/conan-files/${args[1]}/conanfile.txt and /vulnerability-reports/cpe_data.csv exists before running the command
                `);
        }
        break;
      case '-getGhsa':
        if (args[1] && args[1].startsWith('GHSA-')) {
          try {
            const data = await getGHSAInfo(args[1]);
            console.log(data);
          } catch (error) {
            console.error(`Error encountered processing the command: ${error}`);
          }
        } else {
          console.error(
            'Please enter a valid GHSA code. e.g GHSA-j8xg-fqg3-53r7',
          );
        }
        break;
      case '-extractGhsas':
        if (args[1]) {
          try {
            const ghsas = await processVulnerabilities(args[1]);
            console.log(ghsas);
          } catch (error) {
            console.error(`Error encountered processing the command: ${error}`);
          }
        } else {
          console.log(
            'Please provide a valid absolute path to grype vulnerability report file.',
          );
        }
        break;
      case '-classifyCwe':
        if (args[1]) {
          await classifyCwe(args[1])
            .then((type) => {
              if (type) {
                console.log(`CWE_ID ${args[1]} has type: ${type}`);
              } else {
                console.log(`CWE_ID ${args[1]} not found.`);
              }
            })
            .catch((error) => {
              console.error('Error reading the CSV:', error);
            });
        } else {
          console.log(
            'Please provide a valid CWE id, e.g. -classifyCwe <CWE-112>',
          );
        }
        break;
      case '-getHistory':
        if (args[1]) {
          console.log(args[1]);
          let spinner;
          const includeHistoricalCpes = args[2] !== 'false';
          try {
            console.log(
              `Trying to find related cpes for ${args[1]}, this may take a while...`,
            );
            const spinnerChars = ['|', '/', '-', '\\'];
            let spinnerIndex = 0;
            spinner = setInterval(() => {
              process.stdout.write(
                `\r${spinnerChars[spinnerIndex]} Processing...`,
              );
              spinnerIndex = (spinnerIndex + 1) % spinnerChars.length;
            }, 250);

            const cpeCveCweMap = await mapCpeCveCwe(
              args[1],
              includeHistoricalCpes,
            );
            clearInterval(spinner);
            process.stdout.write('\r');

            const maxCpeLength = cpeCveCweMap.reduce(
              (max, entry) => Math.max(max, entry.cpe.length),
              0,
            );
            const maxCveLength = cpeCveCweMap.reduce(
              (max, entry) => Math.max(max, entry.cve.length),
              0,
            );
            let previousCPE = '';
            const data = cpeCveCweMap
              .map((entry) => {
                const alignedCpe =
                  entry.cpe !== previousCPE
                    ? entry.cpe.padEnd(maxCpeLength)
                    : ' '.repeat(maxCpeLength);
                previousCPE = entry.cpe;
                const alignedCve = entry.cve.padEnd(maxCveLength);
                const cweClassifications = entry.cwe.map((cwe, index) => {
                  const alignedCwe = cwe.padEnd(20);
                  const weakType = entry.weakType[index] || 'No info';
                  return `${alignedCwe} - ${weakType}`;
                });
                const formattedCwe = cweClassifications.join(
                  `\n${' '.repeat(maxCpeLength + maxCveLength + 6)}`,
                );

                return `${alignedCpe} - ${alignedCve} - ${formattedCwe}`;
              })
              .join('\n');

            console.log(data);
            const fileName = await getCpeVendor(args[1]);
            const outputDir = path.join(
              __dirname,
              'vulnerability-reports/output',
            );
            const outputFile = path.join(outputDir, `${fileName}.txt`);

            await fs.promises.mkdir(outputDir, { recursive: true });
            await fs.promises.writeFile(outputFile, data);
            console.log(
              `Data saved to vulnerability-reports/output/${fileName}.txt`,
            );
          } catch (error) {
            console.error(
              `Error encountered processing the command: ${error.stack}`,
            );
          }
        } else {
          console.log(
            'Please provide a valid cpe e.g. cpe:/a:doxygen:doxygen:1.7.2',
          );
        }
        break;
      case '-generateCCPPReport':
        if (args[2]) {
          const outFlagIndex = args.indexOf('--out');
          const outputDir =
            outFlagIndex !== -1 && args[outFlagIndex + 1]
              ? args[outFlagIndex + 1]
              : null;
          const outputSbom = outputDir
            ? path.join(outputDir, `${args[2]}_sbom.json`)
            : null;
          try {
            console.log(
              `Starting full report generation for project ${args[1]}...`,
            );

            console.log(`Trying to generate dependency list for ${args[2]}`);
            generateDependencyList(args[1], args[2]);
            console.log('Dependency list completed completed.');

            // 1. Generate Conan File
            console.log(
              `Writing conan file for ../vulnerability-reports/ccsDependencies/${args[2]}_dependencies...`,
            );
            await generateConanFile(args[2]);
            console.log('Conan file generation completed.');

            // 2. Map CPEs
            console.log('Mapping CPEs, please wait...');
            await mapCPEs(args[2]);
            console.log(
              'CPE mapping completed. Check vulnerability-reports/cpes/cpeMapping.json for the mapping.',
            );

            // 3. Generate SBOM
            console.log(`Generating SBOM in ${args[2]} format...`);
            await generateDummySBOM(args[2], 'json', outputDir);
            console.log(
              `SBOM generation completed. Check ${outputDir}/${args[2]}_sbom.json for the SBOM.`,
            );

            console.log(
              `Full report generation for project ${args[2]} completed successfully.`,
            );

            const sbomPath =
              outputSbom ||
              path.join(
                __dirname,
                `vulnerability-reports/sboms/${args[2]}_sbom.json`,
              );
            console.log(
              `Generating Vulnerability report for ${args[2]}_sbom.json`,
            );
            await genGrypeReport(sbomPath, args[2], outputDir);
          } catch (error) {
            console.error(
              `Error encountered during full report generation for project ${args[2]}: ${error}`,
            );
          }
        } else {
          console.error(
            'Please provide an absolute path to the c/c++ repository and a project name as the second argument.',
          );
        }
        break;
      case '-generateDockerSbom':
        if (args[2]) {
          await generateImageVulnerabilityReport(args[1], args[2]);
        } else {
          console.log(
            'Please ensure the Docker image exists and provide project name e.g: -generateDockerSbom <image_name> <project_name>',
          );
        }
        break;
      case '-addCpe':
        if (args[2]) {
          await addCpeToSbom(args[1], args[2]);
        } else {
          console.log(
            'Please ensure the sbom file exists and is a valid CycloneDX json format',
          );
        }
        break;
      case '-binwalk':
        if (args.length === 4) {
          await generateBinwalkReport(args[1], args[2], args[3]);
        } else if (args.length === 3) {
          const binwalk_flag = '';
          await generateBinwalkReport(args[1], binwalk_flag, args[2]);
        } else {
          console.log(`
            Make sure you enter the command as:
            unibom -binwalk /path/to/current/directory "[-binwalk_command]" file.bin

            For Linux systems, you can use:
            unibom -binwalk "$(pwd)" "[-binwalk_command]" file.bin
            `);
        }
        break;
      case '-compare':
        let sbomPaths;
        let fileName;
        const bracketsPattern = /\[.*?\]/;
        const joinedArgs = args.slice(1).join(' ');
        const bracketMatch = joinedArgs.match(bracketsPattern);

        if (bracketMatch) {
          const pathsStr = bracketMatch[0].slice(1, -1).trim();
          sbomPaths = pathsStr.split(/\s+/);

          const remainingArgs = joinedArgs
            .split(bracketMatch[0])
            .map((arg) => arg.trim())
            .filter(Boolean);
          fileName = remainingArgs.length
            ? remainingArgs[0]
            : 'comparison-result';
        } else {
          sbomPaths = args.slice(1, args.length);
          fileName = 'comparison-result';
        }

        if (sbomPaths.length < 2) {
          console.log(`
          Invalid command usage. Please follow these examples:
          
          With custom filename:
          unibom -compare "[</absolute/path/to/sbom1> </absolute/path/to/sbom2> <additional SBOM paths...>]" custom-filename
          
          Without custom filename (uses default 'comparison-result.txt'):
          unibom -compare </absolute/path/to/sbom1> </absolute/path/to/sbom2> <additional SBOM paths...>
          `);
        } else {
          const comparisonResult = await compareSBOMs(sbomPaths);
          await printComparisonResult(comparisonResult, sbomPaths, fileName);
        }
        break;
      default:
        console.error(`Unknown flag: ${args[0]}`);
        break;
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

main()
  .then(() => {
    process.exit(0);
  }) // gracefully handle any potential errors
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
