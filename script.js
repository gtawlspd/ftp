// Storage keys
const STORAGE_KEYS = {
    OFFICER_PROFILE: 'lspd_officer_profile',
    REPORTS: 'lspd_reports'
};

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    loadOfficerProfile();
    setupEventListeners();
    updateDashboard();
    updateHistoryList();
});

// Load officer profile from localStorage
function loadOfficerProfile() {
    const profile = JSON.parse(localStorage.getItem(STORAGE_KEYS.OFFICER_PROFILE) || '{}');
    
    if (profile.name) document.getElementById('officerName').value = profile.name;
    if (profile.badge) document.getElementById('officerBadge').value = profile.badge;
    if (profile.rank) document.getElementById('officerRank').value = profile.rank;
}

// Save officer profile
function saveOfficerProfile() {
    const profile = {
        name: document.getElementById('officerName').value,
        badge: document.getElementById('officerBadge').value,
        rank: document.getElementById('officerRank').value
    };
    
    localStorage.setItem(STORAGE_KEYS.OFFICER_PROFILE, JSON.stringify(profile));
    showNotification('Profile saved successfully!');
}

// Setup event listeners
function setupEventListeners() {
    // Officer profile form
    document.getElementById('officerForm').addEventListener('submit', (e) => {
        e.preventDefault();
        saveOfficerProfile();
    });
    
    // Navigation
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const page = btn.dataset.page;
            navigateTo(page);
        });
    });
    
    // Report forms
    document.getElementById('orientationForm').addEventListener('submit', handleOrientationSubmit);
    document.getElementById('dailyObservationForm').addEventListener('submit', handleDailyObservationSubmit);
    document.getElementById('employeeCommentForm').addEventListener('submit', handleEmployeeCommentSubmit);
    document.getElementById('weeklyEvaluationForm').addEventListener('submit', handleWeeklyEvaluationSubmit);
    document.getElementById('ftpCompletionForm').addEventListener('submit', handleFTPCompletionSubmit);
}

// Navigation
function navigateTo(page) {
    // Update nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.page === page) {
            btn.classList.add('active');
        }
    });
    
    // Update pages
    document.querySelectorAll('.page').forEach(p => {
        p.classList.remove('active');
    });
    document.getElementById(page).classList.add('active');
}

// Reset form
function resetForm(formId) {
    document.getElementById(formId).reset();
}

// Get officer info
function getOfficerInfo() {
    const profile = JSON.parse(localStorage.getItem(STORAGE_KEYS.OFFICER_PROFILE) || '{}');
    return {
        name: profile.name || 'Not Set',
        badge: profile.badge || 'Not Set',
        rank: profile.rank || 'Not Set'
    };
}

// Save report to history
function saveReport(report) {
    const reports = JSON.parse(localStorage.getItem(STORAGE_KEYS.REPORTS) || '[]');
    report.id = Date.now().toString();
    report.timestamp = new Date().toISOString();
    reports.unshift(report);
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
    updateDashboard();
    updateHistoryList();
}

// Get all reports
function getReports() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.REPORTS) || '[]');
}

// Delete report
function deleteReport(id) {
    const reports = getReports().filter(r => r.id !== id);
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
    updateDashboard();
    updateHistoryList();
    showNotification('Report deleted');
}

// Update dashboard stats
function updateDashboard() {
    const reports = getReports();
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    document.getElementById('totalReports').textContent = reports.length;
    document.getElementById('weekReports').textContent = reports.filter(r => 
        new Date(r.timestamp) > weekAgo
    ).length;
    document.getElementById('monthReports').textContent = reports.filter(r => 
        new Date(r.timestamp) > monthAgo
    ).length;
    
    // Recent reports
    const recentList = document.getElementById('recentReportsList');
    const recent = reports.slice(0, 5);
    
    if (recent.length === 0) {
        recentList.innerHTML = '<p class="empty-state">No reports yet</p>';
    } else {
        recentList.innerHTML = recent.map(r => `
            <div class="history-item">
                <div class="history-item-title">${r.type}</div>
                <div class="history-item-meta">
                    <span>${r.traineeName || 'N/A'}</span>
                    <span>${new Date(r.timestamp).toLocaleDateString()}</span>
                </div>
            </div>
        `).join('');
    }
}

