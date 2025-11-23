// Auto-save configuration
const AUTOSAVE_DELAY = 1000 // 1 second after typing stops
const UNDO_HISTORY_LIMIT = 50 // Maximum undo states to keep
const DELETE_CONFIRMATION_DELAY = 3000 // 3 seconds to wait before confirming manual deletion

// Undo history storage
const undoHistory = {
  orientation: [],
  dor: [],
  weekly: [],
  ftofile: [],
}

const undoPointer = {
  orientation: -1,
  dor: -1,
  weekly: -1,
  ftofile: -1,
}

// Auto-save timers
const autosaveTimers = {}
const deleteConfirmationTimers = {}

const manualClearFlags = {
  orientation: false,
  dor: false,
  weekly: false,
  ftofile: false,
}

const lastContentState = {
  orientation: null,
  dor: null,
  weekly: null,
  ftofile: null,
}

const PREFILLED_FIELDS = {
  orientation: ["oriFTO", "oriFTOSerial", "oriDate"],
  dor: ["dorFTO", "dorFTOSerial", "dorDate"],
  weekly: ["weeklyDate", "weeklyFTM", "weeklyFTMSerial"],
  ftofile: ["ftoFileName", "ftoFileSerial", "ftoFileTime"],
}

/**
 * Save current form state to localStorage for crash recovery
 */
export function autoSaveFormState(formType) {
  const state = captureFormState(formType)
  if (state) {
    localStorage.setItem(`autosave_${formType}`, JSON.stringify(state))
    lastContentState[formType] = JSON.stringify(state.data)
  }
}

/**
 * Load auto-saved form state
 */
export function loadAutoSavedState(formType) {
  const saved = localStorage.getItem(`autosave_${formType}`)
  if (saved) {
    try {
      return JSON.parse(saved)
    } catch (e) {
      console.error("Failed to load autosave:", e)
    }
  }
  return null
}

/**
 * Clear auto-saved state after successful submit
 */
export function clearAutoSave(formType) {
  localStorage.removeItem(`autosave_${formType}`)
  manualClearFlags[formType] = false
  lastContentState[formType] = null
}

export function markFormAsCleared(formType) {
  manualClearFlags[formType] = true
  clearAutoSave(formType)
  undoHistory[formType] = []
  undoPointer[formType] = -1
}

/**
 * Capture current form state
 */
function captureFormState(formType) {
  const state = { formType, timestamp: Date.now(), data: {} }

  if (formType === "orientation") {
    state.data = {
      officer: document.getElementById("oriOfficer")?.value || "",
      officerSerial: document.getElementById("oriOfficerSerial")?.value || "",
      fto: document.getElementById("oriFTO")?.value || "",
      ftoSerial: document.getElementById("oriFTOSerial")?.value || "",
      patrol: document.getElementById("oriPatrolNumber")?.value || "",
      date: document.getElementById("oriDate")?.value || "",
      time: document.getElementById("oriTime")?.value || "",
      duration: document.getElementById("oriDuration")?.value || "",
      incidents: document.getElementById("oriIncidentsTasks")?.value || "",
      ratings: {},
    }
    for (let i = 1; i <= 8; i++) {
      const checked = document.querySelector(`input[name="oriRating${i}"]:checked`)
      state.data.ratings[`oriRating${i}`] = checked ? checked.value : ""
    }
  } else if (formType === "dor") {
    state.data = {
      officer: document.getElementById("dorOfficer")?.value || "",
      officerSerial: document.getElementById("dorOfficerSerial")?.value || "",
      fto: document.getElementById("dorFTO")?.value || "",
      ftoSerial: document.getElementById("dorFTOSerial")?.value || "",
      patrol: document.getElementById("dorPatrolNumber")?.value || "",
      date: document.getElementById("dorDate")?.value || "",
      time: document.getElementById("dorTime")?.value || "",
      duration: document.getElementById("dorDuration")?.value || "",
      incidents: document.getElementById("dorIncidentsTasks")?.value || "",
      belowStandard: document.getElementById("dorBelowStandard")?.value || "",
      aboveStandard: document.getElementById("dorAboveStandard")?.value || "",
      learningGoals: document.getElementById("dorLearningGoalsExplain")?.value || "",
      roleplay: document.getElementById("dorRoleplayRemarks")?.value || "",
      ratings: {},
    }
    for (let i = 1; i <= 17; i++) {
      const checked = document.querySelector(`input[name="dorRating${i}"]:checked`)
      state.data.ratings[`dorRating${i}`] = checked ? checked.value : ""
    }
  } else if (formType === "weekly") {
    state.data = {
      officer: document.getElementById("weeklyOfficer")?.value || "",
      officerSerial: document.getElementById("weeklyOfficerSerial")?.value || "",
      date: document.getElementById("weeklyDate")?.value || "",
      ftm: document.getElementById("weeklyFTM")?.value || "",
      ftmSerial: document.getElementById("weeklyFTMSerial")?.value || "",
      discussion: document.getElementById("weeklyDiscussion")?.value || "",
      strengthsDiscussion: document.getElementById("strengthsDiscussionStatus")?.value || "",
      weaknessesDiscussion: document.getElementById("weaknessesDiscussionStatus")?.value || "",
      remedialRequired: document.getElementById("remedialRequired")?.value || "",
      remedialDetails: document.getElementById("remedialDetails")?.value || "",
      performance: document.getElementById("weeklyPerformanceSelect")?.value || "",
      ratings: {},
    }
    for (let i = 1; i <= 17; i++) {
      const checked = document.querySelector(`input[name="weeklyRating${i}"]:checked`)
      state.data.ratings[`weeklyRating${i}`] = checked ? checked.value : ""
    }
  } else if (formType === "ftofile") {
    state.data = {
      name: document.getElementById("ftoFileName")?.value || "",
      serial: document.getElementById("ftoFileSerial")?.value || "",
      division: document.getElementById("ftoFileDivision")?.value || "",
      time: document.getElementById("ftoFileTime")?.value || "",
    }
  }

  return state
}

