import { formatDateForBBCode } from "../main.js"
import { saveReport } from "../utils/localstorage.js"

export function generateCanineBiteBBCode() {
  const getValue = (id) => document.getElementById(id)?.value || ""

  const handlerName = localStorage.getItem("handlerName") || ""
  const k9Name = localStorage.getItem("k9Name") || ""
  const k9Number = localStorage.getItem("k9Number") || ""
  const divisionalRank = localStorage.getItem("divisionalRank") || ""
  const badgeNumber = localStorage.getItem("badgeNumber") || ""
  const signatureImage = localStorage.getItem("signatureImage") || ""

  const date = formatDateForBBCode(getValue("cbDate"))
  const time = getValue("cbTime")
  const nameOfBitten = getValue("cbNameOfBitten")
  const extentOfInjuries = getValue("cbExtentOfInjuries")
  const fdAttendance = getValue("cbFDAttendance")
  const otherOfficers = getValue("cbOtherOfficers")
  const narrative = getValue("cbNarrative")

  const officersArray = otherOfficers.split("\n").filter((o) => o.trim())

  let officersList = ""
  if (officersArray.length > 0) {
    officersList = `* ${officersArray[0].trim()}`
    for (let i = 1; i < officersArray.length; i++) {
      officersList += `\n[*] ${officersArray[i].trim()}`
    }
  } else {
    officersList = "* N/A"
  }

  let bbcode = ""
  bbcode += "[divbox2=transparent]\n"
  bbcode += "[aligntable=right,250,0,0,0,0,0][center][metrologo=150][k9platlogo=150][/center][/aligntable]\n\n\n"
  bbcode += "[br][/br]\n"
  bbcode += "[indent=10][size=150][b]METROPOLITAN DIVISION[/b][/size]\n"
  bbcode += "[size=130]CANINE BITE REPORT[/size][/indent]\n"
  bbcode += "[br][/br]\n\n\n"
  bbcode += "[divbox=black][b][size=150][color=#FFFFFF]1. GENERAL INFORMATION[/color][/size][/b]\n"
  bbcode += "[/divbox]\n"
  bbcode += `[indent=10][b]1.1 | NAME & ASSIGNED K-9:[/b] ${handlerName}, K9-${k9Number} ${k9Name}\n`
  bbcode += `[b]1.2 | DIVISIONAL RANK:[/b] ${divisionalRank}\n`
  bbcode += `[b]1.3 | SERIAL NUMBER:[/b] ${badgeNumber}[/indent]\n\n`
  bbcode += "[divbox=black][b][size=150][color=#FFFFFF]2. INCIDENT SUMMARY[/color][/size][/b]\n"
  bbcode += "[/divbox]\n"
  bbcode += `[indent=10][b]2.1 | DATE & TIME:[/b] ${date} - ${time}\n`
  bbcode += `[b]2.2 | NAME OF BITTEN:[/b] ${nameOfBitten}\n`
  bbcode += `[b]2.3 | EXTENT OF INJURIES:[/b] ${extentOfInjuries}\n`
  bbcode += `[b]2.4 | FD ATTENDANCE:[/b] ${fdAttendance}[/indent]\n\n`
  bbcode += "[divbox=black][b][size=150][color=#FFFFFF]3. INCIDENT NARRATIVE[/color][/size][/b]\n"
  bbcode += "[/divbox]\n"
  bbcode += "[indent=10][b]3.1 | OTHER OFFICERS ONSCENE:[/b]\n"
  bbcode += `[list]${officersList}[/list]\n`
  bbcode += "[b]3.2 | NARRATIVE:[/b]\n\n"
  bbcode += `${narrative}\n\n`
  bbcode += "[b]3.3 | SIGNATURE:[/b]\n\n"

  if (signatureImage) {
    bbcode += `[img]${signatureImage}[/img]\n`
    bbcode += `${handlerName}[/indent]\n`
  } else {
    bbcode += `${handlerName}[/indent]\n`
  }

  bbcode += "[/divbox2]"

  const outputElem = document.getElementById("cbBBCodeOutput")
  outputElem.value = bbcode
  outputElem.select()

  try {
    navigator.clipboard?.writeText(bbcode)
  } catch (err) {
    console.error("Clipboard copy failed", err)
  }

  saveReport("canineBite", {
    handlerName,
    k9Name,
    date,
    time,
    nameOfBitten,
  })
}
