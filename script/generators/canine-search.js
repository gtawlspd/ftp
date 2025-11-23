import { formatDateForBBCode } from "../main.js"
import { saveReport } from "../utils/localstorage.js"

export function generateCanineSearchBBCode() {
  const getValue = (id) => document.getElementById(id)?.value || ""

  const handlerName = localStorage.getItem("handlerName") || ""
  const signatureImage = localStorage.getItem("signatureImage") || ""

  const incidentCommander = getValue("csIncidentCommander")
  const location = getValue("csLocation")
  const teamLeader = getValue("csTeamLeader")
  const canineHandlers = getValue("csCanineHandlers")
  const deploymentType = getValue("csDeploymentType")
  const date = formatDateForBBCode(getValue("csDate"))
  const timeStarted = getValue("csTimeStarted")
  const timeEnded = getValue("csTimeEnded")
  const narrative = getValue("csNarrative")

  const handlersArray = canineHandlers.split("\n").filter((h) => h.trim())
  let handlersList = ""
  if (handlersArray.length > 0) {
    handlersList = `* ${handlersArray[0].trim()}`
    for (let i = 1; i < handlersArray.length; i++) {
      handlersList += `\n[*] ${handlersArray[i].trim()}`
    }
  }

  let bbcode = ""
  bbcode += "[divbox2=transparent]\n\n"
  bbcode +=
    "[aligntable=right,350,0,0,0,0,0][center][lspdlogo=150][/lspdlogo][metrologo=150][/metrologo][/center][/aligntable]\n\n\n"
  bbcode += "[br][/br]\n"
  bbcode += "[center][size=170][b]METROPOLITAN DIVISION[/b][/size]\n"
  bbcode += "[size=150]K-9 SEARCH REPORT[/size][/center]\n"
  bbcode += "[br]\n\n\n"
  bbcode += "[divbox=black][b][size=150][color=#FFFFFF]1. GENERAL INFORMATION[/color][/size][/b]\n"
  bbcode += "[/divbox]\n"
  bbcode += "[indent=10][u]1.1[/u] [b]INCIDENT INFORMATION:[/b][list]\n"

  if (incidentCommander) {
    bbcode += `[*] [b]INCIDENT COMMANDER (if applicable):[/b] ${incidentCommander}\n`
  }

  bbcode += `[*] [b]LOCATION:[/b] ${location}[/list]\n\n`
  bbcode += "[u]1.2[/u] [b]INVOLVED PERSONNEL:[/b][list=none]\n"
  bbcode += "[b]TEAM LEADER:[/b]\n"
  bbcode += `[list][*] ${teamLeader}[/list]\n\n`
  bbcode += `[b]CANINE HANDLER(S):[/b][list]${handlersList}[/list][/list]\n\n`
  bbcode += `[u]1.3[/u] [b]TYPE OF DEPLOYMENT:[/b] ${deploymentType}[/indent]\n`
  bbcode += "[divbox=black][b][size=150][color=#FFFFFF]2. DEPLOYMENT TIMELINE[/color][/size][/b]\n"
  bbcode += "[/divbox]\n"
  bbcode += `[indent=10][u]2.1[/u] [b]DATE:[/b] ${date}\n`
  bbcode += `[u]2.2[/u] [b]TIME STARTED:[/b] ${timeStarted}\n`
  bbcode += `[u]2.3[/u] [b]TIME ENDED:[/b] ${timeEnded}[/indent]\n`
  bbcode += "[divbox=black][b][size=150][color=#FFFFFF]3. SEARCH NARRATIVE[/color][/size][/b][/divbox]\n"
  bbcode += `[indent=10][u]3.1[/u] [b]DETAILED NARRATIVE:[/b]\n`
  bbcode += `[list=none]${narrative}[/list][/indent]\n`
  bbcode += "[divbox=black][/divbox]\n"
  bbcode += "[br][/br]\n"
  bbcode += "[center][b]FILING OFFICER SIGNATURE[/b]\n"

  if (signatureImage) {
    bbcode += `[i][img]${signatureImage}[/img][/i]\n`
    bbcode += `[i]${handlerName}[/i][/center]\n`
  } else {
    bbcode += `[i]${handlerName}[/i][/center]\n`
  }

  bbcode += "[br][/br]\n"
  bbcode += "[/divbox2]"

  const outputElem = document.getElementById("csBBCodeOutput")
  outputElem.value = bbcode
  outputElem.select()

  try {
    navigator.clipboard?.writeText(bbcode)
  } catch (err) {
    console.error("Clipboard copy failed", err)
  }

  saveReport("canineSearch", {
    handlerName,
    date,
    deploymentType,
    location,
  })
}
