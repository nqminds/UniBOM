---
title: CLI Tool Usage
---

# Commands and Options:

Available commands:

```sh
unibom -help


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
    -generateSbom           Absolute path to project and a project name
    -generateConan          Project Name. Please ensure the dependencies exist for /vulnerability-reports/ccsDependencies/<project_name>_dependencies
    -genDependencies        Absolute path to cppDierectory and projectName
    -mapCpes                Project Name. Please ensure that vulnerability-reports/conan-files/<project_name>/conanfile.txt exists
    -generateCSbom          Project Name, SBOM format (json or xml)
    -getGhsa                GHSA code. e.g GHSA-j8xg-fqg3-53r7
    -extractGhsas           Absolute path to grype vulnerability report file
    -classifyCwe            CWE Id, e.g. CWE-354
    -getHistory             CPE e.g. cpe:2.3:a:busybox:busybox:1.33.2
    -generateCCPPReport     Absolute path to project and a project name
```

### generateSbom
To generate a Software Bill Of Materials (SBOM) for the ecosystems bellow use the command `unibom -generateSbom <project_path> <project_name>` (Uses [syft](https://github.com/anchore/syft) and [grype](https://github.com/anchore/grype)):

Alpine (apk)
C (conan)
C++ (conan)
Dart (pubs)
Debian (dpkg)
Dotnet (deps.json)
Objective-C (cocoapods)
Elixir (mix)
Erlang (rebar3)
Go (go.mod, Go binaries)
Haskell (cabal, stack)
Java (jar, ear, war, par, sar, nar, native-image)
JavaScript (npm, yarn)
Jenkins Plugins (jpi, hpi)
Linux kernel archives (vmlinz)
Linux kernel modules (ko)
Nix (outputs in /nix/store)
PHP (composer)
Python (wheel, egg, poetry, requirements.txt)
Red Hat (rpm)
Ruby (gem)
Rust (cargo.lock)
Swift (cocoapods, swift-package-manager)

```sh 
unibom -generateSbom Repositories/cyber cyber_sbom
Running syft to generate SBOM...
SBOM generation completed. SBOM saved to /vulnerability-reports/sboms/cyber_sbom.json
Running grype to generate vulnerability report...
NAME              INSTALLED  FIXED-IN  TYPE   VULNERABILITY        SEVERITY 
@babel/traverse   7.14.2     7.23.2    npm    GHSA-67hx-6x53-jw92  Critical  
ansi-regex        3.0.0      3.0.1     npm    GHSA-93q8-gq69-wqmw  High      
ansi-regex        5.0.0      5.0.1     npm    GHSA-93q8-gq69-wqmw  High      
es5-ext           0.10.62    0.10.63   npm    GHSA-4gmj-3p3h-gm8h  Low       
express           4.18.2     4.19.2    npm    GHSA-rv95-896h-c2vc  Medium    
file-type         14.7.1     16.5.4    npm    GHSA-mhxj-85r3-2x55  High      
follow-redirects  1.15.3     1.15.4    npm    GHSA-jchw-25xp-jwwc  Medium    
follow-redirects  1.15.3     1.15.6    npm    GHSA-cxjh-pqwp-8mfp  Medium    
get-func-name     2.0.0      2.0.1     npm    GHSA-4q6p-r6v2-jvc5  High      
ip                2.0.0      2.0.1     npm    GHSA-78xj-cgh5-2h22  Medium    
json5             1.0.1      1.0.2     npm    GHSA-9c47-m6qq-7p4h  High      
json5             2.2.0      2.2.2     npm    GHSA-9c47-m6qq-7p4h  High      
minimatch         3.0.4      3.0.5     npm    GHSA-f8q6-p94x-37v3  High      
minimist          1.2.5      1.2.6     npm    GHSA-xvch-5gv4-984h  Critical  
nanoid            3.1.20     3.1.31    npm    GHSA-qrpm-p2h7-hrv2  Medium    
openssl           3                    conan  CVE-2023-5363        High      
openssl           3                    conan  CVE-2023-0401        High      
openssl           3                    conan  CVE-2023-0217        High      
openssl           3                    conan  CVE-2023-0216        High      
openssl           3                    conan  CVE-2022-3996        High      
openssl           3                    conan  CVE-2022-3786        High      
openssl           3                    conan  CVE-2022-3602        High      
openssl           3                    conan  CVE-2022-3358        High      
openssl           3                    conan  CVE-2022-1473        High      
openssl           3                    conan  CVE-2021-4044        High      
openssl           3                    conan  CVE-2023-6129        Medium    
openssl           3                    conan  CVE-2023-3446        Medium    
openssl           3                    conan  CVE-2023-2975        Medium    
openssl           3                    conan  CVE-2023-1255        Medium    
openssl           3                    conan  CVE-2022-4203        Medium    
openssl           3                    conan  CVE-2022-1434        Medium    
openssl           3                    conan  CVE-2022-1343        Medium    
path-parse        1.0.6      1.0.7     npm    GHSA-hj48-42vr-x3v9  Medium    
semver            5.7.1      5.7.2     npm    GHSA-c2qf-rxjj-qqgw  Medium    
semver            6.3.0      6.3.1     npm    GHSA-c2qf-rxjj-qqgw  Medium    
semver            7.0.0      7.5.2     npm    GHSA-c2qf-rxjj-qqgw  Medium    
semver            7.3.2      7.5.2     npm    GHSA-c2qf-rxjj-qqgw  Medium    
semver            7.3.5      7.5.2     npm    GHSA-c2qf-rxjj-qqgw  Medium    
terser            5.7.0      5.14.2    npm    GHSA-4wf5-vphf-c2xc  High      
trim              0.0.1      0.0.3     npm    GHSA-w5p7-h5w8-2hfq  High      
trim-newlines     3.0.0      3.0.1     npm    GHSA-7p7h-4mm5-852v  High      
word-wrap         1.2.3      1.2.4     npm    GHSA-j8xg-fqg3-53r7  Medium

Vulnerability report saved to: /vulnerability-reports/reports/vulnerability_report_cyber_sbom
```
### generateCCPPReport
Use the  `-generateCCPPReport` to generate a Software Bill Of Materials (SBOM) for other C/C++ ecosystems (Uses [ccscanner](https://github.com/lkpsg/ccscanner) and [grype](https://github.com/anchore/grype)).
Package Managers:
Deb
Conan
Vcpkg
Clib
CPM
Buckaroo
Dds
Hunter
Cppget
Xrepo
Gitsubmodule
Pkg-config

```sh
unibom -generateCCPPReport <path_to_c/cpp_project> <project_name>
```

```sh
unibom  -generateCCPPReport absolute/path/to/qtbase qtbase_report
Starting full report generation for project /qtbase...
Trying to generate dependency list for qtbase_report
dependency scanning completed.
dependency list saved to /sbom-cli/vulnerability-reports/ccsDependencies/qtbase_report_dependencies
Dependency list completed completed.
Writing conan file for ../vulnerability-reports/ccsDependencies/qtbase_report_dependencies...
Conan file generation completed.
Mapping CPEs, please wait...
CPE mapping completed. Check vulnerability-reports/cpes/cpeMapping.json for the mapping.
Generating SBOM in qtbase_report format...
SBOM generation completed. Check vulnerability-reports/sboms/qtbase_report_sbom.json for the SBOM.
Full report generation for project qtbase_report completed successfully.
/sbom-cli/vulnerability-reports/sboms/qtbase_report_sbom.json
Generating Vulnerability report for qtbase_report_sbom.json
Running grype to generate vulnerability report...
NAME         INSTALLED     FIXED-IN  TYPE            VULNERABILITY   SEVERITY 
addressbook  6.x-3.4                 UnknownPackage  CVE-2012-2307   Medium    
calendar     12.2.11.3000            UnknownPackage  CVE-2023-30678  Medium    
calendar     12.2.11.3000            UnknownPackage  CVE-2022-39915  Medium    
calendar     12.2.11.3000            UnknownPackage  CVE-2023-21464  Low       
calendar     12.2.11.3000            UnknownPackage  CVE-2022-33705  Low       
chat         2021-04-09              UnknownPackage  CVE-2021-30480  High      
db2          11.5.9                  UnknownPackage  CVE-2023-47701  High      
db2          11.5.9                  UnknownPackage  CVE-2023-40687  High      
db2          11.5.9                  UnknownPackage  CVE-2023-38727  High      
db2          11.5.9                  UnknownPackage  CVE-2023-29258  High      
db2          11.5.9                  UnknownPackage  CVE-2012-3324   High      
db2          11.5.9                  UnknownPackage  CVE-2023-47747  Medium    
db2          11.5.9                  UnknownPackage  CVE-2023-47746  Medium    
db2          11.5.9                  UnknownPackage  CVE-2023-47158  Medium    
db2          11.5.9                  UnknownPackage  CVE-2023-27859  Medium    
directfb     1.4.13                  UnknownPackage  CVE-2014-2977   High      
glib:2.0     2.0.7                   UnknownPackage  CVE-2023-32643  High      
glib:2.0     2.0.7                   UnknownPackage  CVE-2023-32636  High      
glib:2.0     2.0.7                   UnknownPackage  CVE-2023-29499  High      
glib:2.0     2.0.7                   UnknownPackage  CVE-2021-27219  High      
glib:2.0     2.0.7                   UnknownPackage  CVE-2021-27218  High      
glib:2.0     2.0.7                   UnknownPackage  CVE-2020-35457  High      
glib:2.0     2.0.7                   UnknownPackage  CVE-2019-13012  High      
glib:2.0     2.0.7                   UnknownPackage  CVE-2023-32665  Medium    
glib:2.0     2.0.7                   UnknownPackage  CVE-2023-32611  Medium    
glib:2.0     2.0.7                   UnknownPackage  CVE-2021-3800   Medium    
glib:2.0     2.0.7                   UnknownPackage  CVE-2021-28153  Medium    
glib:2.0     2.0.7                   UnknownPackage  CVE-2012-0039   Medium    
glib:2.0     2.0.7                   UnknownPackage  CVE-2008-4316   Medium    
gui          7.70                    UnknownPackage  CVE-2015-2282   High      
gui          7.70                    UnknownPackage  CVE-2022-41205  Medium    
gui          7.70                    UnknownPackage  CVE-2015-2278   Medium    
harfbuzz     6.0.0                   UnknownPackage  CVE-2023-25193  High      
jpeg         2022-06-15              UnknownPackage  CVE-2022-37768  High      
jpeg         2022-06-15              UnknownPackage  CVE-2022-37770  Medium    
jpeg         2022-06-15              UnknownPackage  CVE-2022-37769  Medium    
jpeg         2022-06-15              UnknownPackage  CVE-2022-35166  Medium    
jpeg         2022-06-15              UnknownPackage  CVE-2021-39520  Medium    
jpeg         2022-06-15              UnknownPackage  CVE-2021-39519  Medium    
jpeg         2022-06-15              UnknownPackage  CVE-2021-39518  Medium    
jpeg         2022-06-15              UnknownPackage  CVE-2021-39517  Medium    
jpeg         2022-06-15              UnknownPackage  CVE-2021-39516  Medium    
jpeg         2022-06-15              UnknownPackage  CVE-2021-39515  Medium    
jpeg         2022-06-15              UnknownPackage  CVE-2021-39514  Medium    
libinput     1.20.0                  UnknownPackage  CVE-2022-1215   High      
libproxy     0.4.15                  UnknownPackage  CVE-2020-26154  Critical  
libproxy     0.4.15                  UnknownPackage  CVE-2020-25219  High      
mysql        8.1.0                   UnknownPackage  CVE-2024-20985  Medium    
mysql        8.1.0                   UnknownPackage  CVE-2024-20984  Medium    
mysql        8.1.0                   UnknownPackage  CVE-2024-20982  Medium    
mysql        8.1.0                   UnknownPackage  CVE-2024-20981  Medium    
mysql        8.1.0                   UnknownPackage  CVE-2024-20977  Medium    
mysql        8.1.0                   UnknownPackage  CVE-2024-20975  Medium    
mysql        8.1.0                   UnknownPackage  CVE-2024-20973  Medium    
mysql        8.1.0                   UnknownPackage  CVE-2024-20971  Medium    
mysql        8.1.0                   UnknownPackage  CVE-2024-20970  Medium    
mysql        8.1.0                   UnknownPackage  CVE-2024-20969  Medium    
mysql        8.1.0                   UnknownPackage  CVE-2024-20968  Medium    
mysql        8.1.0                   UnknownPackage  CVE-2024-20967  Medium    
mysql        8.1.0                   UnknownPackage  CVE-2024-20966  Medium    
mysql        8.1.0                   UnknownPackage  CVE-2024-20965  Medium    
mysql        8.1.0                   UnknownPackage  CVE-2024-20964  Medium    
mysql        8.1.0                   UnknownPackage  CVE-2024-20963  Medium    
mysql        8.1.0                   UnknownPackage  CVE-2024-20962  Medium    
mysql        8.1.0                   UnknownPackage  CVE-2024-20961  Medium    
mysql        8.1.0                   UnknownPackage  CVE-2024-20960  Medium    
mysql        8.1.0                   UnknownPackage  CVE-2023-22114  Medium    
mysql        8.1.0                   UnknownPackage  CVE-2023-22103  Medium    
mysql        8.1.0                   UnknownPackage  CVE-2023-22097  Medium    
mysql        8.1.0                   UnknownPackage  CVE-2023-22095  Medium    
mysql        8.1.0                   UnknownPackage  CVE-2023-22084  Medium    
mysql        8.1.0                   UnknownPackage  CVE-2023-22078  Medium    
mysql        8.1.0                   UnknownPackage  CVE-2023-22070  Medium    
mysql        8.1.0                   UnknownPackage  CVE-2023-22068  Medium    
mysql        8.1.0                   UnknownPackage  CVE-2023-22066  Medium    
mysql        8.1.0                   UnknownPackage  CVE-2023-22059  Medium    
mysql        8.1.0                   UnknownPackage  CVE-2023-22032  Medium    
odbc         18.0                    UnknownPackage  CVE-2023-28304  High      
odbc         18.0                    UnknownPackage  CVE-2023-23375  High      
openssl      3.2.0                   UnknownPackage  CVE-2024-0727   Medium    
openssl      3.2.0                   UnknownPackage  CVE-2023-6129   Medium    
oracle       121030                  UnknownPackage  CVE-2015-0489   Low       
pcre2        10.40                   UnknownPackage  CVE-2022-41409  High      
project      2016                    UnknownPackage  CVE-2020-0760   High      
project      2016                    UnknownPackage  CVE-2019-1264   High      
project      2016                    UnknownPackage  CVE-2018-8575   High      
project      2016                    UnknownPackage  CVE-2015-2503   High      
project      2016                    UnknownPackage  CVE-2020-1322   Medium    
textedit     -                       UnknownPackage  CVE-2005-4504   High      
tools        12.3.5                  UnknownPackage  CVE-2014-4200   Medium    
tools        12.3.5                  UnknownPackage  CVE-2014-4199   Medium    
widgets      4.0.5                   UnknownPackage  CVE-2007-4034   High      
x11          6.9                     UnknownPackage  CVE-2013-7439   High

Vulnerability report saved to: /sbom-cli/vulnerability-reports/reports/vulnerability_report_qtbase_report

```



### getCpes

The `-getCpes` flag will parse an SBOM and return a list of CPEs in the `2.3` format.


```sh
unibom -getCpes /sbom-cli/vulnerability-reports/sboms/cyber_sbom.json
[
  'cpe:2.3:a:@aashutoshrathi/word-wrap:@aashutoshrathi/word-wrap:1.2.6:*:*:*:*:*:*:*',
  'cpe:2.3:a:@ampproject/remapping:@ampproject/remapping:2.2.1:*:*:*:*:*:*:*',
  'cpe:2.3:a:@apidevtools/json-schema-ref-parser:@apidevtools/json-schema-ref-parser:9.0.9:*:*:*:*:*:*:*',
  'cpe:2.3:a:@babel/code-frame:@babel/code-frame:7.12.11:*:*:*:*:*:*:*',
  'cpe:2.3:a:@babel/code-frame:@babel/code-frame:7.12.13:*:*:*:*:*:*:*',
  'cpe:2.3:a:@babel/code-frame:@babel/code-frame:7.23.4:*:*:*:*:*:*:*',
  'cpe:2.3:a:@babel/compat-data:@babel/compat-data:7.14.0:*:*:*:*:*:*:*',
  'cpe:2.3:a:@babel/compat-data:@babel/compat-data:7.23.3:*:*:*:*:*:*:*',
  'cpe:2.3:a:@babel/core:@babel/core:7.14.3:*:*:*:*:*:*:*',
  'cpe:2.3:a:@babel/core:@babel/core:7.23.3:*:*:*:*:*:*:*',
]
```
To save the cpe to a file use:

```sh
unibom -getCpes <absolute_path_to_sbom.json> <filename>
```

### listCpeDetails

The `-listCpeDetails` flag will parse an SBOM and return detailed information about each CPE, such as CVEs and CWEs

```sh
unibom -listCpeDetails /sbom-cli/vulnerability-reports/sbom.json 
Fetching cpe info from API ... 
{
  'cpe:2.3:a:busybox:busybox:1.33.2': [
    {
      id: 'CVE-2021-42376',
      description: "A NULL pointer dereference in Busybox's hush applet leads to denial of service when processing a crafted shell command, due to missing validation after a \\x03 delimiter character. This may be used for DoS under very rare conditions of filtered command input.",
      weakness: [Array],
      baseScore: 5.5,
      baseSeverity: 'MEDIUM'
    }, ...],
 'cpe:2.3:a:thekelleys:dnsmasq:2.85': [
    {
      id: 'CVE-2022-0934',
      description: 'A single-byte, non-arbitrary write/use-after-free flaw was found in dnsmasq. This flaw allows an attacker who sends a crafted packet processed by dnsmasq, potentially causing a denial of service.',
      weakness: [Array],
      baseScore: 7.5,
      baseSeverity: 'HIGH'
    }, ...],
    
    ...
}

```
### getCves

If the `-getCves` flag is set, all CVEs that are available for a CPE will be retrieved along with any related CWEs.

```sh
unibom -getCves cpe:2.3:a:busybox:busybox:1.33.2 
Fetching CVEs from API for:  cpe:2.3:a:busybox:busybox:1.33.2
[
  {
    id: 'CVE-2021-42376',
    description: "A NULL pointer dereference in Busybox's hush applet leads to denial of service when processing a crafted shell command, due to missing validation after a \\x03 delimiter character. This may be used for DoS under very rare conditions of filtered command input.",
    weakness: [ 'CWE-476', 'CWE-476' ],
    baseScore: 5.5,
    baseSeverity: 'MEDIUM'
  },
  {
    id: 'CVE-2022-28391',
    description: "BusyBox through 1.35.0 allows remote attackers to execute arbitrary code if netstat is used to print a DNS PTR record's value to a VT compatible terminal. Alternatively, the attacker could choose to change the terminal's colors.",
    weakness: [ 'NVD-CWE-noinfo' ],
    baseScore: 8.8,
    baseSeverity: 'HIGH'
  },
  {
    id: 'CVE-2022-48174',
    description: 'There is a stack overflow vulnerability in ash.c:6030 in busybox before 1.35. In the environment of Internet of Vehicles, this vulnerability can be executed from command to arbitrary code execution.',
    weakness: [ 'CWE-787' ],
    baseScore: 9.8,
    baseSeverity: 'CRITICAL'
  },
  ...
]

```
### writeCVEs

The `-writeCVEs` flag will write all the CVE data of an sbom into a json format to `output_directory/cveData.json`

```sh
unibom -writeCves /vulnerability-reports/sbom.json /Desktop 
Writing CVE data to cveData.json
Writing file completed


cat Desktop/cveData.json 
{
  "cpe:2.3:a:busybox:busybox:1.33.2": [
    {
      "id": "CVE-2021-42376",
      "description": "A NULL pointer dereference in Busybox's hush applet leads to denial of service when processing a crafted shell command, due to missing validation after a \\x03 delimiter character. This may be used for DoS under very rare conditions of filtered command input.",
      "weakness": [
        "CWE-476",
        "CWE-476"
      ],
      "baseScore": 5.5,
      "baseSeverity": "MEDIUM"
    },
    {
      "id": "CVE-2022-28391",
      "description": "BusyBox through 1.35.0 allows remote attackers to execute arbitrary code if netstat is used to print a DNS PTR record's value to a VT compatible terminal. Alternatively, the attacker could choose to change the terminal's colors.",
      "weakness": [
        "NVD-CWE-noinfo"
      ],
      "baseScore": 8.8,
      "baseSeverity": "HIGH"
    },
    {
      "id": "CVE-2022-48174",
      "description": "There is a stack overflow vulnerability in ash.c:6030 in busybox before 1.35. In the environment of Internet of Vehicles, this vulnerability can be executed from command to arbitrary code execution.",
      "weakness": [
        "CWE-787"
      ],
      "baseScore": 9.8,
      "baseSeverity": "CRITICAL"
    }, ...
}
```
### getHistoricalCpes

The `-getHistoricalCpes` flag will return all known versions of the input CPE. The CPE must be in `CPE2.3` format e.g. `cpe:2.3:\a:\busybox:busybox:1.33.2`


```sh
unibom -getHistoricalCpes cpe:2.3:\a:\busybox:busybox:1.33.2 
Fetching historical CPEs from API
[
  {
    cpeName: 'cpe:2.3:a:busybox:busybox:1.1.1:*:*:*:*:*:*:*',
    title: 'BusyBox 1.1.1',
    lastModified: '2012-07-25T15:25:49.167',
    created: '2007-08-23T21:16:59.567',
    deprecated: false
  },
  {
    cpeName: 'cpe:2.3:a:busybox:busybox:1.20.2:*:*:*:*:*:*:*',
    title: 'BusyBox 1.20.2',
    lastModified: '2012-07-25T15:25:52.650',
    created: '2012-07-03T17:11:16.413',
    deprecated: false
  },
  {
    cpeName: 'cpe:2.3:a:busybox:busybox:1.20.1:*:*:*:*:*:*:*',
    title: 'BusyBox 1.20.1',
    lastModified: '2012-07-25T15:25:52.587',
    created: '2012-07-03T17:11:16.507',
    deprecated: false
  },
  {
    cpeName: 'cpe:2.3:a:busybox:busybox:1.20.0:*:*:*:*:*:*:*',
    title: 'BusyBox 1.20.0',
    lastModified: '2012-07-25T15:25:52.540',
    created: '2012-07-03T17:11:16.600',
    deprecated: false
  },
  {
    cpeName: 'cpe:2.3:a:busybox:busybox:1.19.4:*:*:*:*:*:*:*',
    title: 'BusyBox 1.19.4',
    lastModified: '2012-07-25T15:25:52.227',
    created: '2012-07-03T17:11:16.710',
    deprecated: false
  }, ... 63 more items
```
### -getCveInfo

The `--getCveInfo` flag will return all known versions of the input CVE. Supported CVE format: `CVE-2022-48174`

```sh
 unibom -getCveInfo CVE-2022-48174
Fetching CVE Info from API
[
  {
    cve: 'CVE-2022-48174',
    description: 'There is a stack overflow vulnerability in ash.c:6030 in busybox before 1.35. In the environment of Internet of Vehicles, this vulnerability can be executed from command to arbitrary code execution.',
    baseScore: 9.8,
    impactScore: 5.9,
    exploitabilityScore: 3.9,
    publishedDate: '2023-08-22T19:16Z',
    lastModifiedDate: '2024-11-29T12:15Z',
    cveDataVersion: '4.0'
  }
]

```
### getCweInfo

The`-getCweInfo` flag will return information such as description for each CWE. Can take one or more CWEs. If multiple CWEs are passed, they must be writen without any space e.g. `CWE-476,CWE-681`

```sh
 unibom -getCweInfo CWE-476,CWE-681
[
  {
    'CWE-ID': '476',
    Name: 'NULL Pointer Dereference',
    Description: `A NULL pointer dereference occurs when the application dereferences a pointer that it expects to be valid, but is NULL, typically causing a crash or exit.NULL pointer dereferences are frequently resultant from rarely encountered error conditions, since these are most likely to escape detection during the testing phases.used for access of nil in Go programsThis weakness can be detected using dynamic tools and techniques that interact with the software using large test suites with many diverse inputs, such as fuzz testing (fuzzing), robustness testing, and fault injection. The software's operation may slow down, but it should not become unstable, crash, or generate incorrect results.Identify error conditions that are not likely to occur during normal usage and trigger them. For example, run the program under low memory conditions, run with insufficient privileges or permissions, interrupt a transaction before it is completed, or disable connectivity to basic network services such as DNS. Monitor the software for any unexpected behavior. If you trigger an unhandled exception or similar error that was discovered and handled by the application's environment, it may still indicate unexpected conditions that were not handled by the application itself.Automated static analysis, commonly referred to as Static Application Security Testing (SAST), can find some instances of this weakness by analyzing source code (or binary/compiled code) without having to execute it. Typically, this is done by building a model of data flow and control flow, then searching for potentially-vulnerable patterns that connect "sources" (origins of input) with "sinks" (destinations where the data interacts with external components, a lower layer such as the OS, etc.)If all pointers that could have been modified are sanity-checked previous to use, nearly all NULL pointer dereferences can be prevented.The choice could be made to use a language that is not susceptible to these issues.Check the results of all functions that return a value and verify that the value is non-null before acting upon it.Identify all variables and data stores that receive information from external sources, and apply input validation to make sure that they are only initialized to expected values.Explicitly initialize all your variables and other data stores, either during declaration or just before the first usage.Use automated static analysis tools that target this type of weakness. Many modern techniques use data flow analysis to minimize the number of false positives. This is not a perfect solution, since 100% accuracy and coverage are not feasible.race condition causes a table to be corrupted if a timer activates while it is being modified, leading to resultant NULL dereference; also involves locking.large number of packets leads to NULL dereferencepacket with invalid error status value triggers NULL dereferenceChain: race condition for an argument value, possibly resulting in NULL dereferencessh component for Go allows clients to cause a denial of service (nil pointer dereference) against SSH servers.Chain: Use of an unimplemented network socket operation pointing to an uninitialized handler function (CWE-456) causes a crash because of a null pointer dereference (CWE-476).Chain: race condition (CWE-362) might allow resource to be released before operating on it, leading to NULL dereference (CWE-476)Chain: some unprivileged ioctls do not verify that a structure has been initialized before invocation, leading to NULL dereferenceChain: IP and UDP layers each track the same value with different mechanisms that can get out of sync, possibly resulting in a NULL dereferenceChain: uninitialized function pointers can be dereferenced allowing code executionChain: improper initialization of memory can lead to NULL dereferenceChain: game server can access player data structures before initialization has happened leading to NULL dereferenceChain: The return value of a function returning a pointer is not checked for success (CWE-252) resulting in the later use of an uninitialized variable (CWE-456) and a null pointer dereference (CWE-476)Chain: a message having an unknown message type may cause a reference to uninitialized memory resulting in a null pointer dereference (CWE-476) or dangling pointer (CWE-825), possibly crashing the system or causing heap corruption.Chain: unchecked return value can lead to NULL dereferenceSSL software allows remote attackers to cause a denial of service (crash) via a crafted SSL/TLS handshake that triggers a null dereference.Network monitor allows remote attackers to cause a denial of service (crash) via a malformed RADIUS packet that triggers a null dereference.Network monitor allows remote attackers to cause a denial of service (crash) via a malformed Q.931, which triggers a null dereference.Chat client allows remote attackers to cause a denial of service (crash) via a passive DCC request with an invalid ID number, which causes a null dereference.Server allows remote attackers to cause a denial of service (crash) via malformed requests that trigger a null dereference.OS allows remote attackers to cause a denial of service (crash from null dereference) or execute arbitrary code via a crafted request during authentication protocol selection.Game allows remote attackers to cause a denial of service (server crash) via a missing argument, which triggers a null pointer dereference.Network monitor allows remote attackers to cause a denial of service (crash) or execute arbitrary code via malformed packets that cause a NULL pointer dereference.Chain: System call returns wrong value (CWE-393), leading to a resultant NULL dereference (CWE-476).`,
    Extended_Description: 'NULL pointer dereference issues can occur through a number of flaws, including race conditions, and simple programming omissions.',
    Alternate_Terms: [ 'NPD', 'null deref', 'nil pointer dereference' ],
    Likelihood_Of_Exploit: 'Medium',
    Common_Consequences: [ [Object], [Object] ],
    Related_Weaknesses: [ [Object], [Object], [Object] ]
  },
  {
    'CWE-ID': '681',
    Name: 'Incorrect Conversion between Numeric Types',
    Description: 'When converting from one data type to another, such as long to integer, data can be omitted or translated in a way that produces unexpected values. If the resulting values are used in a sensitive context, then dangerous behaviors may occur.Avoid making conversion between numeric types. Always check for the allowed ranges.Chain: integer coercion error (CWE-192) prevents a return value from indicating an error, leading to out-of-bounds write (CWE-787)Chain: in a web browser, an unsigned 64-bit integer is foribly cast to a 32-bit integer (CWE-681) and potentially leading to an integer overflow (CWE-190). If an integer overflow occurs, this can cause heap memory corruption (CWE-122)Chain: integer signedness error (CWE-195) passes signed comparison, leading to heap overflow (CWE-122)Chain: signed short width value in 
    processor is sign extended during conversion to unsigned int, which leads to integer overflow and heap-based buffer overflow.Integer truncation of length value leads to heap-based buffer overflow.Size of a particular type changes for 64-bit platforms, leading to an integer truncation in document processor causes incorrect index to be generated.',
    Extended_Description: '',
    Alternate_Terms: [],
    Likelihood_Of_Exploit: 'High',
    Common_Consequences: [ [Object] ],
    Related_Weaknesses: [ [Object], [Object], [Object] ]
  }
]

```
### listVunlerabilities

The `-listVunlerabilities` flag will list all vulnerabilities previously detected by grype

```sh
unibom -listVulnerabilities /sbom-cli/vulnerability-reports/reports/vulnerability_report_cyber_test
Creating vulnerability report
[
  {
    name: 'ansi-regex',
    installed: '3.0.0',
    fixedIn: '3.0.1',
    type: 'npm',
    vulnerability: 'GHSA-93q8-gq69-wqmw',
    severity: 'High'
  },
  {
    name: 'ansi-regex',
    installed: '5.0.0',
    fixedIn: '5.0.1',
    type: 'npm',
    vulnerability: 'GHSA-93q8-gq69-wqmw',
    severity: 'High'
  },
  {
    name: 'es5-ext',
    installed: '0.10.62',
    fixedIn: '0.10.63',
    type: 'npm',
    vulnerability: 'GHSA-4gmj-3p3h-gm8h',
    severity: 'Low'
  },
    ...
]
```
### genDependencies
To extract all dependencies from a file system, use the `-genDependencies <cpp_project> <project_name>` flag. ***Used exclusively with C/C++ file systems***.

The first argument should represent the path to any C/C++ project you wish to scan.
The project_name is utilised to save the extracted dependency list as `/vulnerability-reports/ccsDependencies/project_name_dependencies`.


```sh
unibom -genDependencies /Repositories/Dependency_scanner_tools/vim vim                                                    
Trying to generate dependency list for vim
dependency scanning completed.
dependency list saved to /sbom-cli/vulnerability-reports/ccsDependencies/vim_dependencies
```


```json=
{"target": "/usr/src/project", "extractors": [{"deps": [], "type": "autoconf"}, {"deps": [], "type": "make"}, {"deps": [], "type": "make"}, {"deps": [], "type": "make"}, {"deps": [], "type": "make"}, {"deps": [], "type": "make"}, {"deps": [], "type": "make"}, {"deps": [], "type": "make"}, {"deps": [{"depname": "attr", "version": null, "version_op": null, "unified_name": "attr", "extractor_type": "autoconf", "context": "/usr/src/project/src/configure.ac", "confidence": "High"}, {"depname": "selinux", "version": null, "version_op": null, "unified_name": "selinux", "extractor_type": "autoconf", "context": "/usr/src/project/src/configure.ac", "confidence": "High"}, {"depname": "ffi", "version": null, "version_op": null, "unified_name": "ffi", "extractor_type": "autoconf", "context": "/usr/src/project/src/configure.ac", "confidence": "High"}, {"depname": "network", "version": null, "version_op": null, "unified_name": "network", "extractor_type": "autoconf", "context": "/usr/src/project/src/configure.ac", "confidence": "High"}, {"deps": [], "type": "autoconf"}, {"deps": [], "type": "make"}, {"deps": [], "type": "make"}, {"deps": [], "type": "make"}, {"deps": [], "type": "make"}, {"deps": [], "type": "make"}, {"deps": [], "type": "make"}, {"deps": [], "type": "autoconf"}, {"deps": [], "type": "make"}]}%        
```
### generateConan

For the selected project, a conanfile.txt will be created using the `-generateConan` flag. This command cannot be executed until `ccsDependencies/project_name_dependencies` are created. The `-genDependencies` flag should be used first to create the dependency file.


```sh
unibom -generateConan vim
Writing conan file for ../vulnerability-reports/ccsDependencies/vim_dependencies to ../vulnerability-reports/conan-files/vim
Writing completed

➜  ~ cat /sbom-cli/vulnerability-reports/conan-files/vim/conanfile.txt 
[requires]
attr
selinux
ffi
network
socket
nsl
Xdmcp
ICE
Xpm
Xext
w
dl
Xmu
Xp
elf
m
posix1e
acl
sec
xpg4

[generators]
autoconf

```
### mapCpes

A list of known CPEs for each dependency in /`vulnerability-reports/ccsDependencies/project_name_dependencies` will be generated by the `-mapCpes` option, and it will be saved in `vulnerability-reports/cpes/cpeMapping.json`.

```sh
unibom -mapCpes vim
Trying to map CPEs, this may take a while...
Mapping completed. Please see the generated file in vulnerability-reports/cpes/cpeMapping.json
➜  ~ cat /sbom-cli/vulnerability-reports/cpes/vim/cpeMapping.json 
{
  "attr": [
    "cpe:/a:attr_project:attr:2.5.1"
  ],
  "selinux": [
    "cpe:/a:kernel:selinux:5.7"
  ],
  "ffi": [],
  "network": [
    "cpe:/a:hp:network:140.0.215.0"
  ],
  "socket": [
    "cpe:/a:socket:engine.io:6.4.2::~~~node.js~~"
  ],
  "nsl": [],
  "Xdmcp": [],
  "ICE": [],
  "Xpm": [],
  "Xext": [],
  "w": [],
  "dl": [
    "cpe:/a:thegr:dl:0.10.1"
  ],
  "Xmu": [],
  "Xp": [],
  "elf": [],
  "m": [
    "cpe:/a:gameloft:ice_age_village:2.8.0:m:~~~android~~"
  ],
  "posix1e": [],
  "acl": [
    "cpe:/a:acl:acl:9.1.0.213"
  ],
  "sec": [
    "cpe:/a:sec_project:sec:-"
  ],
  "xpg4": []
}                                                       
```

### generateCSbom

To be used only for C/C++ projects that are not supported by syft, such as those that do not make use of the CONAN package manager, may generate an SBOM using the `-generateCSbom` flag. The project name and format (only json or xml) are the two arguments it accepts. Before executing the command, please make sure that `/vulnerability-reports/cpe_data.csv` and `/vulnerability-reports/conan-files/<project_name>/conanfile.txt` exist. However, `-generateCCPPReport`, which handles `conanfile.txt` generation, has now replaced `-generateCSbom.`

```sh
unibom -generateCSbom vim json 
Trying to create SBOM for vim, this may take a while...
SBOM completed. Please see the generated file in vulnerability-reports/sboms/vim_sbom.json

cat /sbom-cli/vulnerability-reports/sboms/vim_sbom.json
```

```json=
{
  "schema": "http://cyclonedx.org/schema/bom-1.4.schema.json",
  "bomFormat": "CycloneDX",
  "specVersion": "1.4",
  "serialNumber": "urn:uuid:c7449190-e25a-4dbd-aab8-92eb4144ff10",
  "version": 1,
  "metadata": {
    "timestamp": "2024-03-27T11:04:10.635Z",
    "tools": [
      {
        "vendor": "nquiringminds",
        "name": "unibom",
        "version": "1"
      }
    ],
    "component": {
      "bom-ref": "66a9937f1b",
      "type": "file",
      "name": "/home/"
    }
  },
  "components": [
    {
      "bom-ref": "pkg:attr@2.5.1",
      "type": "library",
      "name": "attr",
      "version": "2.5.1",
      "licenses": [
        {
          "license": {
            "id": ""
          }
        }
      ], ...
}

```
### getGhsa

The `-getGhsa` flag will return detailed information about a known GHSA vulnerability. Please ensure the GHSA vul is valid and matches the following format e.g `GHSA-j8xg-fqg3-53r7`.

```sh
unibom -getGhsa GHSA-j8xg-fqg3-53r7
{
  schema_version: '1.4.0',
  id: 'GHSA-j8xg-fqg3-53r7',
  modified: '2023-06-27T15:48:19Z',
  published: '2023-06-22T06:30:18Z',
  aliases: [ 'CVE-2023-26115' ],
  summary: 'word-wrap vulnerable to Regular Expression Denial of Service',
  details: 'All versions of the package word-wrap are vulnerable to Regular Expression Denial of Service (ReDoS) due to the usage of an insecure regular expression within the result variable.\n',
  severity: [
    {
      type: 'CVSS_V3',
      score: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:N/A:L'
    }
  ],
  affected: [
    {
      package: [Object],
      ecosystem_specific: [Object],
      ranges: [Array]
    }
  ],
  references: [
    {
      type: 'ADVISORY',
      url: 'https://nvd.nist.gov/vuln/detail/CVE-2023-26115'
    },
    {
      type: 'WEB',
      url: 'https://github.com/jonschlinkert/word-wrap/commit/420dce9a2412b21881202b73a3c34f0edc53cb2e'
    },
    {
      type: 'PACKAGE',
      url: 'https://github.com/jonschlinkert/word-wrap'
    },
    {
      type: 'WEB',
      url: 'https://github.com/jonschlinkert/word-wrap/blob/master/index.js#L39'
    },
    {
      type: 'WEB',
      url: 'https://github.com/jonschlinkert/word-wrap/blob/master/index.js%23L39'
    },
    {
      type: 'WEB',
      url: 'https://github.com/jonschlinkert/word-wrap/releases/tag/1.2.4'
    },
    {
      type: 'WEB',
      url: 'https://security.snyk.io/vuln/SNYK-JAVA-ORGWEBJARSNPM-4058657'
    },
    {
      type: 'WEB',
      url: 'https://security.snyk.io/vuln/SNYK-JS-WORDWRAP-3149973'
    }
  ],
  database_specific: {
    cwe_ids: [ 'CWE-1333' ],
    severity: 'MODERATE',
    github_reviewed: true,
    github_reviewed_at: '2023-06-23T21:36:40Z',
    nvd_published_at: null
  }
}

```
### extractGhsas

The `-extractGhsas `will return an array of GHSA codes. Before running this command please replace the gitAdvisoryDbPath path from config.json with your local advisory-database/advisories path.

```sh
unibom  -extractGhsas /sbom-cli/vulnerability-reports/reports/vulnerability_report_cyber_sbom 
[
  'GHSA-93q8-gq69-wqmw', 'GHSA-93q8-gq69-wqmw',
  'GHSA-4gmj-3p3h-gm8h', 'GHSA-rv95-896h-c2vc',
  'GHSA-mhxj-85r3-2x55', 'GHSA-jchw-25xp-jwwc',
  'GHSA-cxjh-pqwp-8mfp', 'GHSA-4q6p-r6v2-jvc5',
  'GHSA-78xj-cgh5-2h22', 'GHSA-9c47-m6qq-7p4h',
  'GHSA-9c47-m6qq-7p4h', 'GHSA-f8q6-p94x-37v3',
  'GHSA-xvch-5gv4-984h', 'GHSA-qrpm-p2h7-hrv2',
  'GHSA-hj48-42vr-x3v9', 'GHSA-c2qf-rxjj-qqgw',
  'GHSA-c2qf-rxjj-qqgw', 'GHSA-c2qf-rxjj-qqgw',
  'GHSA-c2qf-rxjj-qqgw', 'GHSA-c2qf-rxjj-qqgw',
  'GHSA-4wf5-vphf-c2xc', 'GHSA-w5p7-h5w8-2hfq',
  'GHSA-7p7h-4mm5-852v', 'GHSA-j8xg-fqg3-53r7'
]

```
### classifyCwe

The `-classifyCwe` flag will try and classify the CWE_ID as one of the following types: `not-memory-related, other-memory-related, spatial-memory-related, temporal-memory-related`. Please ensure the CWE_ID is valid and of the following form: e.g. 354. If the CWE_ID doesn't exist in the current database it will return "not found".

```sh
unibom -classifyCwe CWE-354
CWE_ID CWE-354 has type: not-memory-related
```

### getHistory
All previous iterations of a CPE will be returned by the `-getHistory` flag, which will also attempt to identify any known CVEs and CWEs (vulnerabilities) for each version. Each CWE is also categorised as memory-related or not. Can take as an argument various types of CPEs such as: `cpe:2.3:\a:\busybox:busybox:1.33.2`, `cpe:/a:doxygen:doxygen:1.7.2`. For cpes that contain trailing ':' please place them inside quotes. e.g. : `unibom -getHistory "cpe:2.3:a:openssl:openssl:1.1.1:::::::"` . Output is saved to output/output.txt




```sh
unibom -getHistory "cpe:2.3:a:openssl:openssl:1.1.1:::::::"
cpe:2.3:a:openssl:openssl:1.1.1:::::::
Trying to find related cpes for cpe:2.3:a:openssl:openssl:1.1.1:::::::, this may take a while...
- Processing.../

cpe:/a:openssl:fips_object_module:-            - CVE No Info    - CWE No Info    - Type No Info
cpe:/a:openssl:openssl:-                       - CVE-2003-0078  - CWE-203        - not-memory-related
                                               - CVE-2005-2946  - CWE-327        - not-memory-related
                                               - CVE-1999-0428  - CWE-384        - not-memory-related
                                               - CVE-2008-5077  - CWE-20         - other-memory-related
                                               - CVE-2009-1390  - CWE-287        - not-memory-related
                                               ...
cpe:/a:openssl:openssl:0.9.1c                  - CVE-1999-0428  - CWE-384        - not-memory-related
                                               - CVE-2003-0078  - CWE-203        - not-memory-related
                                               - CVE-2005-2946  - CWE-327        - not-memory-related
                                               - CVE-2008-5077  - CWE-20         - other-memory-related
                                               - CVE-2009-0590  - CWE-119        - spatial-memory-related
                                               ...
cpe:/a:openssl:openssl:0.9.2b                  - CVE-2003-0078  - CWE-203        - not-memory-related
                                               - CVE-2005-2946  - CWE-327        - not-memory-related
                                               - CVE-2008-5077  - CWE-20         - other-memory-related
                                               - CVE-2009-0590  - CWE-119        - spatial-memory-related
                                               - CVE-2009-1390  - CWE-287        - not-memory-related
                                               ...
cpe:/a:openssl:openssl:0.9.3                   - CVE-2005-2946  - CWE-327        - not-memory-related
                                               - CVE-2003-0078  - CWE-203        - not-memory-related
                                               ...
...

                                               
                                               
```
### generateDockerSbom

The unibom `-generateDockerSbom` command employs [Syft](https://github.com/anchore/syft) to first generate an SBOM (Software Bill of Materials) for the specified Docker image (`<image_name>`). Following the SBOM creation, it uses [Grype](https://github.com/anchore/grype) to analyse the identified components for vulnerabilities, producing a comprehensive vulnerability report. e.g.`-generateDockerSbom nginx:latest nginx`

```sh
unibom -generateDockerSbom nginx:latest nginx
Running syft to generate SBOM for Docker image: nginx:latest...
SBOM generation completed for Docker image. SBOM saved to /vulnerability-reports/sboms/nginx.json
Running grype to generate vulnerability report...
NAME                INSTALLED                FIXED-IN          TYPE  VULNERABILITY     SEVERITY
apt                 2.6.1                                      deb   CVE-2011-3374     Negligible
bsdutils            1:2.38.1-5+b1                              deb   CVE-2022-0563     Negligible
bsdutils            1:2.38.1-5+b1            2.38.1-5+deb12u1  deb   CVE-2024-28085    Unknown
coreutils           9.1-1                    (won't fix)       deb   CVE-2016-2781     Low
coreutils           9.1-1                                      deb   CVE-2017-18018    Negligible
curl                7.88.1-10+deb12u5                          deb   CVE-2024-2379     Negligible
curl                7.88.1-10+deb12u5        (won't fix)       deb   CVE-2024-2398     Unknown     
curl                7.88.1-10+deb12u5        (won't fix)       deb   CVE-2024-2004     Unknown     
gcc-12-base         12.2.0-14                (won't fix)       deb   CVE-2023-4039     Medium      
gcc-12-base         12.2.0-14                                  deb   CVE-2022-27943    Negligible  
gpgv                2.2.40-1.1                                 deb   CVE-2022-3219     Negligible  
libaom3             3.6.0-1                  (won't fix)       deb   CVE-2023-6879     Critical    
libaom3             3.6.0-1                  (won't fix)       deb   CVE-2023-39616    High        
libapt-pkg6.0       2.6.1                                      deb   CVE-2011-3374     Negligible  
libblkid1           2.38.1-5+b1                                deb   CVE-2022-0563     Negligible  
libblkid1           2.38.1-5+b1              2.38.1-5+deb12u1  deb   CVE-2024-28085    Unknown     
libc-bin            2.36-9+deb12u4                             deb   CVE-2019-9192     Negligible  
libc-bin            2.36-9+deb12u4                             deb   CVE-2019-1010025  Negligible  
libc-bin            2.36-9+deb12u4                             deb   CVE-2019-1010024  Negligible  
libc-bin            2.36-9+deb12u4                             deb   CVE-2019-1010023  Negligible  
libc-bin            2.36-9+deb12u4                             deb   CVE-2019-1010022  Negligible  
libc-bin            2.36-9+deb12u4                             deb   CVE-2018-20796    Negligible  
libc-bin            2.36-9+deb12u4                             deb   CVE-2010-4756     Negligible  
libc6               2.36-9+deb12u4                             deb   CVE-2019-9192     Negligible  
libc6               2.36-9+deb12u4                             deb   CVE-2019-1010025  Negligible  
libc6               2.36-9+deb12u4                             deb   CVE-2019-1010024  Negligible  
libc6               2.36-9+deb12u4                             deb   CVE-2019-1010023  Negligible  
libc6               2.36-9+deb12u4                             deb   CVE-2019-1010022  Negligible  
libc6               2.36-9+deb12u4                             deb   CVE-2018-20796    Negligible  
libc6               2.36-9+deb12u4                             deb   CVE-2010-4756     Negligible  
libcurl4            7.88.1-10+deb12u5                          deb   CVE-2024-2379     Negligible  
libcurl4            7.88.1-10+deb12u5        (won't fix)       deb   CVE-2024-2398     Unknown     
libcurl4            7.88.1-10+deb12u5        (won't fix)       deb   CVE-2024-2004     Unknown     
libdav1d6           1.0.0-2                                    deb   CVE-2024-1580     Medium      
libdav1d6           1.0.0-2                  (won't fix)       deb   CVE-2023-32570    Medium      
libexpat1           2.5.0-1                                    deb   CVE-2023-52425    High        
libexpat1           2.5.0-1                                    deb   CVE-2023-52426    Negligible  
libexpat1           2.5.0-1                                    deb   CVE-2024-28757    Unknown     
libgcc-s1           12.2.0-14                (won't fix)       deb   CVE-2023-4039     Medium      
libgcc-s1           12.2.0-14                                  deb   CVE-2022-27943    Negligible  
libgcrypt20         1.10.1-3                 (won't fix)       deb   CVE-2024-2236     Medium      
libgcrypt20         1.10.1-3                                   deb   CVE-2018-6829     Negligible  
libgnutls30         3.7.9-2+deb12u2                            deb   CVE-2024-28835    Medium      
libgnutls30         3.7.9-2+deb12u2                            deb   CVE-2024-28834    Medium      
libgnutls30         3.7.9-2+deb12u2                            deb   CVE-2011-3389     Negligible  
libgssapi-krb5-2    1.20.1-2+deb12u1                           deb   CVE-2018-5709     Negligible  
libgssapi-krb5-2    1.20.1-2+deb12u1         (won't fix)       deb   CVE-2024-26462    Unknown     
libgssapi-krb5-2    1.20.1-2+deb12u1         (won't fix)       deb   CVE-2024-26461    Unknown     
libgssapi-krb5-2    1.20.1-2+deb12u1         (won't fix)       deb   CVE-2024-26458    Unknown     
libheif1            1.15.1-1                 (won't fix)       deb   CVE-2023-49464    High        
libheif1            1.15.1-1                 (won't fix)       deb   CVE-2023-49463    High        
libheif1            1.15.1-1                 (won't fix)       deb   CVE-2023-49462    High        
libheif1            1.15.1-1                 (won't fix)       deb   CVE-2023-49460    High        
libheif1            1.15.1-1                 (won't fix)       deb   CVE-2023-29659    Medium      
libheif1            1.15.1-1                                   deb   CVE-2024-25269    Negligible  
libjbig0            2.1-6.1                                    deb   CVE-2017-9937     Negligible  
libk5crypto3        1.20.1-2+deb12u1                           deb   CVE-2018-5709     Negligible  
libk5crypto3        1.20.1-2+deb12u1         (won't fix)       deb   CVE-2024-26462    Unknown     
libk5crypto3        1.20.1-2+deb12u1         (won't fix)       deb   CVE-2024-26461    Unknown     
libk5crypto3        1.20.1-2+deb12u1         (won't fix)       deb   CVE-2024-26458    Unknown     
libkrb5-3           1.20.1-2+deb12u1                           deb   CVE-2018-5709     Negligible  
libkrb5-3           1.20.1-2+deb12u1         (won't fix)       deb   CVE-2024-26462    Unknown     
libkrb5-3           1.20.1-2+deb12u1         (won't fix)       deb   CVE-2024-26461    Unknown     
libkrb5-3           1.20.1-2+deb12u1         (won't fix)       deb   CVE-2024-26458    Unknown     
libkrb5support0     1.20.1-2+deb12u1                           deb   CVE-2018-5709     Negligible  
libkrb5support0     1.20.1-2+deb12u1         (won't fix)       deb   CVE-2024-26462    Unknown     
libkrb5support0     1.20.1-2+deb12u1         (won't fix)       deb   CVE-2024-26461    Unknown     
libkrb5support0     1.20.1-2+deb12u1         (won't fix)       deb   CVE-2024-26458    Unknown     
libldap-2.5-0       2.5.13+dfsg-5            (won't fix)       deb   CVE-2023-2953     High        
libldap-2.5-0       2.5.13+dfsg-5                              deb   CVE-2020-15719    Negligible  
libldap-2.5-0       2.5.13+dfsg-5                              deb   CVE-2017-17740    Negligible  
libldap-2.5-0       2.5.13+dfsg-5                              deb   CVE-2017-14159    Negligible  
libldap-2.5-0       2.5.13+dfsg-5                              deb   CVE-2015-3276     Negligible  
libmount1           2.38.1-5+b1                                deb   CVE-2022-0563     Negligible  
libmount1           2.38.1-5+b1              2.38.1-5+deb12u1  deb   CVE-2024-28085    Unknown     
libpam-modules      1.5.2-6+deb12u1          (won't fix)       deb   CVE-2024-22365    Medium      
libpam-modules-bin  1.5.2-6+deb12u1          (won't fix)       deb   CVE-2024-22365    Medium      
libpam-runtime      1.5.2-6+deb12u1          (won't fix)       deb   CVE-2024-22365    Medium      
libpam0g            1.5.2-6+deb12u1          (won't fix)       deb   CVE-2024-22365    Medium      
libpng16-16         1.6.39-2                                   deb   CVE-2021-4214     Negligible  
libsmartcols1       2.38.1-5+b1                                deb   CVE-2022-0563     Negligible  
libsmartcols1       2.38.1-5+b1              2.38.1-5+deb12u1  deb   CVE-2024-28085    Unknown     
libssl3             3.0.11-1~deb12u2         (won't fix)       deb   CVE-2024-0727     Medium      
libssl3             3.0.11-1~deb12u2         (won't fix)       deb   CVE-2023-6129     Medium      
libssl3             3.0.11-1~deb12u2         (won't fix)       deb   CVE-2023-5678     Medium      
libssl3             3.0.11-1~deb12u2                           deb   CVE-2010-0928     Negligible  
libssl3             3.0.11-1~deb12u2                           deb   CVE-2007-6755     Negligible  
libssl3             3.0.11-1~deb12u2         (won't fix)       deb   CVE-2023-6237     Unknown     
libstdc++6          12.2.0-14                (won't fix)       deb   CVE-2023-4039     Medium      
libstdc++6          12.2.0-14                                  deb   CVE-2022-27943    Negligible  
libsystemd0         252.22-1~deb12u1         (won't fix)       deb   CVE-2023-50387    High        
libsystemd0         252.22-1~deb12u1                           deb   CVE-2023-31439    Negligible  
libsystemd0         252.22-1~deb12u1                           deb   CVE-2023-31438    Negligible  
libsystemd0         252.22-1~deb12u1                           deb   CVE-2023-31437    Negligible  
libsystemd0         252.22-1~deb12u1                           deb   CVE-2013-4392     Negligible  
libsystemd0         252.22-1~deb12u1         (won't fix)       deb   CVE-2023-50868    Unknown     
libtiff6            4.5.0-6+deb12u1          (won't fix)       deb   CVE-2023-52356    High        
libtiff6            4.5.0-6+deb12u1          (won't fix)       deb   CVE-2023-52355    High        
libtiff6            4.5.0-6+deb12u1          (won't fix)       deb   CVE-2023-6277     Medium      
libtiff6            4.5.0-6+deb12u1          (won't fix)       deb   CVE-2023-3618     Medium      
libtiff6            4.5.0-6+deb12u1          (won't fix)       deb   CVE-2023-3316     Medium      
libtiff6            4.5.0-6+deb12u1          (won't fix)       deb   CVE-2023-2908     Medium      
libtiff6            4.5.0-6+deb12u1          (won't fix)       deb   CVE-2023-26966    Medium      
libtiff6            4.5.0-6+deb12u1          (won't fix)       deb   CVE-2023-26965    Medium      
libtiff6            4.5.0-6+deb12u1          (won't fix)       deb   CVE-2023-25433    Medium      
libtiff6            4.5.0-6+deb12u1                            deb   CVE-2023-6228     Negligible  
libtiff6            4.5.0-6+deb12u1                            deb   CVE-2023-3164     Negligible  
libtiff6            4.5.0-6+deb12u1                            deb   CVE-2023-1916     Negligible  
libtiff6            4.5.0-6+deb12u1                            deb   CVE-2022-1210     Negligible  
libtiff6            4.5.0-6+deb12u1                            deb   CVE-2018-10126    Negligible  
libtiff6            4.5.0-6+deb12u1                            deb   CVE-2017-9117     Negligible  
libtiff6            4.5.0-6+deb12u1                            deb   CVE-2017-5563     Negligible  
libtiff6            4.5.0-6+deb12u1                            deb   CVE-2017-17973    Negligible  
libtiff6            4.5.0-6+deb12u1                            deb   CVE-2017-16232    Negligible  
libtinfo6           6.4-4                    (won't fix)       deb   CVE-2023-50495    Medium      
libtinfo6           6.4-4                    (won't fix)       deb   CVE-2023-45918    Unknown     
libudev1            252.22-1~deb12u1         (won't fix)       deb   CVE-2023-50387    High        
libudev1            252.22-1~deb12u1                           deb   CVE-2023-31439    Negligible  
libudev1            252.22-1~deb12u1                           deb   CVE-2023-31438    Negligible  
libudev1            252.22-1~deb12u1                           deb   CVE-2023-31437    Negligible  
libudev1            252.22-1~deb12u1                           deb   CVE-2013-4392     Negligible  
libudev1            252.22-1~deb12u1         (won't fix)       deb   CVE-2023-50868    Unknown     
libuuid1            2.38.1-5+b1                                deb   CVE-2022-0563     Negligible  
libuuid1            2.38.1-5+b1              2.38.1-5+deb12u1  deb   CVE-2024-28085    Unknown     
libxml2             2.9.14+dfsg-1.3~deb12u1  (won't fix)       deb   CVE-2024-25062    High        
libxml2             2.9.14+dfsg-1.3~deb12u1  (won't fix)       deb   CVE-2023-45322    Medium      
libxml2             2.9.14+dfsg-1.3~deb12u1  (won't fix)       deb   CVE-2023-39615    Medium      
libxslt1.1          1.1.35-1                                   deb   CVE-2015-9019     Negligible  
login               1:4.13+dfsg1-1+b1        (won't fix)       deb   CVE-2023-4641     Medium      
login               1:4.13+dfsg1-1+b1        (won't fix)       deb   CVE-2023-29383    Low         
login               1:4.13+dfsg1-1+b1                          deb   CVE-2019-19882    Negligible  
login               1:4.13+dfsg1-1+b1                          deb   CVE-2007-5686     Negligible  
mount               2.38.1-5+b1                                deb   CVE-2022-0563     Negligible  
mount               2.38.1-5+b1              2.38.1-5+deb12u1  deb   CVE-2024-28085    Unknown     
ncurses-base        6.4-4                    (won't fix)       deb   CVE-2023-50495    Medium      
ncurses-base        6.4-4                    (won't fix)       deb   CVE-2023-45918    Unknown     
ncurses-bin         6.4-4                    (won't fix)       deb   CVE-2023-50495    Medium      
ncurses-bin         6.4-4                    (won't fix)       deb   CVE-2023-45918    Unknown     
nginx               1.25.4-1~bookworm                          deb   CVE-2023-44487    High        
nginx               1.25.4-1~bookworm        (won't fix)       deb   CVE-2013-0337     Low         
nginx               1.25.4-1~bookworm                          deb   CVE-2009-4487     Negligible  
openssl             3.0.11-1~deb12u2         (won't fix)       deb   CVE-2024-0727     Medium      
openssl             3.0.11-1~deb12u2         (won't fix)       deb   CVE-2023-6129     Medium      
openssl             3.0.11-1~deb12u2         (won't fix)       deb   CVE-2023-5678     Medium      
openssl             3.0.11-1~deb12u2                           deb   CVE-2010-0928     Negligible  
openssl             3.0.11-1~deb12u2                           deb   CVE-2007-6755     Negligible  
openssl             3.0.11-1~deb12u2         (won't fix)       deb   CVE-2023-6237     Unknown     
passwd              1:4.13+dfsg1-1+b1        (won't fix)       deb   CVE-2023-4641     Medium      
passwd              1:4.13+dfsg1-1+b1        (won't fix)       deb   CVE-2023-29383    Low         
passwd              1:4.13+dfsg1-1+b1                          deb   CVE-2019-19882    Negligible  
passwd              1:4.13+dfsg1-1+b1                          deb   CVE-2007-5686     Negligible  
perl-base           5.36.0-7+deb12u1         (won't fix)       deb   CVE-2023-31484    High        
perl-base           5.36.0-7+deb12u1                           deb   CVE-2023-31486    Negligible  
perl-base           5.36.0-7+deb12u1                           deb   CVE-2011-4116     Negligible  
tar                 1.34+dfsg-1.2+deb12u1                      deb   CVE-2005-2541     Negligible  
util-linux          2.38.1-5+b1                                deb   CVE-2022-0563     Negligible  
util-linux          2.38.1-5+b1              2.38.1-5+deb12u1  deb   CVE-2024-28085    Unknown     
util-linux-extra    2.38.1-5+b1                                deb   CVE-2022-0563     Negligible  
util-linux-extra    2.38.1-5+b1              2.38.1-5+deb12u1  deb   CVE-2024-28085    Unknown     
zlib1g              1:1.2.13.dfsg-1          (won't fix)       deb   CVE-2023-45853    Critical

Vulnerability report saved to: /vulnerability-reports/reports/vulnerability_report_nginx

```
### binwalk

* The `unibom -binwalk` command requires specific arguments to function correctly. Here is the general syntax to follow:

```sh
unibom -binwalk <directory_path> "[-binwalk_flags]" <file_name>
```
* For more detailed documentation and advanced usage examples, please visit the [Binwalk GitHub repository](https://github.com/ReFirmLabs/binwalk).

`<directory_path>`: This is the path to the directory containing the firmware file you wish to analyze.

`"[-binwalk_flags]"`: These are the flags you want to pass to Binwalk, enclosed in square brackets and quoted. This allows for passing multiple flags as a single argument.

`<file_name>`: The name of the firmware file to be analysed.

#### Binwalk Examples

Here’s how you can use the command on a `Linux` system where you want to apply the `-Me` flag (for recursive extraction) to a specific firmware file:
```sh
unibom -binwalk "$(pwd)" "[-Me]" openwrt-23.05.3-mediatek-filogic-acer_predator-w6-initramfs-kernel.bin

```
This command tells `unibom` to run Binwalk in the current directory `"$(pwd)"`, use the `-Me` flag for recursive extraction, and process the specified .bin file.

Logs will be saved to /binwalk-reports/openwrt-23.05.3-mediatek-filogic-acer_predator-w6-initramfs-kernel.bin_extraction_report

```sh
Scan Time:     2024-04-18 14:20:20
Target File:   /home/linuxbrew/data/openwrt-23.05.3-mediatek-filogic-acer_predator-w6-initramfs-kernel.bin
MD5 Checksum:  6bfdc104e9abe6467cdd6ddb8f36b038
Signatures:    411

DECIMAL       HEXADECIMAL     DESCRIPTION
--------------------------------------------------------------------------------
0             0x0             Flattened device tree, size: 7281760 bytes, version: 17
236           0xEC            LZMA compressed data, properties: 0x6D, dictionary size: 8388608 bytes, uncompressed size: 11610120 bytes
3774808       0x399958        xz compressed data
7257488       0x6EBD90        Flattened device tree, size: 22920 bytes, version: 17


Scan Time:     2024-04-18 14:20:21
Target File:   /home/linuxbrew/data/_openwrt-23.05.3-mediatek-filogic-acer_predator-w6-initramfs-kernel.bin.extracted/EC
MD5 Checksum:  5a989a41c3370c43626db5938fb33375
Signatures:    411

DECIMAL       HEXADECIMAL     DESCRIPTION
--------------------------------------------------------------------------------
0             0x0             Linux kernel ARM64 image, load offset: 0x0, image size: 11927552 bytes, little endian, 4k page size,
198592        0x307C0         SHA256 hash constants, little endian
8671232       0x845000        ELF, 64-bit LSB shared object, version 1 (SYSV)
8677456       0x846850        SHA256 hash constants, little endian
8837368       0x86D8F8        SHA256 hash constants, little endian
8838208       0x86DC40        CRC32 polynomial table, little endian
9164755       0x8BD7D3        Neighborly text, "neighbor get requestrequest"

.
.
.

Scan Time:     2024-04-18 14:20:27
Target File:   /home/linuxbrew/data/_openwrt-23.05.3-mediatek-filogic-acer_predator-w6-initramfs-kernel.bin.extracted/_EC.extracted/console
MD5 Checksum:  d41d8cd98f00b204e9800998ecf8427e
Signatures:    411

DECIMAL       HEXADECIMAL     DESCRIPTION
--------------------------------------------------------------------------------
```

#### Binwalk Example with multiple flags

If you want to use multiple flags with Binwalk, such as `-M` for matryoshka (recursive) scanning and `-e` for extraction, you would format your command as follows:

```sh
unibom -binwalk /path/to/current/directory "[-M -e]" your_firmware_file.bin
```

This setup directs `unibom` to execute Binwalk with both the `-M` and `-e` flags on `your_firmware_file.bin` located at the specified path.

#### Binwalk Important Notes

* Ensure the path to the directory and the file name are correctly specified.
* Always enclose Binwalk flags within square brackets and quotes "[]" to ensure they are parsed correctly as a single argument by the script.
* Verify that your Docker container has access to the directory where the file resides, as Docker might have restrictions based on your system’s Docker configuration.


### compare

The `-compare` command compares components, versions, and vulnerabilities across multiple `CycloneDX` `JSON` `SBOMs`. It helps to visualize differences and similarities between the `SBOMs`, making it easier to identify discrepancies in components, versions, and vulnerabilities. This command takes multiple paths to SBOM files as arguments and generates a comprehensive report comparing them.

#### Compare Usage
```sh
unibom -compare <absolute/path/to/sbom1> <absolute/path/to/sbom2> <additional SBOM paths...>
```
The output will be saved by default to `vulnerability-reports/comparisons/comparison-result.txt`

If you want to specify a different file name to be saved, please use the following format:

```sh
unibom -compare "[<absolute/path/to/sbom-1.json> <absolute/path/to/sbom-2.json> <additional SBOM paths...>]" filename
```
#### Compare Output:
The output is structured in three sections:

* `Components Comparison`: Displays which components are present or missing across the SBOMs.
* `Version Information`: Shows the version information of the components found in the SBOMs.
* `Vulnerabilities`: Lists the vulnerabilities associated with the components in each SBOM, detailing the CVEs.

Example output 

```sh
unibom -compare "[/test/test-files/kernel-sbom-1.json test/test-files/kernel-sbom-2.json /test/test-files/kernel-sbom-3.json]" test-comp

------------------ SBOM Comparison Results ------------------

1. Components Comparison:
-------------------------------------------------------------------------------------
| Component Name      | kernel-sbom-1.json | kernel-sbom-2.json | kernel-sbom-3.json |
-------------------------------------------------------------------------------------
| kernel               | Present            | Present            | Present            |
-------------------------------------------------------------------------------------
| openssl              | Present            | Missing            | Missing            |
-------------------------------------------------------------------------------------
| sqlite               | Missing            | Present            | Missing            |
-------------------------------------------------------------------------------------
| protobuf-c_project   | Missing            | Missing            | Present            |
-------------------------------------------------------------------------------------

2. Version Information:
-------------------------------------------------------------------------------------
| Component Name      | kernel-sbom-1.json | kernel-sbom-2.json | kernel-sbom-3.json |
-------------------------------------------------------------------------------------
| kernel               | 2.24.2             | 2.24.2             | 2.32.0             |
-------------------------------------------------------------------------------------
| openssl              | 3.0.0              |                    |                    |
-------------------------------------------------------------------------------------
| sqlite               |                    | 3.5.9              |                    |
-------------------------------------------------------------------------------------
| protobuf-c_project   |                    |                    | 1.3.3              |
-------------------------------------------------------------------------------------

3. Vulnerabilities:
-------------------------------------------------------------------------------------
| Component Name      | kernel-sbom-1.json | kernel-sbom-2.json | kernel-sbom-3.json |
-------------------------------------------------------------------------------------
| kernel               | CVE-2014-9114      | CVE-2016-2779      | CVE-2021-37600     |
| kernel               | CVE-2016-5011      | CVE-2014-9114      | CVE-2022-0563      |
| kernel               | CVE-2015-5224      | CVE-2016-5011      |                    |
| kernel               | CVE-2018-7738      | CVE-2015-5224      |                    |
| kernel               | CVE-2021-37600     | CVE-2018-7738      |                    |
| kernel               | CVE-2022-0563      | CVE-2021-37600     |                    |
| kernel               | CVE-2020-21583     | CVE-2022-0563      |                    |
| kernel               |                    | CVE-2020-21583     |                    |
-------------------------------------------------------------------------------------
| openssl              | CVE-2009-1390      |                    |                    |
| openssl              | CVE-2009-3765      |                    |                    |
| openssl              | CVE-2009-3766      |                    |                    |
| openssl              | CVE-2009-3767      |                    |                    |
| openssl              | CVE-2019-0190      |                    |                    |
| openssl              | CVE-2021-4044      |                    |                    |
| openssl              | CVE-2021-4160      |                    |                    |
| openssl              | CVE-2022-0778      |                    |                    |
| openssl              | CVE-2022-1292      |                    |                    |
| openssl              | CVE-2022-1343      |                    |                    |
| openssl              | CVE-2022-1434      |                    |                    |
| openssl              | CVE-2022-1473      |                    |                    |
| openssl              | CVE-2022-2068      |                    |                    |
| openssl              | CVE-2022-2097      |                    |                    |
| openssl              | CVE-2022-3358      |                    |                    |
| openssl              | CVE-2022-3602      |                    |                    |
| openssl              | CVE-2022-3786      |                    |                    |
| openssl              | CVE-2022-3996      |                    |                    |
| openssl              | CVE-2022-4304      |                    |                    |
| openssl              | CVE-2022-4450      |                    |                    |
| openssl              | CVE-2023-0215      |                    |                    |
| openssl              | CVE-2023-0216      |                    |                    |
| openssl              | CVE-2023-0217      |                    |                    |
| openssl              | CVE-2023-0286      |                    |                    |
| openssl              | CVE-2023-0401      |                    |                    |
| openssl              | CVE-2022-4203      |                    |                    |
| openssl              | CVE-2023-0464      |                    |                    |
| openssl              | CVE-2023-0465      |                    |                    |
| openssl              | CVE-2023-0466      |                    |                    |
| openssl              | CVE-2023-1255      |                    |                    |
| openssl              | CVE-2023-2650      |                    |                    |
| openssl              | CVE-2023-2975      |                    |                    |
| openssl              | CVE-2023-3817      |                    |                    |
| openssl              | CVE-2023-4807      |                    |                    |
| openssl              | CVE-2023-5363      |                    |                    |
| openssl              | CVE-2023-5678      |                    |                    |
| openssl              | CVE-2023-6129      |                    |                    |
| openssl              | CVE-2024-0727      |                    |                    |
-------------------------------------------------------------------------------------
| sqlite               |                    | CVE-2015-3414      |                    |
| sqlite               |                    | CVE-2015-3415      |                    |
| sqlite               |                    | CVE-2015-3416      |                    |
| sqlite               |                    | CVE-2015-3717      |                    |
| sqlite               |                    | CVE-2015-5895      |                    |
| sqlite               |                    | CVE-2015-6607      |                    |
| sqlite               |                    | CVE-2016-6153      |                    |
| sqlite               |                    | CVE-2017-10989     |                    |
| sqlite               |                    | CVE-2018-8740      |                    |
| sqlite               |                    | CVE-2018-20346     |                    |
| sqlite               |                    | CVE-2018-20505     |                    |
| sqlite               |                    | CVE-2018-20506     |                    |
| sqlite               |                    | CVE-2019-19645     |                    |
| sqlite               |                    | CVE-2019-19646     |                    |
| sqlite               |                    | CVE-2020-11655     |                    |
| sqlite               |                    | CVE-2020-11656     |                    |
| sqlite               |                    | CVE-2020-13434     |                    |
| sqlite               |                    | CVE-2020-13435     |                    |
| sqlite               |                    | CVE-2020-13630     |                    |
| sqlite               |                    | CVE-2020-13631     |                    |
| sqlite               |                    | CVE-2020-13632     |                    |
| sqlite               |                    | CVE-2020-15358     |                    |
| sqlite               |                    | CVE-2022-35737     |                    |
| sqlite               |                    | CVE-2023-7104      |                    |
-------------------------------------------------------------------------------------
| protobuf-c_project   |                    |                    | CVE-2022-48468     |
-------------------------------------------------------------------------------------

```