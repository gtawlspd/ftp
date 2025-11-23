import { generateCanineDeploymentBBCode } from "./generators/canine-deployment.js"
import { generateCanineBiteBBCode } from "./generators/canine-bite.js"
import { generateCanineSearchBBCode } from "./generators/canine-search.js"
import { generateMetroDeploymentBBCode } from "./generators/metro-deployment.js"
import { generatePatrolReportBBCode } from "./generators/patrol-report.js"
import { hideAllSections, populateStaticHandlerInfo, setupDropdowns } from "./utils/ui.js"
import { loadSavedReports } from "./utils/localstorage.js"
import { loadDeploymentTypes } from "./utils/deployment-types.js"

function updateGMTClock() {
  const now = new Date()
  const hours = String(now.getUTCHours()).padStart(2, "0")
  const minutes = String(now.getUTCMinutes()).padStart(2, "0")
  const seconds = String(now.getUTCSeconds()).padStart(2, "0")

  const clockElement = document.getElementById("gmtClock")
  if (clockElement) {
    clockElement.textContent = `${hours}:${minutes}:${seconds}`
  }
}

updateGMTClock()
setInterval(updateGMTClock, 1000)

const setTodayDate = () => {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, "0")
  const day = String(today.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

export function formatDateForBBCode(dateStr) {
  const date = new Date(dateStr)
  const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"]
  const day = String(date.getDate()).padStart(2, "0")
  const month = months[date.getMonth()]
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

function calculateK9Number(badgeNumber) {
  if (!badgeNumber) return ""
  const badgeStr = badgeNumber.toString()
  const lastThree = badgeStr.slice(-3).padStart(3, "0")
  return lastThree
}

window.addEventListener("DOMContentLoaded", () => {
  setupDropdowns()
  loadSavedReports()
  loadDeploymentTypes()
  populateStaticHandlerInfo()
  initializeSettingsToggle()

  document.getElementById("canineDeploymentButton")?.addEventListener("click", (e) => {
    e.preventDefault()
    hideAllSections()
    document.getElementById("cdDate").value = setTodayDate()
    document.getElementById("canineDeploymentGenerator").style.display = "block"
    document.getElementById("canineDeploymentGenerator").scrollIntoView({ behavior: "smooth" })
  })

  document.getElementById("canineBiteButton")?.addEventListener("click", (e) => {
    e.preventDefault()
    hideAllSections()
    document.getElementById("cbDate").value = setTodayDate()
    document.getElementById("canineBiteGenerator").style.display = "block"
    document.getElementById("canineBiteGenerator").scrollIntoView({ behavior: "smooth" })
  })

  document.getElementById("canineSearchButton")?.addEventListener("click", (e) => {
    e.preventDefault()
    hideAllSections()
    document.getElementById("csDate").value = setTodayDate()
    document.getElementById("canineSearchGenerator").style.display = "block"
    document.getElementById("canineSearchGenerator").scrollIntoView({ behavior: "smooth" })
  })

  document.getElementById("metroDeploymentButton")?.addEventListener("click", (e) => {
    e.preventDefault()
    hideAllSections()
    document.getElementById("mdDate").value = setTodayDate()
    document.getElementById("metroDeploymentGenerator").style.display = "block"
    document.getElementById("metroDeploymentGenerator").scrollIntoView({ behavior: "smooth" })
  })

  document.getElementById("patrolReportButton")?.addEventListener("click", (e) => {
    e.preventDefault()
    hideAllSections()
    document.getElementById("prDate").value = setTodayDate()
    document.getElementById("patrolReportGenerator").style.display = "block"
    document.getElementById("patrolReportGenerator").scrollIntoView({ behavior: "smooth" })
  })

  document.getElementById("canineDeploymentBackButton")?.addEventListener("click", () => {
    hideAllSections()
    document.getElementById("mainContent").style.display = "block"
  })

  document.getElementById("canineBiteBackButton")?.addEventListener("click", () => {
    hideAllSections()
    document.getElementById("mainContent").style.display = "block"
  })

  document.getElementById("canineSearchBackButton")?.addEventListener("click", () => {
    hideAllSections()
    document.getElementById("mainContent").style.display = "block"
  })

  document.getElementById("metroDeploymentBackButton")?.addEventListener("click", () => {
    hideAllSections()
    document.getElementById("mainContent").style.display = "block"
  })

  document.getElementById("patrolReportBackButton")?.addEventListener("click", () => {
    hideAllSections()
    document.getElementById("mainContent").style.display = "block"
  })

  document.getElementById("generateCanineDeployment")?.addEventListener("click", (e) => {
    e.preventDefault()
    generateCanineDeploymentBBCode()
    document.getElementById("cdBBCodeOutput")?.scrollIntoView({ behavior: "smooth" })
  })

  document.getElementById("generateCanineBite")?.addEventListener("click", (e) => {
    e.preventDefault()
    generateCanineBiteBBCode()
    document.getElementById("cbBBCodeOutput")?.scrollIntoView({ behavior: "smooth" })
  })

  document.getElementById("generateCanineSearch")?.addEventListener("click", (e) => {
    e.preventDefault()
    generateCanineSearchBBCode()
    document.getElementById("csBBCodeOutput")?.scrollIntoView({ behavior: "smooth" })
  })

  document.getElementById("generateMetroDeployment")?.addEventListener("click", (e) => {
    e.preventDefault()
    generateMetroDeploymentBBCode()
    document.getElementById("mdBBCodeOutput")?.scrollIntoView({ behavior: "smooth" })
  })

  document.getElementById("generatePatrolReport")?.addEventListener("click", (e) => {
    e.preventDefault()
    generatePatrolReportBBCode()
    document.getElementById("prBBCodeOutput")?.scrollIntoView({ behavior: "smooth" })
  })

  document.getElementById("newCanineDeployment")?.addEventListener("click", () => {
    document.getElementById("canineDeploymentForm").reset()
    document.getElementById("cdDate").value = setTodayDate()
  })

  document.getElementById("newCanineBite")?.addEventListener("click", () => {
    document.getElementById("canineBiteForm").reset()
    document.getElementById("cbDate").value = setTodayDate()
  })

  document.getElementById("newCanineSearch")?.addEventListener("click", () => {
    document.getElementById("canineSearchForm").reset()
    document.getElementById("csDate").value = setTodayDate()
  })

  document.getElementById("newMetroDeployment")?.addEventListener("click", () => {
    document.getElementById("metroDeploymentForm").reset()
    document.getElementById("mdDate").value = setTodayDate()
  })

  document.getElementById("newPatrolReport")?.addEventListener("click", () => {
    document.getElementById("patrolReportForm").reset()
    document.getElementById("prDate").value = setTodayDate()
  })

  document.getElementById("formButton")?.addEventListener("click", handleSidebarSaveEdit)
})

function initializeSettingsToggle() {
  const settingsToggleBtn = document.getElementById("settingsToggleBtn")
  const settingsSection = document.querySelector(".settings-section")
  const sidebar = document.getElementById("sidebar")
  const body = document.body

  settingsToggleBtn?.addEventListener("click", () => {
    const isCollapsed = settingsSection.classList.contains("collapsed")

    if (isCollapsed) {
      // Expand settings
      settingsSection.classList.remove("collapsed")
    } else {
      // Collapse settings
      settingsSection.classList.add("collapsed")
    }
  })
}

export function handleSidebarSaveEdit(e) {
  e.preventDefault()
  const form = document.getElementById("officerForm")
  const button = document.getElementById("formButton")
  const settingsSection = document.querySelector(".settings-section")

  if (button.textContent === "SUBMIT") {
    const handlerName = document.getElementById("handlerName").value
    const badgeNumber = document.getElementById("badgeNumber").value
    const k9Name = document.getElementById("k9Name").value
    const k9Specialization = document.getElementById("k9Specialization").value
    const divisionalRank = document.getElementById("divisionalRank").value
    const signatureUrl = document.getElementById("signatureUrl").value

    const k9Number = calculateK9Number(badgeNumber)

    localStorage.setItem("handlerName", handlerName)
    localStorage.setItem("badgeNumber", badgeNumber)
    localStorage.setItem("k9Name", k9Name)
    localStorage.setItem("k9Number", k9Number)
    localStorage.setItem("k9Specialization", k9Specialization)
    localStorage.setItem("divisionalRank", divisionalRank)

    if (signatureUrl) {
      localStorage.setItem("signatureImage", signatureUrl)
    }

    form.innerHTML = `
      <div id="nameAndSerial">
        <span class="static-text">${handlerName}</span><br>
        <span id="serialNumberStatic" class="static-text">#${badgeNumber}</span><br>
        <span class="static-text">K9: ${k9Name} (#${k9Number})</span><br>
        <span class="static-text">${k9Specialization}</span><br>
        <span class="static-text">${divisionalRank}</span>
      </div>
      <button id="formButton" type="submit">EDIT</button>
    `

    setTimeout(() => {
      settingsSection.classList.add("collapsed")
    }, 500)
  } else {
    const handlerName = localStorage.getItem("handlerName") || ""
    const badgeNumber = localStorage.getItem("badgeNumber") || ""
    const k9Name = localStorage.getItem("k9Name") || ""
    const k9Specialization = localStorage.getItem("k9Specialization") || ""
    const divisionalRank = localStorage.getItem("divisionalRank") || ""
    const signatureUrl = localStorage.getItem("signatureImage") || ""

    const k9Number = calculateK9Number(badgeNumber)

    form.innerHTML = `
      <div id="nameAndSerial">
        <input id="handlerName" type="text" placeholder="Handler Name" value="${handlerName}" />
        <input id="badgeNumber" type="text" placeholder="Badge Number" value="${badgeNumber}" />
        <input id="k9Name" type="text" placeholder="K9 Name" value="${k9Name}" />
        <input id="k9Number" type="text" placeholder="K9 Number (auto)" value="${k9Number}" readonly />
        <input id="k9Specialization" type="text" placeholder="K9 Specialization" value="${k9Specialization}" list="k9SpecializationList" />
        <datalist id="k9SpecializationList">
          <option value="FIREARMS">
          <option value="NARCOTICS">
          <option value="EXPLOSIVES">
          <option value="DUAL PURPOSE">
        </datalist>
        <input id="divisionalRank" type="text" placeholder="Divisional Rank" value="${divisionalRank}" />
      </div>
      <label for="signatureUrl" class="signature-label">Signature Image URL (.png)</label>
      <input id="signatureUrl" type="url" placeholder="https://i.imgur.com/example.png" value="${signatureUrl}" />
      <button id="formButton" type="submit">SUBMIT</button>
    `

    setTimeout(() => {
      const badgeInput = document.getElementById("badgeNumber")
      const k9NumberInput = document.getElementById("k9Number")

      badgeInput?.addEventListener("input", (e) => {
        const newK9Number = calculateK9Number(e.target.value)
        if (k9NumberInput) {
          k9NumberInput.value = newK9Number
        }
      })
    }, 0)
  }

  setTimeout(() => {
    document.getElementById("formButton")?.addEventListener("click", handleSidebarSaveEdit)
  }, 0)
}
