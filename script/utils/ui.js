export function hideAllSections() {
  document.getElementById("mainContent").style.display = "none"
  document.getElementById("canineDeploymentGenerator").style.display = "none"
  document.getElementById("canineBiteGenerator").style.display = "none"
  document.getElementById("canineSearchGenerator").style.display = "none"
  document.getElementById("metroDeploymentGenerator").style.display = "none"
  document.getElementById("patrolReportGenerator").style.display = "none"
}

export function populateStaticHandlerInfo() {
  const handlerName = localStorage.getItem("handlerName")
  const badgeNumber = localStorage.getItem("badgeNumber")
  const k9Name = localStorage.getItem("k9Name")
  const k9Number = localStorage.getItem("k9Number")
  const divisionalRank = localStorage.getItem("divisionalRank")

  if (handlerName && badgeNumber && k9Name && k9Number && divisionalRank) {
    const form = document.getElementById("officerForm")
    form.innerHTML = `
      <div id="nameAndSerial">
        <span class="static-text">${handlerName}</span><br>
        <span id="serialNumberStatic" class="static-text">#${badgeNumber}</span><br>
        <span class="static-text">K9: ${k9Name} (#${k9Number})</span><br>
        <span class="static-text">${divisionalRank}</span>
      </div>
      <button id="formButton" type="submit">EDIT</button>
    `

    setTimeout(() => {
      const { handleSidebarSaveEdit } = require("../main.js")
      document.getElementById("formButton")?.addEventListener("click", handleSidebarSaveEdit)
    }, 0)
  }
}

export function setupDropdowns() {
  const dropdowns = document.querySelectorAll(".dropdown")
  dropdowns.forEach((dropdown) => {
    const btn = dropdown.querySelector(".dropdown-btn")
    btn?.addEventListener("click", () => {
      dropdown.classList.toggle("active")
    })
  })
}
