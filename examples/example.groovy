import com.logicmonitor.common.sse.utils.GroovyScriptHelper as GSH
import com.logicmonitor.mod.Snippets

def loader = GSH.getInstance()._getScript("Snippets", Snippets.getLoader())
def remote = loader.load("lm.remote").create(hostProps)

def str = remote.exec("show config -xml")

def array = []
array.push("test")
array.pop()

def xml = new XmlSlurper().parseText(str)

print xml.config

return 0