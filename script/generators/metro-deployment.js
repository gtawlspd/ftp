import { formatDateForBBCode } from "../main.js"
import { saveReport } from "../utils/localstorage.js"

export function generateMetroDeploymentBBCode() {
  const getValue = (id) => document.getElementById(id)?.value || ""
  const getChecked = (id) => document.getElementById(id)?.checked || false

  const handlerName = localStorage.getItem("handlerName") || ""
  const signatureImage = localStorage.getItem("signatureImage") || ""

  const dPlatoon = getChecked("mdDPlatoon")
  const k9Platoon = getChecked("mdK9Platoon")
  const hPlatoon = getChecked("mdHPlatoon")
  const bombSquad = getChecked("mdBombSquad")
  const incidentCommander = getValue("mdIncidentCommander")
  const crisisNegotiator = getValue("mdCrisisNegotiator")
  const tacticalCommander = getValue("mdTacticalCommander")
  const involvedMembers = getValue("mdInvolvedMembers")
  const deploymentType = getValue("mdDeploymentType")
  const date = formatDateForBBCode(getValue("mdDate"))
  const location = getValue("mdLocation")
  const startTime = getValue("mdStartTime")
  const endTime = getValue("mdEndTime")
  const timeline = getValue("mdTimeline")
  const injuredTeamMembers = getValue("mdInjuredTeamMembers")
  const suspectCasualties = getValue("mdSuspectCasualties")
  const civilianCasualties = getValue("mdCivilianCasualties")

  const membersArray = involvedMembers.split("\n").filter((m) => m.trim())
  let membersList = ""
  if (membersArray.length > 0) {
    membersList = `* ${membersArray[0].trim()}`
    for (let i = 1; i < membersArray.length; i++) {
      membersList += `\n[*] ${membersArray[i].trim()}`
    }
  }

  const timelineArray = timeline.split("\n").filter((t) => t.trim())
  let timelineList = ""
  if (timelineArray.length > 0) {
    timelineList = `* ${timelineArray[0].trim()}`
    for (let i = 1; i < timelineArray.length; i++) {
      timelineList += `\n[*] ${timelineArray[i].trim()}`
    }
  }

  const injuredArray = injuredTeamMembers.split("\n").filter((i) => i.trim())
  let injuredList = ""
  if (injuredArray.length > 0) {
    injuredList = `* ${injuredArray[0].trim()}`
    for (let i = 1; i < injuredArray.length; i++) {
      injuredList += `\n[*] ${injuredArray[i].trim()}`
    }
  } else {
    injuredList = "* None"
  }

  let bbcode = ""
  bbcode += "[divbox2=transparent]\n\n"
  bbcode +=
    "[aligntable=right,350,0,0,0,0,0][center][lspdlogo=150][/lspdlogo][metrologo=150][/metrologo][/center][/aligntable]\n\n\n"
  bbcode += "[br][/br]\n"
  bbcode += "[center][size=170][b]METROPOLITAN DIVISION[/b][/size]\n"
  bbcode += "[size=150]DEPLOYMENT REPORT[/size][/center]\n"
  bbcode += "[br]\n\n\n"
  bbcode += "[divbox=black][b][size=150][color=#FFFFFF]1. GENERAL INFORMATION[/color][/size][/b]\n"
  bbcode += "[/divbox]\n"
  bbcode += "[indent=10][u]1.1[/u] [b]INVOLVED PLATOONS: [/b]\n"
  bbcode += `[list]D Platoon [cb${dPlatoon ? "c" : ""}][/cb${dPlatoon ? "c" : ""}]\n`
  bbcode += `K-9 Platoon [cb${k9Platoon ? "c" : ""}][/cb${k9Platoon ? "c" : ""}]\n`
  bbcode += `H Platoon [cb${hPlatoon ? "c" : ""}][/cb${hPlatoon ? "c" : ""}]\n`
  bbcode += `Bomb Squad [cb${bombSquad ? "c" : ""}][/cb${bombSquad ? "c" : ""}]\n`
  bbcode += "[/list]\n\n"
  bbcode += "[u]1.2[/u] [b]INCIDENT COMMAND:[/b]\n"
  bbcode += "[list]"

  if (incidentCommander) {
    bbcode += `[*] [b]INCIDENT COMMANDER (if applicable):[/b] ${incidentCommander}\n`
  }
  if (crisisNegotiator) {
    bbcode += `[*] [b]CRISIS NEGOTIATOR (if applicable):[/b] ${crisisNegotiator}\n`
  }

  bbcode += "[*] [b]TACTICAL COMMANDER:[/b]\n"
  bbcode += `[list][*] ${tacticalCommander}[/list][/list]\n\n`
  bbcode += "[u]1.3[/u] [b]INVOLVED METROPOLITAN MEMBERS: [/b]\n"
  bbcode += `[list]${membersList}[/list]\n\n`
  bbcode += `[u]1.4[/u] [b]DEPLOYMENT TYPE:[/b] ${deploymentType}[/indent]\n`
  bbcode += "[divbox=black][b][size=150][color=#FFFFFF]2. DEPLOYMENT TIMELINE[/color][/size][/b]\n"
  bbcode += "[/divbox]\n"
  bbcode += `[indent=10][u]2.1[/u] [b]DATE: [/b] ${date}\n`
  bbcode += `[u]2.2[/u] [b]LOCATION: [/b] ${location}\n`
  bbcode += "[u]2.3[/u] [b]TIMELINE:[/b]\n"
  bbcode += `[list][*][b]START OF DEPLOYMENT:[/b] ${startTime}\n`
  bbcode += `[list]${timelineList}[/list]\n`
  bbcode += `[*][b]END OF DEPLOYMENT:[/b] ${endTime}[/list][/indent]\n`
  bbcode += "[divbox=black][b][size=150][color=#FFFFFF]3. CASUALTY & INJURY INFORMATION[/color][/size][/b][/divbox]\n"
  bbcode += "[indent=10][u]3.1[/u] [b]INJURED TEAM MEMBERS: [/b]\n"
  bbcode += `[list]${injuredList}[/list]\n\n`
  bbcode += `[u]3.3[/u] [b]SUSPECT CASUALTIES:[/b] ${suspectCasualties || "None"}\n`
  bbcode += `[u]3.4[/u] [b]CIVILIAN CASUALTIES:[/b] ${civilianCasualties || "None"}[/indent]\n`
  bbcode += "[br][/br]\n"
  bbcode += "[divbox=black][/divbox]\n"
  bbcode += "[br][/br]\n"
  bbcode += "[aligntable=left,200,0,0,0,0,0][center][b]FILING OFFICER SIGNATURE[/b]\n"

  if (signatureImage) {
    bbcode += `[i][img]${signatureImage}[/img][/i]\n`
    bbcode += `[i]${handlerName}[/i][/center]\n`
  } else {
    bbcode += `[i]${handlerName}[/i][/center]\n`
  }

  bbcode += "[/aligntable][aligntable=left,721,0,0,0,0,0]\n"
  bbcode += "[/aligntable]\n"
  bbcode += "[br][/br]\n"
  bbcode += "[br][/br]\n"
  bbcode += "[/divbox2]"

  const outputElem = document.getElementById("mdBBCodeOutput")
  outputElem.value = bbcode
  outputElem.select()

  try {
    navigator.clipboard?.writeText(bbcode)
  } catch (err) {
    console.error("Clipboard copy failed", err)
  }

  saveReport("metroDeployment", {
    handlerName,
    date,
    deploymentType,
    location,
  })
}
