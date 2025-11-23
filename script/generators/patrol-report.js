import { formatDateForBBCode } from "../main.js"
import { saveReport } from "../utils/localstorage.js"

export function generatePatrolReportBBCode() {
  const getValue = (id) => document.getElementById(id)?.value || ""
  const getChecked = (id) => document.getElementById(id)?.checked || false

  const date = formatDateForBBCode(getValue("prDate"))
  const officers = getValue("prOfficers")
  const caninePatrol = getChecked("prCaninePatrol")
  const swatPatrol = getChecked("prSWATPatrol")
  const jointPatrol = getChecked("prJointPatrol")
  const gangPatrol = getChecked("prGangPatrol")
  const deployments = getValue("prDeployments")
  const additionalInfo = getValue("prAdditionalInfo")

  const officersList = officers
    .split("\n")
    .filter((o) => o.trim())
    .join("\n")

  const deploymentLines = deployments
    .split("\n")
    .filter((d) => d.trim())
    .map((line) => {
      line = line.trim()
      // Check if line contains URL format: url|name
      if (line.includes("|")) {
        const [url, name] = line.split("|").map((s) => s.trim())
        return `[url=${url}]${name}[/url]`
      }
      return line
    })

  let deploymentsFormatted = ""
  if (deploymentLines.length > 0) {
    deploymentsFormatted = `[list]* ${deploymentLines[0]}`
    for (let i = 1; i < deploymentLines.length; i++) {
      deploymentsFormatted += `\n[*] ${deploymentLines[i]}`
    }
    deploymentsFormatted += "[/list]"
  }

  let bbcode = ""
  bbcode += "[divbox2=transparent][font=Arial][center]LOS SANTOS POLICE DEPARTMENT\n"
  bbcode += "[size=120][b]METROPOLITAN DIVISION\n"
  bbcode += "PATROL REPORT[/b][/size][/center]\n\n"
  bbcode += "[b]1. Date of Patrol[/b] \n"
  bbcode += `${date}\n\n`
  bbcode += "[b]2. Officers[/b]\n"
  bbcode += `${officersList}\n\n`
  bbcode += "[b]3. Patrol Type[/b]\n"
  bbcode += `[cb${caninePatrol ? "c" : ""}][/cb${caninePatrol ? "c" : ""}] Canine Patrol\n`
  bbcode += `[cb${swatPatrol ? "c" : ""}][/cb${swatPatrol ? "c" : ""}] SWAT Crime Suppression Patrol\n`
  bbcode += `[cb${jointPatrol ? "c" : ""}][/cb${jointPatrol ? "c" : ""}] Joint Crime Suppression Patrol\n`
  bbcode += `[cb${gangPatrol ? "c" : ""}][/cb${gangPatrol ? "c" : ""}] Gang Crime Suppression Patrol\n\n`
  bbcode += "[b]4. Deployments[/b]\n"
  bbcode += `${deploymentsFormatted}\n\n`
  bbcode += "[b]5. Additional Information[/b]\n"
  bbcode += `${additionalInfo}\n[/font][/divbox2]`

  const outputElem = document.getElementById("prBBCodeOutput")
  outputElem.value = bbcode
  outputElem.select()

  try {
    navigator.clipboard?.writeText(bbcode)
  } catch (err) {
    console.error("Clipboard copy failed", err)
  }

  saveReport("patrolReport", {
    date,
    officers: officers.split("\n")[0],
  })
}
