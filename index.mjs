if (process.argv.length < 3) {
    console.log('Usage: node ' + process.argv[1] + ' FILENAME');
    process.exit(1);
}

import * as GroovyRemix from "./js/LMGroovyRemix.mjs";
import * as fs from 'fs';

const targetPath = process.argv[2];

fs.stat(targetPath, function(err, stats) {
    if (stats.isFile()) {
        processFile(targetPath);
    } else {
        processDirectory(targetPath)
    }
});

function processDirectory(path) {
    fs.readdir(path, function (err, files) {
        if (err) throw err;

        files.forEach(file => {
            const filePath = `${path}/${file}`;

            fs.stat(filePath, function(err, stats) {
                if (err) throw err;

                if (stats.isFile()) {
                    processFile(filePath);
                } else {
                    processDirectory(filePath);
                }
            });
        });
    });
}

function processFile(path) {
    fs.readFile(path, 'utf8', function(err, data) {
        if (err) throw err;

        const result = path.toUpperCase().endsWith(".JSON") ? processJson(data) : GroovyRemix.V2toV4(data);

        if(result != "" && result != data) {
            const fixPath = path.replace(/(\.\w*$)/, ".V4$1")
            fs.writeFileSync(fixPath, result);
            console.log(`Issue(s) Found in [${path}] - Fixed in [${fixPath}]`);
        }
    });
}

function applyFixes(script) {
    for (const patch of GroovyRemix.getPatches()) {
        if(script.match(patch.check)) {
            if(patch.rgx.global) {
                script = script.replaceAll(patch.rgx, patch.str);
            } else {
                script = script.replace(patch.rgx, patch.str);
            }
        }
    }

    return script
}

function processJson(data) {
    try {
        const jsonData = JSON.parse(data);

        if(jsonData?.activeDiscovery?.params?.type == "groovy") {
            jsonData.activeDiscovery.params.content = applyFixes(jsonData.activeDiscovery.params.content);;
        }

        if(jsonData?.collectionAttrs) {
            if(jsonData?.collectionAttrs?.type) {
                if(jsonData?.collectionAttrs?.type == "groovy") {
                    jsonData.collectionAttrs.content = applyFixes(jsonData.collectionAttrs.content);
                }
            } else {
                for(const attr of jsonData?.collectionAttrs) {
                    if(attr?.script?.type == "groovy") {   
                        attr.script.content = applyFixes(attr.script.content);
                    }
                }
            }
        }

        if(jsonData?.script?.type == "groovy") {
            jsonData.script.content = applyFixes(jsonData.script.content);
        }

        return JSON.stringify(jsonData, null, 2);
    } catch (err) {
        console.error('Invalid JSON:', err);
    }
    
    return ""
}