/**
 * Restore form state
 */
export function restoreFormState(state) {
  if (!state || !state.data) return

  const formType = state.formType
  const data = state.data

  if (formType === "orientation") {
    document.getElementById("oriOfficer").value = data.officer
    document.getElementById("oriOfficerSerial").value = data.officerSerial
    // document.getElementById("oriFTO").value = data.fto
    // document.getElementById("oriFTOSerial").value = data.ftoSerial
    document.getElementById("oriPatrolNumber").value = data.patrol
    // document.getElementById("oriDate").value = data.date
    document.getElementById("oriTime").value = data.time
    document.getElementById("oriDuration").value = data.duration
    document.getElementById("oriIncidentsTasks").value = data.incidents
    for (let i = 1; i <= 8; i++) {
      const value = data.ratings[`oriRating${i}`]
      if (value) {
        const radio = document.querySelector(`input[name="oriRating${i}"][value="${value}"]`)
        if (radio) radio.checked = true
      }
    }
  } else if (formType === "dor") {
    document.getElementById("dorOfficer").value = data.officer
    document.getElementById("dorOfficerSerial").value = data.officerSerial
    // document.getElementById("dorFTO").value = data.fto
    // document.getElementById("dorFTOSerial").value = data.ftoSerial
    document.getElementById("dorPatrolNumber").value = data.patrol
    // document.getElementById("dorDate").value = data.date
    document.getElementById("dorTime").value = data.time
    document.getElementById("dorDuration").value = data.duration
    document.getElementById("dorIncidentsTasks").value = data.incidents
    document.getElementById("dorBelowStandard").value = data.belowStandard
    document.getElementById("dorAboveStandard").value = data.aboveStandard
    document.getElementById("dorLearningGoalsExplain").value = data.learningGoals
    document.getElementById("dorRoleplayRemarks").value = data.roleplay
    for (let i = 1; i <= 17; i++) {
      const value = data.ratings[`dorRating${i}`]
      if (value) {
        const radio = document.querySelector(`input[name="dorRating${i}"][value="${value}"]`)
        if (radio) radio.checked = true
      }
    }
  } else if (formType === "weekly") {
    document.getElementById("weeklyOfficer").value = data.officer
    document.getElementById("weeklyOfficerSerial").value = data.officerSerial
    // document.getElementById("weeklyDate").value = data.date
    // document.getElementById("weeklyFTM").value = data.ftm
    // document.getElementById("weeklyFTMSerial").value = data.ftmSerial
    document.getElementById("weeklyDiscussion").value = data.discussion
    document.getElementById("strengthsDiscussionStatus").value = data.strengthsDiscussion
    document.getElementById("weaknessesDiscussionStatus").value = data.weaknessesDiscussion
    document.getElementById("remedialRequired").value = data.remedialRequired
    document.getElementById("remedialDetails").value = data.remedialDetails
    document.getElementById("weeklyPerformanceSelect").value = data.performance
    for (let i = 1; i <= 17; i++) {
      const value = data.ratings[`weeklyRating${i}`]
      if (value) {
        const radio = document.querySelector(`input[name="weeklyRating${i}"][value="${value}"]`)
        if (radio) radio.checked = true
      }
    }
  } else if (formType === "ftofile") {
    document.getElementById("ftoFileDivision").value = data.division
  }
}

