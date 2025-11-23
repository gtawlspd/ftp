import { hideAllSections } from "./ui.js"

export function saveReport(type, data) {
  const report = {
    type,
    title: "",
    data,
  }

  if (type === "canineDeployment") {
    report.title = `${data.handlerName} - Deployment - ${data.date} ${data.time}`
  } else if (type === "canineBite") {
    report.title = `${data.handlerName} - Bite - ${data.date} ${data.time}`
  } else if (type === "canineSearch") {
    report.title = `${data.handlerName} - Search - ${data.date}`
  } else if (type === "metroDeployment") {
    report.title = `Metro Deployment - ${data.date}`
  } else if (type === "patrolReport") {
    report.title = `Patrol - ${data.date}`
  }

  const savedReports = JSON.parse(localStorage.getItem("savedReports") || "[]")
  savedReports.push(report)
  localStorage.setItem("savedReports", JSON.stringify(savedReports))
  loadSavedReports()
}

export function loadSavedReports() {
  const reports = JSON.parse(localStorage.getItem("savedReports") || "[]")
  const dropdown = document.getElementById("savedReportsDropdown")

  if (!dropdown) return

  dropdown.innerHTML = ""

  reports.forEach((report) => {
    const wrapper = document.createElement("div")
    wrapper.className = "report-entry"

    const a = document.createElement("a")
    a.href = "#"
    a.textContent = report.title
    a.style.flex = "1"
    a.addEventListener("click", (e) => {
      e.preventDefault()
      loadReport(report)
    })

    const del = document.createElement("button")
    del.textContent = "❌"
    del.title = "Delete Report"
    del.className = "delete-report-btn"
    del.addEventListener("click", (e) => {
      e.stopPropagation()
      if (confirm(`Delete "${report.title}"?`)) {
        deleteReport(report.title)
      }
    })

    wrapper.appendChild(a)
    wrapper.appendChild(del)
    dropdown.appendChild(wrapper)
  })
}

export function loadReport(report) {
  hideAllSections()
  // Implementation for loading saved reports - basic structure
  console.log("Loading report:", report)
}

export function deleteReport(title) {
  const savedReports = JSON.parse(localStorage.getItem("savedReports") || "[]")
  const filtered = savedReports.filter((r) => r.title !== title)
  localStorage.setItem("savedReports", JSON.stringify(filtered))
  loadSavedReports()
}