// Update history list
function updateHistoryList() {
    const reports = getReports();
    const historyList = document.getElementById('historyList');
    
    if (reports.length === 0) {
        historyList.innerHTML = '<p class="empty-state">No reports yet</p>';
        return;
    }
    
    historyList.innerHTML = reports.map(r => `
        <div class="history-item">
            <div class="history-item-title">${r.type}</div>
            <div class="history-item-meta">
                <span>${r.traineeName || 'N/A'}</span>
                <span>${new Date(r.timestamp).toLocaleDateString()}</span>
            </div>
            <div class="history-item-actions">
                <button class="btn-view" onclick="viewReport('${r.id}')">View</button>
                <button class="btn-delete" onclick="if(confirm('Delete this report?')) deleteReport('${r.id}')">Delete</button>
            </div>
        </div>
    `).join('');
}

// View report
function viewReport(id) {
    const report = getReports().find(r => r.id === id);
    if (report) {
        showBBCodeModal(report.bbcode);
    }
}

// Show BBCode modal
function showBBCodeModal(bbcode) {
    document.getElementById('bbcodeOutput').value = bbcode;
    document.getElementById('bbcodeModal').classList.add('active');
}

// Close modal
function closeModal() {
    document.getElementById('bbcodeModal').classList.remove('active');
}

// Copy BBCode to clipboard
function copyBBCode() {
    const textarea = document.getElementById('bbcodeOutput');
    textarea.select();
    document.execCommand('copy');
    showNotification('BBCode copied to clipboard!');
}

// Show notification
function showNotification(message) {
    // Simple alert for now - could be enhanced with toast notifications
    alert(message);
}

// Orientation Report Handler
function handleOrientationSubmit(e) {
    e.preventDefault();
    const officer = getOfficerInfo();
    
    const data = {
        traineeName: document.getElementById('or_traineeName').value,
        traineeBadge: document.getElementById('or_traineeBadge').value,
        date: document.getElementById('or_date').value,
        shift: document.getElementById('or_shift').value,
        tour: document.querySelector('input[name="or_tour"]:checked').value,
        equipment: document.querySelector('input[name="or_equipment"]:checked').value,
        vehicle: document.querySelector('input[name="or_vehicle"]:checked').value,
        radio: document.querySelector('input[name="or_radio"]:checked').value,
        reports: document.querySelector('input[name="or_reports"]:checked').value,
        policies: document.querySelector('input[name="or_policies"]:checked').value,
        beat: document.querySelector('input[name="or_beat"]:checked').value,
        supervisors: document.querySelector('input[name="or_supervisors"]:checked').value,
        comments: document.getElementById('or_comments').value
    };
    
    const bbcode = generateOrientationBBCode(data, officer);
    
    saveReport({
        type: 'Introductory Patrol Report',
        traineeName: data.traineeName,
        bbcode: bbcode
    });
    
    showBBCodeModal(bbcode);
}

// Generate Orientation BBCode
function generateOrientationBBCode(data, officer) {
    return `[center][img]https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ftplogo-oA1MmIhockPpmdx4sNfvWESFmYvWc1.png[/img]
[size=150][b]LOS SANTOS POLICE DEPARTMENT[/b][/size]
[size=120][b]INTRODUCTORY PATROL REPORT[/b][/size][/center]

[hr][/hr]

[b]TRAINEE INFORMATION:[/b]
[b]Trainee Name:[/b] ${data.traineeName}
[b]Badge Number:[/b] ${data.traineeBadge}
[b]Date:[/b] ${data.date}
[b]Shift:[/b] ${data.shift}

[hr][/hr]

[b]ORIENTATION CHECKLIST:[/b]

[b]Department tour completed:[/b] ${data.tour}
[b]Equipment issued and checked:[/b] ${data.equipment}
[b]Vehicle inspection procedures:[/b] ${data.vehicle}
[b]Radio procedures and codes:[/b] ${data.radio}
[b]Report writing procedures:[/b] ${data.reports}
[b]Station procedures and policies:[/b] ${data.policies}
[b]Beat familiarization:[/b] ${data.beat}
[b]Introduction to supervisors:[/b] ${data.supervisors}

[hr][/hr]

[b]COMMENTS:[/b]
${data.comments || 'None'}

[hr][/hr]

[b]FIELD TRAINING OFFICER:[/b]
[b]Name:[/b] ${officer.name}
[b]Badge:[/b] ${officer.badge}
[b]Rank:[/b] ${officer.rank}

[center][size=85][i]Los Santos Police Department - Field Training Program[/i][/size][/center]`;
}