/**
 * Add current state to undo history
 */
export function pushUndoState(formType) {
  const state = captureFormState(formType)
  if (!state) return

  if (manualClearFlags[formType]) {
    manualClearFlags[formType] = false
  }

  // Remove any states after current pointer (when undoing then making new changes)
  const pointer = undoPointer[formType]
  if (pointer < undoHistory[formType].length - 1) {
    undoHistory[formType] = undoHistory[formType].slice(0, pointer + 1)
  }

  // Add new state
  undoHistory[formType].push(state)

  // Limit history size
  if (undoHistory[formType].length > UNDO_HISTORY_LIMIT) {
    undoHistory[formType].shift()
  } else {
    undoPointer[formType]++
  }
}

/**
 * Undo to previous state
 */
export function undo(formType) {
  if (undoPointer[formType] <= 0) {
    return
  }

  undoPointer[formType]--
  const state = undoHistory[formType][undoPointer[formType]]
  if (state) {
    restoreFormState(state)

    if (deleteConfirmationTimers[formType]) {
      clearTimeout(deleteConfirmationTimers[formType])
      deleteConfirmationTimers[formType] = null
    }
  }
}

/**
 * Redo to next state
 */
export function redo(formType) {
  if (undoPointer[formType] >= undoHistory[formType].length - 1) {
    return
  }

  undoPointer[formType]++
  const state = undoHistory[formType][undoPointer[formType]]
  if (state) {
    restoreFormState(state)
  }
}

function isFormMostlyEmpty(formType) {
  const state = captureFormState(formType)
  if (!state || !state.data) return true

  const prefilledFields = PREFILLED_FIELDS[formType] || []

  // Check if user-fillable fields are empty
  const hasUserData = Object.entries(state.data).some(([key, val]) => {
    // Skip prefilled fields
    const fieldId = key
      .replace("officer", "oriOfficer")
      .replace("officerSerial", "oriOfficerSerial")
      .replace("fto", "oriFTO")
      .replace("ftoSerial", "oriFTOSerial")
      .replace("patrol", "oriPatrolNumber")
      .replace("date", "oriDate")

    if (
      prefilledFields.some((pf) => fieldId.includes(pf.replace("ori", "").replace("dor", "").replace("weekly", "")))
    ) {
      return false
    }

    if (typeof val === "object") {
      return Object.values(val).some((v) => v !== "")
    }
    return val !== ""
  })

  return !hasUserData
}

function detectManualDeletion(formType) {
  const currentState = captureFormState(formType)
  const currentStateStr = JSON.stringify(currentState.data)

  // If form becomes mostly empty and it wasn't empty before
  if (isFormMostlyEmpty(formType) && lastContentState[formType] && lastContentState[formType] !== currentStateStr) {
    // Start timer - if user doesn't undo in X seconds, mark as manually cleared
    if (deleteConfirmationTimers[formType]) {
      clearTimeout(deleteConfirmationTimers[formType])
    }

    deleteConfirmationTimers[formType] = setTimeout(() => {
      markFormAsCleared(formType)
      deleteConfirmationTimers[formType] = null
    }, DELETE_CONFIRMATION_DELAY)
  }
}

/**
 * Setup auto-save for a form
 */
