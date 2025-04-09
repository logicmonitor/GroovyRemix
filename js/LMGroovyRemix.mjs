class Patch {
    constructor(name, check, rgx, str) {
        this.name = name;
        this.check = check; // Check if fix is needed
        this.rgx = rgx; // Regex for match
        this.str = str; // String to replace with
    }
}
                         // Name                      // Check                                                                         // Regex match for replace                                    // String to replace with
let patches = [new Patch("V2 Header"                   , /^\/\/!\/lib-groovy\/v2/s                                                     , /^\/\/!\/lib-groovy\/v2/s                                   , "//!/lib-groovy/v4"),
               
               new Patch("XML Import Required"         , /^(?!.*import groovy\.util\.(\*|Xml(Slurper|Parser))\n).*Xml(Slurper|Parser)/s, /^.*(?<=(\n?import[^\n]*)|(\/\/!\/lib-groovy\/v4\n))/s      , "$&\nimport groovy.util.*"),
               new Patch("XML Import Location"         , /import groovy\.util\.(\*|Xml(Slurper|Parser))/s                              , /import groovy\.util\.(\*|Xml(Slurper|Parser))/g            , "import groovy.xml.*"),
               new Patch("Fully Qualified XMLSlurper"  , /(?<!import\s)groovy\.util\.XmlSlurper/s                                      , /(?<!import\s)groovy\.util\.XmlSlurper/g                    , "XmlSlurper"),
               new Patch("Fully Qualified XMLParser"   , /(?<!import\s)groovy\.util\.XmlParser/s                                       , /(?<!import\s)groovy\.util\.XmlParser/g                     , "XmlParser"),

               new Patch("XML Support Import Required" , /^(?!.*import groovy\.util\.slurpersupport\.Node).*Node/s                     , /^.*(?<=(\n?import[^\n]*)|(\/\/!\/lib-groovy\/v4\n))/s      , "$&\nimport groovy.util.slurpersupport.*"),
               new Patch("XML Support Import Location" , /import groovy\.util\.slurpersupport\.(\*|Node)/s                             , /import groovy\.util\.slurpersupport\.(\*|Node)/g           , "import groovy.xml.*\nimport groovy.util.*"),
               new Patch("Fully Qualified Support Node", /(?<!import\s)groovy.util.slurpersupport.Node/s                               , /(?<!import\s)groovy.util.slurpersupport.Node/g             , "slurpersupport.Node"),
               
               new Patch("Tidy Unused XML Imports"     , /(import groovy\.xml\.\*\n)+/s                                                , /(import groovy\.xml\.\*\n)+/g                              , "import\.groovy\.xml\.\*\n"),
               
               new Patch("LazyMap Import Required"     , /^(?!.*import groovy\.json\.internal\.(\*|LazyMap)\n).*LazyMap/s              , /^.*(?<=(\n?import[^\n]*)|(\/\/!\/lib-groovy\/v4\n))/s      , "$&\nimport groovy.json.internal.*"),
               new Patch("LazyMap Import Location"     , /import groovy\.json\.internal\.(\*|LazyMap)/s                                , /import groovy\.json\.internal\.(\*|LazyMap)/g              , "import org.apache.groovy.json.internal.*\nimport groovy.json.internal.*"),
               new Patch("LazyMap Fully Qualified"     , /(?<!import\s)groovy\.json\.internal\.LazyMap/s                               , /(?<!import\s)groovy\.json\.internal\.LazyMap/g             , "LazyMap"),
               
               new Patch("Array Push Comaptibility"    , /\.push\s*\(/s                                                                , /\.push\s*\(/g                                              , ".add("),
               new Patch("Array Pop Comaptibility"     , /\.pop\s*\(/s                                                                 , /([\w.()\[\]]+).pop\s*\(\)/g                                , "$1.remove($1.size() - 1)"),
               
               new Patch("V2 Snippet Location"         , /com\.logicmonitor\.common\.sse\.utils\.GroovyScriptHelper/s                  , /com\.logicmonitor\.common\.sse\.utils\.GroovyScriptHelper/s, "import com.santaba.agent.groovy.utils.GroovyScriptHelper"),
               new Patch("V2 Snippets"                 , /^.*\.getInstance\s*\(\)\._getScript\s*\("Snippets"/s                         , /\.getInstance\s*\(\)\._getScript\s*\("Snippets"/g          , ".getInstance(GroovySystem.version).getScript(\"Snippets\"")];

export function V2toV4(str) {
    for (const patch of patches) {
        if(str.match(patch.check)) {
            if(patch.rgx.global) {
                str = str.replaceAll(patch.rgx, patch.str);
            } else {
                str = str.replace(patch.rgx, patch.str);
            }
            
        }
    }

    return str;
}

export function getPatches() {
    return patches;
}