// Daily Observation Report Handler
function handleDailyObservationSubmit(e) {
    e.preventDefault();
    const officer = getOfficerInfo();
    
    const data = {
        traineeName: document.getElementById('dor_traineeName').value,
        traineeBadge: document.getElementById('dor_traineeBadge').value,
        date: document.getElementById('dor_date').value,
        shift: document.getElementById('dor_shift').value,
        appearance: document.querySelector('input[name="dor_appearance"]:checked').value,
        attitude: document.querySelector('input[name="dor_attitude"]:checked').value,
        policies: document.querySelector('input[name="dor_policies"]:checked').value,
        penalcode: document.querySelector('input[name="dor_penalcode"]:checked').value,
        reports: document.querySelector('input[name="dor_reports"]:checked').value,
        radio: document.querySelector('input[name="dor_radio"]:checked').value,
        driving: document.querySelector('input[name="dor_driving"]:checked').value,
        safety: document.querySelector('input[name="dor_safety"]:checked').value,
        conflict: document.querySelector('input[name="dor_conflict"]:checked').value,
        problemsolving: document.querySelector('input[name="dor_problemsolving"]:checked').value,
        investigation: document.querySelector('input[name="dor_investigation"]:checked').value,
        interview: document.querySelector('input[name="dor_interview"]:checked').value,
        initiative: document.querySelector('input[name="dor_initiative"]:checked').value,
        stress: document.querySelector('input[name="dor_stress"]:checked').value,
        instruction: document.querySelector('input[name="dor_instruction"]:checked').value,
        community: document.querySelector('input[name="dor_community"]:checked').value,
        procedures: document.querySelector('input[name="dor_procedures"]:checked').value,
        narrative: document.getElementById('dor_narrative').value
    };
    
    const bbcode = generateDailyObservationBBCode(data, officer);
    
    saveReport({
        type: 'Daily Observation Report',
        traineeName: data.traineeName,
        bbcode: bbcode
    });
    
    showBBCodeModal(bbcode);
}

// Generate Daily Observation BBCode
function generateDailyObservationBBCode(data, officer) {
    return `[center][img]https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ftplogo-oA1MmIhockPpmdx4sNfvWESFmYvWc1.png[/img]
[size=150][b]LOS SANTOS POLICE DEPARTMENT[/b][/size]
[size=120][b]DAILY OBSERVATION REPORT[/b][/size][/center]

[hr][/hr]

[b]TRAINEE INFORMATION:[/b]
[b]Trainee Name:[/b] ${data.traineeName}
[b]Badge Number:[/b] ${data.traineeBadge}
[b]Date:[/b] ${data.date}
[b]Shift:[/b] ${data.shift}

[hr][/hr]

[b]PERFORMANCE RATINGS:[/b]
[size=85][i]Scale: 1 (Unacceptable) - 4 (Superior) | N/O (Not Observed)[/i][/size]

[b]Appearance:[/b] ${data.appearance}
[b]Attitude:[/b] ${data.attitude}
[b]Knowledge of Department Policies:[/b] ${data.policies}
[b]Knowledge of Penal Code:[/b] ${data.penalcode}
[b]Report Writing:[/b] ${data.reports}
[b]Radio Usage:[/b] ${data.radio}
[b]Driving Skills:[/b] ${data.driving}
[b]Officer Safety:[/b] ${data.safety}
[b]Control of Conflict:[/b] ${data.conflict}
[b]Problem Solving/Decision Making:[/b] ${data.problemsolving}
[b]Investigative Skills:[/b] ${data.investigation}
[b]Interview/Interrogation:[/b] ${data.interview}
[b]Self-Initiated Activity:[/b] ${data.initiative}
[b]Stress Response:[/b] ${data.stress}
[b]Accepting/Following Instruction:[/b] ${data.instruction}
[b]Community Relations:[/b] ${data.community}
[b]Use of Proper Procedures:[/b] ${data.procedures}

[hr][/hr]

[b]PERFORMANCE NARRATIVE:[/b]
${data.narrative}

[hr][/hr]

[b]FIELD TRAINING OFFICER:[/b]
[b]Name:[/b] ${officer.name}
[b]Badge:[/b] ${officer.badge}
[b]Rank:[/b] ${officer.rank}

[center][size=85][i]Los Santos Police Department - Field Training Program[/i][/size][/center]`;
}

// Employee Comment Sheet Handler
function handleEmployeeCommentSubmit(e) {
    e.preventDefault();
    const officer = getOfficerInfo();
    
    const data = {
        traineeName: document.getElementById('ec_traineeName').value,
        traineeBadge: document.getElementById('ec_traineeBadge').value,
        date: document.getElementById('ec_date').value,
        time: document.getElementById('ec_time').value,
        subject: document.getElementById('ec_subject').value,
        description: document.getElementById('ec_description').value,
        action: document.getElementById('ec_action').value
    };
    
    const bbcode = generateEmployeeCommentBBCode(data, officer);
    
    saveReport({
        type: 'Employee Comment Sheet',
        traineeName: data.traineeName,
        bbcode: bbcode
    });
    
    showBBCodeModal(bbcode);
}

