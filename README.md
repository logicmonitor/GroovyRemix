# LM Groovy Remix

## Description
A quick and simple JS module that attempts to update a Groovy V2 script to make it compatible with LogicMonitor's Groovy V4 implementation. This module is designed to be used alongside testing modules, it is not a replacement for testing.
Only custom modules will need to be updated, as the latest version of LogicMonitor provided modules are already compatible with Groovy V4.

It works by running a series of patches on the script. Each patch does the following:
* Check if the patch is needed via a regex match.
* Regex match text that needs to be updated.
* Replace the matches with the updated solution.

## Utilizing Groovy Remix
### Clone the Repository
Clone the GroovyMix repository somewhere you will be able to locate and use it. 
### Download DataSources
DataSources can be downloaded as a json file using the LogicMonitor UI. Navigate to **My Module Toolbox** &#8594; Select the module for testing &#8594; **Export**.
This will download a .json file of the module. If you are testing multiple modules, it is recommended to create a directory for the modules you are testing.
### Node.js
Prerequisites:
- Have Node.js installed
- Have a .json file of a module or a directory of .json files of the modules for testing in the repository directory

The module can be run in node using the index.mjs. Utilizing the CLI navigate to the repository and run the following:
```
 node index.mjs "DIRECTORY_OR_FILE_NAME"
```
    
### HTML
The module can also live within a web page or app like so:

```
import * as GroovyRemix from "./js/LMGroovyRemix.mjs";

console.log(GroovyRemix.V2toV4("println 'Example Groovy'"));
```

There is a working example provided in index.html, but it requires a local HTTP server to run.
Node's [http-server](https://www.npmjs.com/package/http-server) is a quick way to get up and running, especially if you are planning to install node anyway to use the above approach!

### Import the updated modules
Utilizing the LogicMonitor UI, navigate to **My Module Toolbox** &#8594; **Add** &#8594; **Import from file**. Select the updated .json file and review the changes before saving.

## Disclaimer
This tool is to be used alongside testing modules, it is designed to resolve issues that have been identified as known issues while transitioning from Groovy 2 to Groovy 4. Please ensure you test modules after using this tool, for more details on testing check out [Custom Module Validation](https://www.logicmonitor.com/support/custom-module-groovy-migration-validation).

## Improvements
For any issues or security vulnerabilities you want to report, please add them to the Issues section for the maintainers of this project to review.
