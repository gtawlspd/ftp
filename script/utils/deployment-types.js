const deploymentTypes = [
  "Search Warrant Execution",
  "Arrest Warrant Execution",
  "Property Search",
  "Vehicle Search",
  "Area Search",
  "Property Alarm",
  "Civil Disturbance Deployment",
  "Riot Control Deployment",
  "Protest Demonstration",
  "Event Deployment",
  "Active Drive-By Deployment",
  "Active Shooter Deployment",
  "Barricaded Suspect",
  "Protection Detail",
  "Manhunt",
  "Panic Alarm",
  "Officer Needs Help Response",
  "TAC-ALERT",
  "Scene Security",
  "Mobile Kidnapping",
  "Hostage Situation",
  "Covert Operation",
  "Bomb Threat",
  "Suspicious Package",
  "Bomb Disposal",
  "Explosive Device Investigation",
  "Explosive Ordinance Disposal",
  "IED Incident",
  "Explosive Materials Incident",
  "Detonation of Explosives",
  "Explosive Device Safety Assessment",
]

export function loadDeploymentTypes() {
  const datalist1 = document.getElementById("deploymentTypesList")
  const datalist2 = document.getElementById("mdDeploymentTypesList")

  if (datalist1) {
    deploymentTypes.forEach((type) => {
      const option = document.createElement("option")
      option.value = type
      datalist1.appendChild(option)
    })
  }

  if (datalist2) {
    deploymentTypes.forEach((type) => {
      const option = document.createElement("option")
      option.value = type
      datalist2.appendChild(option)
    })
  }
}