// Generate Employee Comment BBCode
function generateEmployeeCommentBBCode(data, officer) {
    return `[center][img]https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ftplogo-oA1MmIhockPpmdx4sNfvWESFmYvWc1.png[/img]
[size=150][b]LOS SANTOS POLICE DEPARTMENT[/b][/size]
[size=120][b]EMPLOYEE COMMENT SHEET[/b][/size][/center]

[hr][/hr]

[b]EMPLOYEE INFORMATION:[/b]
[b]Trainee Name:[/b] ${data.traineeName}
[b]Badge Number:[/b] ${data.traineeBadge}
[b]Date:[/b] ${data.date}
[b]Time:[/b] ${data.time}

[hr][/hr]

[b]SUBJECT:[/b]
${data.subject}

[hr][/hr]

[b]INCIDENT DESCRIPTION:[/b]
${data.description}

[hr][/hr]

[b]CORRECTIVE ACTION TAKEN:[/b]
${data.action || 'None'}

[hr][/hr]

[b]FIELD TRAINING OFFICER:[/b]
[b]Name:[/b] ${officer.name}
[b]Badge:[/b] ${officer.badge}
[b]Rank:[/b] ${officer.rank}

[center][size=85][i]Los Santos Police Department - Field Training Program[/i][/size][/center]`;
}

// Weekly Evaluation Report Handler
function handleWeeklyEvaluationSubmit(e) {
    e.preventDefault();
    const officer = getOfficerInfo();
    
    const data = {
        traineeName: document.getElementById('we_traineeName').value,
        traineeBadge: document.getElementById('we_traineeBadge').value,
        weekNumber: document.getElementById('we_weekNumber').value,
        dateRange: document.getElementById('we_dateRange').value,
        appearance: document.querySelector('input[name="we_appearance"]:checked').value,
        attitude: document.querySelector('input[name="we_attitude"]:checked').value,
        policies: document.querySelector('input[name="we_policies"]:checked').value,
        penalcode: document.querySelector('input[name="we_penalcode"]:checked').value,
        reports: document.querySelector('input[name="we_reports"]:checked').value,
        radio: document.querySelector('input[name="we_radio"]:checked').value,
        driving: document.querySelector('input[name="we_driving"]:checked').value,
        safety: document.querySelector('input[name="we_safety"]:checked').value,
        conflict: document.querySelector('input[name="we_conflict"]:checked').value,
        problemsolving: document.querySelector('input[name="we_problemsolving"]:checked').value,
        investigation: document.querySelector('input[name="we_investigation"]:checked').value,
        interview: document.querySelector('input[name="we_interview"]:checked').value,
        initiative: document.querySelector('input[name="we_initiative"]:checked').value,
        stress: document.querySelector('input[name="we_stress"]:checked').value,
        instruction: document.querySelector('input[name="we_instruction"]:checked').value,
        community: document.querySelector('input[name="we_community"]:checked').value,
        procedures: document.querySelector('input[name="we_procedures"]:checked').value,
        strengths: document.getElementById('we_strengths').value,
        improvements: document.getElementById('we_improvements').value,
        narrative: document.getElementById('we_narrative').value
    };
    
    const bbcode = generateWeeklyEvaluationBBCode(data, officer);
    
    saveReport({
        type: 'Weekly Evaluation Report',
        traineeName: data.traineeName,
        bbcode: bbcode
    });
    
    showBBCodeModal(bbcode);
}

