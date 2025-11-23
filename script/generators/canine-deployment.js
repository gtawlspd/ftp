import { formatDateForBBCode } from "../main.js"
import { saveReport } from "../utils/localstorage.js"

export function generateCanineDeploymentBBCode() {
  const getValue = (id) => document.getElementById(id)?.value || ""

  const handlerName = localStorage.getItem("handlerName") || ""
  const k9Name = localStorage.getItem("k9Name") || ""
  const k9Number = localStorage.getItem("k9Number") || ""
  const divisionalRank = localStorage.getItem("divisionalRank") || ""
  const badgeNumber = localStorage.getItem("badgeNumber") || ""
  const signatureImage = localStorage.getItem("signatureImage") || ""

  const date = formatDateForBBCode(getValue("cdDate"))
  const time = getValue("cdTime")
  const location = getValue("cdLocation")
  const searchType = getValue("cdSearchType")
  const k9Specialization = getValue("cdK9Specialization")
  const positiveAlert = getValue("cdPositiveAlert")
  const itemsLocated = getValue("cdItemsLocated")
  const narrative = getValue("cdNarrative")

  let bbcode = ""
  bbcode += "[divbox2=transparent]\n"
  bbcode += "[aligntable=right,250,0,0,0,0,0][center][metrologo=150][k9platlogo=150][/center][/aligntable]\n\n\n\n"
  bbcode += "[br][/br]\n"
  bbcode += "[indent=10][size=150][b]METROPOLITAN DIVISION[/b][/size]\n"
  bbcode += "[size=130]CANINE DEPLOYMENT REPORT[/size][/indent]\n"
  bbcode += "[br][/br]\n\n\n"
  bbcode += "[divbox=black][b][size=150][color=#FFFFFF]1. GENERAL INFORMATION[/color][/size][/b]\n"
  bbcode += "[/divbox]\n"
  bbcode += `[indent=10][b]1.1 | HANDLER NAME:[/b] ${handlerName}\n`
  bbcode += `[b]1.2 | K-9 NAME:[/b] ${k9Name}\n`
  bbcode += `[b]1.3 | K-9 SPECIALIZATION:[/b] ${k9Specialization}\n`
  bbcode += `[b]1.4 | DIVISIONAL RANK:[/b] ${divisionalRank}\n`
  bbcode += `[b]1.5 | SERIAL NUMBER:[/b] ${badgeNumber} [/indent]\n\n`
  bbcode += "[divbox=black][b][size=150][color=#FFFFFF]2. INCIDENT SUMMARY[/color][/size][/b]\n"
  bbcode += "[/divbox]\n"
  bbcode += `[indent=10][b]2.1 | DATE & TIME:[/b] ${date} - ${time}\n`
  bbcode += `[b]2.2 | LOCATION OF DEPLOYMENT:[/b] ${location}\n`
  bbcode += `[b]2.3 | TYPE OF SEARCH:[/b] ${searchType}\n`
  bbcode += `[b]2.4 | POSITIVE ALERT:[/b] ${positiveAlert}\n`
  bbcode += `[b]2.5 | ITEMS LOCATED:[/b] ${itemsLocated}[/indent]\n\n`
  bbcode += "[divbox=black][b][size=150][color=#FFFFFF]3. INCIDENT NARRATIVE[/color][/size][/b]\n"
  bbcode += "[/divbox]\n"
  bbcode += `[indent=10][b]3.1 | NARRATIVE:[/b]\n\n`
  bbcode += `${narrative}\n\n`

  if (signatureImage) {
    bbcode += `[b]3.2 | SIGNATURE:[/b]\n\n`
    bbcode += `[img]${signatureImage}[/img]\n`
    bbcode += `${handlerName}\n`
  } else {
    bbcode += `[b]3.2 | SIGNATURE:[/b] ${handlerName}\n`
  }

  bbcode += "[/indent]\n"
  bbcode += "[/divbox2]"

  const outputElem = document.getElementById("cdBBCodeOutput")
  outputElem.value = bbcode
  outputElem.select()

  try {
    navigator.clipboard?.writeText(bbcode)
  } catch (err) {
    console.error("Clipboard copy failed", err)
  }

  saveReport("canineDeployment", {
    handlerName,
    k9Name,
    date,
    time,
    location,
  })
}