export function setupAutoSave(formType) {
  const formIds = getFormInputIds(formType)

  formIds.forEach((id) => {
    const element = document.getElementById(id)
    if (!element) return

    // Handle text inputs and textareas
    if (element.tagName === "INPUT" || element.tagName === "TEXTAREA" || element.tagName === "SELECT") {
      element.addEventListener("input", () => {
        // Clear existing timer
        if (autosaveTimers[formType]) {
          clearTimeout(autosaveTimers[formType])
        }

        // Set new timer
        autosaveTimers[formType] = setTimeout(() => {
          pushUndoState(formType)
          autoSaveFormState(formType)
          detectManualDeletion(formType)
        }, AUTOSAVE_DELAY)
      })
    }
  })

  // Handle radio buttons separately
  const radioNames = getRadioNames(formType)
  radioNames.forEach((name) => {
    const radios = document.querySelectorAll(`input[name="${name}"]`)
    radios.forEach((radio) => {
      radio.addEventListener("change", () => {
        if (autosaveTimers[formType]) {
          clearTimeout(autosaveTimers[formType])
        }
        autosaveTimers[formType] = setTimeout(() => {
          pushUndoState(formType)
          autoSaveFormState(formType)
        }, AUTOSAVE_DELAY)
      })
    })
  })

  // Save initial state
  setTimeout(() => {
    pushUndoState(formType)
    autoSaveFormState(formType)
  }, 100)
}

/**
 * Get all input IDs for a form type
 */
function getFormInputIds(formType) {
  if (formType === "orientation") {
    return [
      "oriOfficer",
      "oriOfficerSerial",
      "oriFTO",
      "oriFTOSerial",
      "oriPatrolNumber",
      "oriDate",
      "oriTime",
      "oriDuration",
      "oriIncidentsTasks",
    ]
  } else if (formType === "dor") {
    return [
      "dorOfficer",
      "dorOfficerSerial",
      "dorFTO",
      "dorFTOSerial",
      "dorPatrolNumber",
      "dorDate",
      "dorTime",
      "dorDuration",
      "dorIncidentsTasks",
      "dorBelowStandard",
      "dorAboveStandard",
      "dorLearningGoalsExplain",
      "dorRoleplayRemarks",
    ]
  } else if (formType === "weekly") {
    return [
      "weeklyOfficer",
      "weeklyOfficerSerial",
      "weeklyDate",
      "weeklyFTM",
      "weeklyFTMSerial",
      "weeklyDiscussion",
      "strengthsDiscussionStatus",
      "weaknessesDiscussionStatus",
      "remedialRequired",
      "remedialDetails",
      "weeklyPerformanceSelect",
    ]
  } else if (formType === "ftofile") {
    return ["ftoFileDivision"]
  }
  return []
}

/**
 * Get radio button names for a form type
 */
function getRadioNames(formType) {
  if (formType === "orientation") {
    return Array.from({ length: 8 }, (_, i) => `oriRating${i + 1}`)
  } else if (formType === "dor") {
    return Array.from({ length: 17 }, (_, i) => `dorRating${i + 1}`)
  } else if (formType === "weekly") {
    return Array.from({ length: 17 }, (_, i) => `weeklyRating${i + 1}`)
  }
  return []
}

/**
 * Check for auto-saved data and prompt user to restore
 */
export function checkAndPromptRestore(formType) {
  if (manualClearFlags[formType]) {
    setupAutoSave(formType)
    return false
  }

  const saved = loadAutoSavedState(formType)
  if (saved && saved.data) {
    const prefilledFields = PREFILLED_FIELDS[formType] || []
    const hasData = Object.entries(saved.data).some(([key, val]) => {
      // Check if this is a prefilled field
      const isPrefilled = prefilledFields.some((pf) =>
        key.toLowerCase().includes(pf.toLowerCase().replace("ori", "").replace("dor", "").replace("weekly", "")),
      )

      if (isPrefilled) return false

      if (typeof val === "object") {
        return Object.values(val).some((v) => v !== "")
      }
      return val !== ""
    })

    if (hasData) {
      const timeSaved = new Date(saved.timestamp).toLocaleString()
      if (confirm(`Found auto-saved data from ${timeSaved}. Would you like to restore it?`)) {
        restoreFormState(saved)
        setupAutoSave(formType)
        return true
      } else {
        clearAutoSave(formType)
      }
    }
  }
  setupAutoSave(formType)
  return false
}