// Generate Weekly Evaluation BBCode
function generateWeeklyEvaluationBBCode(data, officer) {
    return `[center][img]https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ftplogo-oA1MmIhockPpmdx4sNfvWESFmYvWc1.png[/img]
[size=150][b]LOS SANTOS POLICE DEPARTMENT[/b][/size]
[size=120][b]WEEKLY EVALUATION REPORT[/b][/size][/center]

[hr][/hr]

[b]TRAINEE INFORMATION:[/b]
[b]Trainee Name:[/b] ${data.traineeName}
[b]Badge Number:[/b] ${data.traineeBadge}
[b]Week Number:[/b] ${data.weekNumber}
[b]Date Range:[/b] ${data.dateRange}

[hr][/hr]

[b]WEEKLY PERFORMANCE SUMMARY:[/b]
[size=85][i]Scale: 1 (Unacceptable) - 4 (Superior) | N/O (Not Observed)[/i][/size]

[b]Appearance:[/b] ${data.appearance}
[b]Attitude:[/b] ${data.attitude}
[b]Knowledge of Department Policies:[/b] ${data.policies}
[b]Knowledge of Penal Code:[/b] ${data.penalcode}
[b]Report Writing:[/b] ${data.reports}
[b]Radio Usage:[/b] ${data.radio}
[b]Driving Skills:[/b] ${data.driving}
[b]Officer Safety:[/b] ${data.safety}
[b]Control of Conflict:[/b] ${data.conflict}
[b]Problem Solving/Decision Making:[/b] ${data.problemsolving}
[b]Investigative Skills:[/b] ${data.investigation}
[b]Interview/Interrogation:[/b] ${data.interview}
[b]Self-Initiated Activity:[/b] ${data.initiative}
[b]Stress Response:[/b] ${data.stress}
[b]Accepting/Following Instruction:[/b] ${data.instruction}
[b]Community Relations:[/b] ${data.community}
[b]Use of Proper Procedures:[/b] ${data.procedures}

[hr][/hr]

[b]STRENGTHS OBSERVED:[/b]
${data.strengths}

[b]AREAS FOR IMPROVEMENT:[/b]
${data.improvements}

[b]OVERALL ASSESSMENT:[/b]
${data.narrative}

[hr][/hr]

[b]FIELD TRAINING OFFICER:[/b]
[b]Name:[/b] ${officer.name}
[b]Badge:[/b] ${officer.badge}
[b]Rank:[/b] ${officer.rank}

[center][size=85][i]Los Santos Police Department - Field Training Program[/i][/size][/center]`;
}

// FTP Completion Report Handler
function handleFTPCompletionSubmit(e) {
    e.preventDefault();
    const officer = getOfficerInfo();
    
    const data = {
        traineeName: document.getElementById('ftp_traineeName').value,
        traineeBadge: document.getElementById('ftp_traineeBadge').value,
        startDate: document.getElementById('ftp_startDate').value,
        endDate: document.getElementById('ftp_endDate').value,
        totalHours: document.getElementById('ftp_totalHours').value,
        assignments: document.getElementById('ftp_assignments').value,
        evaluation: document.getElementById('ftp_evaluation').value,
        recommendation: document.getElementById('ftp_recommendation').value,
        comments: document.getElementById('ftp_comments').value,
        managerName: document.getElementById('ftp_managerName').value,
        managerBadge: document.getElementById('ftp_managerBadge').value,
        approvalDate: document.getElementById('ftp_approvalDate').value
    };
    
    const bbcode = generateFTPCompletionBBCode(data, officer);
    
    saveReport({
        type: 'FTP Completion Record',
        traineeName: data.traineeName,
        bbcode: bbcode
    });
    
    showBBCodeModal(bbcode);
}

// Generate FTP Completion BBCode
function generateFTPCompletionBBCode(data, officer) {
    return `[center][img]https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ftplogo-oA1MmIhockPpmdx4sNfvWESFmYvWc1.png[/img]
[size=150][b]LOS SANTOS POLICE DEPARTMENT[/b][/size]
[size=120][b]FIELD TRAINING PROGRAM COMPLETION RECORD[/b][/size][/center]

[hr][/hr]

[b]TRAINEE INFORMATION:[/b]
[b]Trainee Name:[/b] ${data.traineeName}
[b]Badge Number:[/b] ${data.traineeBadge}
[b]Program Start Date:[/b] ${data.startDate}
[b]Program End Date:[/b] ${data.endDate}
[b]Total Training Hours:[/b] ${data.totalHours}

[hr][/hr]

[b]TRAINING ASSIGNMENTS COMPLETED:[/b]
${data.assignments}

[hr][/hr]

[b]OVERALL PERFORMANCE ASSESSMENT:[/b]
${data.evaluation}

[hr][/hr]

[b]RECOMMENDATION:[/b]
${data.recommendation}

[b]ADDITIONAL COMMENTS:[/b]
${data.comments || 'None'}

[hr][/hr]

[b]FIELD TRAINING OFFICER:[/b]
[b]Name:[/b] ${officer.name}
[b]Badge:[/b] ${officer.badge}
[b]Rank:[/b] ${officer.rank}

[hr][/hr]

[b]FTP MANAGER APPROVAL:[/b]
[b]Manager Name:[/b] ${data.managerName}
[b]Manager Badge:[/b] ${data.managerBadge}
[b]Approval Date:[/b] ${data.approvalDate}

[center][size=85][i]Los Santos Police Department - Field Training Program[/i][/size][/center]`;
}
