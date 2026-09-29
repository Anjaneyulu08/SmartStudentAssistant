// ============================================================
// SMART STUDENT ASSISTANT
// MAIN JAVASCRIPT FILE
// ============================================================


// ============================================================
// LOCAL STORAGE KEYS
// ============================================================

const TASKS_KEY = "studentTasks";
const SUBJECTS_KEY = "studentSubjects";
const NOTES_KEY = "studentNotes";
const SCHEDULE_KEY = "studentSchedule";
const EXAMS_KEY = "studentExams";
const STUDY_SESSIONS_KEY = "completedStudySessions";
const STUDY_HISTORY_KEY = "studySessionHistory";
const KNOWLEDGE_TEST_RESULTS_KEY ="knowledgeTestResults";

// ============================================================
// HELPER FUNCTIONS
// ============================================================

function getData(key) {

    try {

        return JSON.parse(
            localStorage.getItem(key)
        ) || [];

    } catch (error) {

        return [];

    }
}


function saveData(key, data) {

    localStorage.setItem(
        key,
        JSON.stringify(data)
    );
}


function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}


function getTodayName() {

    const days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
    ];

    return days[new Date().getDay()];
}


function formatDate(dateString) {

    const date =
        new Date(dateString);

    if (isNaN(date.getTime())) {

        return dateString;

    }

    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );
}


function getDaysUntil(dateString) {

    const today =
        new Date();

    const target =
        new Date(dateString);

    today.setHours(
        0,
        0,
        0,
        0
    );

    target.setHours(
        0,
        0,
        0,
        0
    );

    return Math.ceil(
        (
            target - today
        ) /
        (
            1000 *
            60 *
            60 *
            24
        )
    );
}


// ============================================================
// TASKS
// ============================================================

function renderTasks() {

    const tasks =
        getData(TASKS_KEY);

    const taskList =
        document.getElementById(
            "task-list"
        );

    if (!taskList) {
        return;
    }


    if (tasks.length === 0) {

        taskList.innerHTML = `
            <p class="empty-message">
                No tasks added yet.
            </p>
        `;

    } else {

        taskList.innerHTML =
            tasks.map(
                (task, index) => {

                    const priority =
                        task.priority ||
                        "medium";


                    let priorityText =
                        "Medium";

                    let prioritySymbol =
                        "🟡";


                    if (priority === "high") {

                        priorityText =
                            "High";

                        prioritySymbol =
                            "🔴";

                    } else if (
                        priority === "low"
                    ) {

                        priorityText =
                            "Low";

                        prioritySymbol =
                            "🟢";

                    }


                    let deadlineHTML =
                        "";


                    if (task.dueDate) {

                        const today =
                            new Date();

                        today.setHours(
                            0,
                            0,
                            0,
                            0
                        );


                        const dueDate =
                            new Date(
                                task.dueDate +
                                "T00:00:00"
                            );


                        const timeDifference =
                            dueDate.getTime() -
                            today.getTime();


                        const daysDifference =
                            Math.round(
                                timeDifference /
                                (1000 * 60 * 60 * 24)
                            );


                        const isOverdue =
                            !task.completed &&
                            daysDifference < 0;


                        if (isOverdue) {

                            deadlineHTML = `
                                <span
                                    style="
                                        color:#dc2626;
                                        font-weight:600;
                                    "
                                >
                                    🔴 Overdue:
                                    ${escapeHTML(
                                        task.dueDate
                                    )}
                                </span>
                            `;

                        } else if (
                            !task.completed &&
                            daysDifference === 0
                        ) {

                            deadlineHTML = `
                                <span
                                    style="
                                        color:#ea580c;
                                        font-weight:600;
                                    "
                                >
                                    🟠 Due Today
                                </span>
                            `;

                        } else if (
                            !task.completed &&
                            daysDifference === 1
                        ) {

                            deadlineHTML = `
                                <span
                                    style="
                                        color:#ca8a04;
                                        font-weight:600;
                                    "
                                >
                                    🟡 Due Tomorrow
                                </span>
                            `;

                        } else {

                            deadlineHTML = `
                                <span
                                    style="
                                        color:#2563eb;
                                    "
                                >
                                    🔵 Due:
                                    ${escapeHTML(
                                        task.dueDate
                                    )}
                                </span>
                            `;

                        }

                    }


                    return `

                        <div class="task-item ${
                            task.completed
                                ? "completed"
                                : ""
                        }">

                            <div class="task-left">

                                <input
                                    type="checkbox"
                                    ${
                                        task.completed
                                            ? "checked"
                                            : ""
                                    }
                                    onchange="
                                        toggleTask(${index})
                                    "
                                >


                                <div class="task-content">

                                    <h3>
                                        ${escapeHTML(
                                            task.title
                                        )}
                                    </h3>


                                    <p>
                                        ${escapeHTML(
                                            task.description ||
                                            "No description"
                                        )}
                                    </p>


                                    <div
                                        style="
                                            display:flex;
                                            gap:12px;
                                            flex-wrap:wrap;
                                            margin-top:8px;
                                            font-size:12px;
                                        "
                                    >

                                        <span
                                            style="
                                                font-weight:600;
                                            "
                                        >
                                            ${prioritySymbol}
                                            ${priorityText}
                                            Priority
                                        </span>


                                        ${deadlineHTML}

                                    </div>

                                </div>

                            </div>


                            <button
                                class="delete-button"
                                onclick="
                                    deleteTask(${index})
                                "
                            >
                                Delete
                            </button>

                        </div>

                    `;

                }
            ).join("");

    }


    updateDashboardStats();
    updateSmartDashboard();
    updateProgressDashboard();
    updateAcademicInsights();
    updateAcademicAnalytics();
    updateSmartRecommendations();
    updateStudyPlanner();

}

function addTask() {

    const title =
        prompt(
            "Enter task title:"
        );


    if (
        !title ||
        !title.trim()
    ) {

        return;

    }


    const description =
        prompt(
            "Enter task description:"
        ) || "";


    const priorityInput =
        prompt(
            "Enter priority:\n\n1 - High\n2 - Medium\n3 - Low\n\nEnter 1, 2, or 3:"
        );


    let priority =
        "medium";


    if (priorityInput === "1") {

        priority = "high";

    } else if (priorityInput === "3") {

        priority = "low";

    }


    const dueDate =
        prompt(
            "Enter due date (YYYY-MM-DD):\n\nLeave empty if there is no deadline."
        ) || "";


    const tasks =
        getData(TASKS_KEY);


    tasks.push({

        title:
            title.trim(),

        description:
            description.trim(),

        priority:
            priority,

        dueDate:
            dueDate.trim(),

        completed:
            false,

        createdAt:
            new Date().toISOString()

    });


    saveData(
        TASKS_KEY,
        tasks
    );


    renderTasks();

}
/* ============================================================
   TOGGLE TASK COMPLETION
   ============================================================ */

function toggleTask(index) {

    const tasks =
        getData(TASKS_KEY);


    if (!tasks[index]) {
        return;
    }


    tasks[index].completed =
        !tasks[index].completed;


    saveData(
        TASKS_KEY,
        tasks
    );


    renderTasks();
}

function deleteTask(index) {

    const tasks =
        getData(TASKS_KEY);


    if (!tasks[index]) {
        return;
    }


    if (
        !confirm(
            "Delete this task?"
        )
    ) {

        return;

    }


    tasks.splice(
        index,
        1
    );


    saveData(
        TASKS_KEY,
        tasks
    );


    renderTasks();
}


// ============================================================
// SUBJECTS
// ============================================================

function renderSubjects() {

    const subjects =
        getData(SUBJECTS_KEY);


    const subjectList =
        document.getElementById(
            "subject-list"
        );


    if (!subjectList) {
        return;
    }


    if (
        subjects.length === 0
    ) {

        subjectList.innerHTML = `
            <p class="empty-message">
                No subjects added yet.
            </p>
        `;

    } else {

        subjectList.innerHTML =
            subjects.map(
                (subject, index) => {

                    const progress =
                        Number(
                            subject.progress
                        ) || 0;


                    return `

                        <div class="subject-card">

                            <div class="subject-card-header">

                                <div>

                                    <h3>
                                        ${escapeHTML(
                                            subject.name
                                        )}
                                    </h3>

                                    <p>
                                        Progress:
                                        ${progress}%
                                    </p>

                                </div>

                                <div class="subject-actions">

                                    <button
                                        class="edit-button"
                                        onclick="
                                            editSubject(
                                                ${index}
                                            )
                                        "
                                    >
                                        Edit
                                    </button>

                                    <button
                                        class="delete-button"
                                        onclick="
                                            deleteSubject(
                                                ${index}
                                            )
                                        "
                                    >
                                        Delete
                                    </button>

                                </div>

                            </div>

                            <div class="progress-bar">

                                <div
                                    class="progress-fill"
                                    style="
                                        width:${progress}%
                                    "
                                ></div>

                            </div>

                        </div>

                    `;

                }
            ).join("");

    }


    updateDashboardStats();
    updateSmartDashboard();
    updateProgressDashboard();
    updateAcademicInsights();
    updateAcademicAnalytics();
    updateSmartRecommendations();
    updateStudyPlanner();
    populateKnowledgeTestSubjects();
}
/* ============================================================
   KNOWLEDGE TEST - SUBJECT DROPDOWN
   Only subjects with 100% progress are available
   ============================================================ */

function populateKnowledgeTestSubjects() {

    const subjectSelect =
        document.getElementById(
            "knowledge-test-subject"
        );

    if (!subjectSelect) {
        return;
    }


    const subjects =
        getData(SUBJECTS_KEY);


    const completedSubjects =
        subjects.filter(
            subject =>
                Number(subject.progress) === 100
        );


    subjectSelect.innerHTML = `
        <option value="">
            Select a completed subject
        </option>
    `;


    if (completedSubjects.length === 0) {

        subjectSelect.innerHTML += `
            <option value="" disabled>
                Complete a subject to unlock its test
            </option>
        `;

        return;
    }


    completedSubjects.forEach(
        (subject) => {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                subject.name;

            option.textContent =
                `✅ ${subject.name}`;

            subjectSelect.appendChild(
                option
            );

        }
    );

}

function addSubject() {

    const name =
        prompt(
            "Enter subject name:"
        );


    if (
        !name ||
        !name.trim()
    ) {

        return;

    }


    let progress =
        prompt(
            "Enter current progress (0-100):"
        );


    if (
        progress === null
    ) {

        return;

    }


    progress =
        Number(progress);


    if (
        isNaN(progress)
    ) {

        alert(
            "Please enter a valid number."
        );

        return;

    }


    progress =
        Math.max(
            0,
            Math.min(
                100,
                progress
            )
        );


    const subjects =
        getData(SUBJECTS_KEY);


    subjects.push({

        name:
            name.trim(),

        progress:
            progress

    });


    saveData(
        SUBJECTS_KEY,
        subjects
    );


    renderSubjects();
}
/* ============================================================
   ADD SUBJECT BUTTON CONNECTION
   ============================================================ */

const addSubjectButton =
    document.getElementById(
        "add-subject-button"
    );

if (addSubjectButton) {

    addSubjectButton.addEventListener(
        "click",
        addSubject
    );

}


function editSubject(index) {

    const subjects =
        getData(SUBJECTS_KEY);


    if (!subjects[index]) {
        return;
    }


    let progress =
        prompt(
            `Update progress for ${
                subjects[index].name
            } (0-100):`,
            subjects[index].progress
        );


    if (
        progress === null
    ) {

        return;

    }


    progress =
        Number(progress);


    if (
        isNaN(progress)
    ) {

        alert(
            "Please enter a valid number."
        );

        return;

    }


    progress =
        Math.max(
            0,
            Math.min(
                100,
                progress
            )
        );


    subjects[index].progress =
        progress;


    saveData(
        SUBJECTS_KEY,
        subjects
    );


    renderSubjects();
}


function deleteSubject(index) {

    const subjects =
        getData(SUBJECTS_KEY);


    if (!subjects[index]) {
        return;
    }


    if (
        !confirm(
            `Delete ${
                subjects[index].name
            }?`
        )
    ) {

        return;

    }


    subjects.splice(
        index,
        1
    );


    saveData(
        SUBJECTS_KEY,
        subjects
    );


    renderSubjects();
}


// ============================================================
// NOTES
// ============================================================

function renderNotes() {

    const notes =
        getData(NOTES_KEY);


    const notesList =
        document.getElementById(
            "notes-list"
        );


    if (!notesList) {
        return;
    }


    if (
        notes.length === 0
    ) {

        notesList.innerHTML = `
            <p class="empty-message">
                No notes added yet.
            </p>
        `;

        return;
    }


    notesList.innerHTML =
        notes.map(
            (note, index) => `

                <div class="note-card">

                    <div class="note-card-header">

                        <h3>
                            ${escapeHTML(
                                note.title
                            )}
                        </h3>

                        <button
                            class="delete-button"
                            onclick="
                                deleteNote(${index})
                            "
                        >
                            Delete
                        </button>

                    </div>

                    <p>
                        ${escapeHTML(
                            note.content
                        )}
                    </p>

                </div>

            `
        ).join("");
}


function addNote() {

    const title =
        prompt(
            "Enter note title:"
        );


    if (
        !title ||
        !title.trim()
    ) {

        return;

    }


    const content =
        prompt(
            "Enter note content:"
        );


    if (
        content === null
    ) {

        return;

    }


    const notes =
        getData(NOTES_KEY);


    notes.push({

        title:
            title.trim(),

        content:
            content.trim(),

        createdAt:
            new Date().toISOString()

    });


    saveData(
        NOTES_KEY,
        notes
    );


    renderNotes();
}
/* ============================================================
   ADD NOTE BUTTON CONNECTION
   ============================================================ */

const addNoteButton =
    document.getElementById(
        "add-note-button"
    );
    console.log("ADD NOTE BUTTON:", addNoteButton);
if (addNoteButton) {

    addNoteButton.addEventListener(
        "click",
        addNote
    );

}


function deleteNote(index) {

    const notes =
        getData(NOTES_KEY);


    if (!notes[index]) {
        return;
    }


    if (
        !confirm(
            "Delete this note?"
        )
    ) {

        return;

    }


    notes.splice(
        index,
        1
    );


    saveData(
        NOTES_KEY,
        notes
    );


    renderNotes();
}


// ============================================================
// SCHEDULE
// ============================================================

function renderSchedule() {

    const schedule =
        getData(
            SCHEDULE_KEY
        );


    const scheduleList =
        document.getElementById(
            "schedule-list"
        );


    if (!scheduleList) {
        return;
    }


    if (
        schedule.length === 0
    ) {

        scheduleList.innerHTML = `
            <p class="empty-message">
                No schedule added yet.
            </p>
        `;

    } else {

        scheduleList.innerHTML =
            schedule.map(
                (item, index) => `

                    <div class="schedule-item">

                        <div>

                            <h3>
                                ${escapeHTML(
                                    item.subject
                                )}
                            </h3>

                            <p>
                                ${escapeHTML(
                                    item.day
                                )}
                                •
                                ${escapeHTML(
                                    item.startTime
                                )}
                                -
                                ${escapeHTML(
                                    item.endTime
                                )}
                            </p>

                            <small>
                                Room:
                                ${escapeHTML(
                                    item.room ||
                                    "Not specified"
                                )}
                            </small>

                        </div>

                        <button
                            class="delete-button"
                            onclick="
                                deleteSchedule(
                                    ${index}
                                )
                            "
                        >
                            Delete
                        </button>

                    </div>

                `
            ).join("");

    }


    updateSmartDashboard();
    updateStudyPlanner();
}


function addSchedule() {

    const subject =
        prompt(
            "Enter subject:"
        );


    if (
        !subject ||
        !subject.trim()
    ) {

        return;

    }


    const day =
        prompt(
            "Enter day (Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday):"
        );


    if (
        !day ||
        !day.trim()
    ) {

        return;

    }


    const validDays = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
    ];


    const formattedDay =
        day.charAt(0).toUpperCase() +
        day.slice(1).toLowerCase();


    if (
        !validDays.includes(
            formattedDay
        )
    ) {

        alert(
            "Please enter a valid day."
        );

        return;

    }


    const startTime =
        prompt(
            "Enter start time:"
        );


    if (
        !startTime ||
        !startTime.trim()
    ) {

        return;

    }


    const endTime =
        prompt(
            "Enter end time:"
        );


    if (
        !endTime ||
        !endTime.trim()
    ) {

        return;

    }


    const room =
        prompt(
            "Enter room (optional):"
        ) || "";


    const schedule =
        getData(
            SCHEDULE_KEY
        );


    schedule.push({

        subject:
            subject.trim(),

        day:
            formattedDay,

        startTime:
            startTime.trim(),

        endTime:
            endTime.trim(),

        room:
            room.trim()

    });


    saveData(
        SCHEDULE_KEY,
        schedule
    );


    renderSchedule();
}


function deleteSchedule(index) {

    const schedule =
        getData(
            SCHEDULE_KEY
        );


    if (!schedule[index]) {
        return;
    }


    if (
        !confirm(
            "Delete this schedule item?"
        )
    ) {

        return;

    }


    schedule.splice(
        index,
        1
    );


    saveData(
        SCHEDULE_KEY,
        schedule
    );


    renderSchedule();
}


// ============================================================
// EXAMS
// ============================================================

function renderExams() {

    const exams =
        getData(
            EXAMS_KEY
        );


    const examList =
        document.getElementById(
            "exam-list"
        );


    if (!examList) {
        return;
    }


    if (
        exams.length === 0
    ) {

        examList.innerHTML = `
            <p class="empty-message">
                No exams added yet.
            </p>
        `;

    } else {

        examList.innerHTML =
            exams.map(
                (exam, index) => `

                    <div class="exam-item">

                        <div>

                            <h3>
                                ${escapeHTML(
                                    exam.subject
                                )}
                            </h3>

                            <p>
                                ${formatDate(
                                    exam.date
                                )}
                                •
                                ${escapeHTML(
                                    exam.time
                                )}
                            </p>

                        </div>

                        <button
                            class="delete-button"
                            onclick="
                                deleteExam(
                                    ${index}
                                )
                            "
                        >
                            Delete
                        </button>

                    </div>

                `
            ).join("");

    }


    updateDashboardStats();
    updateSmartDashboard();
    updateAcademicInsights();
    updateAcademicAnalytics();
    updateSmartRecommendations();
    updateStudyPlanner();
}


/* ============================================================
   ADD EXAM
   ============================================================ */

function addExam() {

    const subject =
        prompt("Enter exam subject:");

    if (!subject || !subject.trim()) {
        return;
    }

    const date =
        prompt(
            "Enter exam date (YYYY-MM-DD):"
        );

    if (!date || !date.trim()) {
        return;
    }

    const time =
        prompt(
            "Enter exam time (example: 10:00 AM):"
        );

    if (time === null) {
        return;
    }

    const exams =
        getData(EXAMS_KEY);

    exams.push({

        subject:
            subject.trim(),

        date:
            date.trim(),

        time:
            time.trim(),

        createdAt:
            new Date().toISOString()

    });

    saveData(
        EXAMS_KEY,
        exams
    );

    renderExams();

    updateDashboardStats();

    updateSmartDashboard();

    updateAcademicInsights();

    updateAcademicAnalytics();

    updateStudyPlanner();

}


function deleteExam(index) {

    const exams =
        getData(
            EXAMS_KEY
        );


    if (!exams[index]) {
        return;
    }


    if (
        !confirm(
            "Delete this exam?"
        )
    ) {

        return;

    }


    exams.splice(
        index,
        1
    );


    saveData(
        EXAMS_KEY,
        exams
    );


    renderExams();
}


// ============================================================
// STUDY TIMER
// ============================================================

let timerInterval = null;

let remainingSeconds =
    25 * 60;


function updateTimerDisplay() {

    const timerDisplay =
        document.getElementById(
            "timer-display"
        );


    if (!timerDisplay) {
        return;
    }


    const minutes =
        Math.floor(
            remainingSeconds /
            60
        );


    const seconds =
        remainingSeconds %
        60;


    timerDisplay.textContent =
        String(minutes).padStart(
            2,
            "0"
        ) +
        ":" +
        String(seconds).padStart(
            2,
            "0"
        );
}


function startTimer() {

    if (
        timerInterval !== null
    ) {

        return;

    }


    timerInterval =
        setInterval(
            () => {

                if (
                    remainingSeconds > 0
                ) {

                    remainingSeconds--;

                    updateTimerDisplay();

                } else {

                    clearInterval(
                        timerInterval
                    );

                    timerInterval =
                        null;


                    completeStudySession();


                    alert(
                        "Study session completed! Great work."
                    );


                    remainingSeconds =
                        25 * 60;


                    updateTimerDisplay();

                }

            },
            1000
        );
}


function pauseTimer() {

    if (
        timerInterval === null
    ) {

        return;

    }


    clearInterval(
        timerInterval
    );


    timerInterval =
        null;
}


function resetTimer() {

    clearInterval(
        timerInterval
    );


    timerInterval =
        null;


    remainingSeconds =
        25 * 60;


    updateTimerDisplay();
}
/* ============================================================
   STUDY TIMER BUTTON CONNECTIONS
   ============================================================ */

const startTimerButton =
    document.getElementById(
        "start-timer"
    );

const pauseTimerButton =
    document.getElementById(
        "pause-timer"
    );

const resetTimerButton =
    document.getElementById(
        "reset-timer"
    );

const completedSessionsElement =
    document.getElementById(
        "completed-sessions"
    );


if (startTimerButton) {

    startTimerButton.addEventListener(
        "click",
        startTimer
    );

}


if (pauseTimerButton) {

    pauseTimerButton.addEventListener(
        "click",
        pauseTimer
    );

}


if (resetTimerButton) {

    resetTimerButton.addEventListener(
        "click",
        resetTimer
    );

}


/* ============================================================
   INITIALIZE STUDY TIMER
   ============================================================ */

updateTimerDisplay();


if (completedSessionsElement) {

    completedSessionsElement.textContent =
        getCompletedStudySessions();

}

// ============================================================
// STUDY SESSION HISTORY
// ============================================================

function completeStudySession() {

    let completedSessions =
        Number(
            localStorage.getItem(
                STUDY_SESSIONS_KEY
            )
        ) || 0;


    completedSessions++;


    localStorage.setItem(
        STUDY_SESSIONS_KEY,
        completedSessions
    );


    const history =
        getData(
            STUDY_HISTORY_KEY
        );


    history.push({

        date:
            new Date().toISOString(),

        duration:
            25

    });


    saveData(
        STUDY_HISTORY_KEY,
        history
    );


    updateDashboardStats();

    updateProgressDashboard();

    updateAcademicInsights();

    updateAcademicAnalytics();

    updateSmartRecommendations();

    updateStudyPlanner();
}


function getCompletedStudySessions() {

    return Number(
        localStorage.getItem(
            STUDY_SESSIONS_KEY
        )
    ) || 0;
}


function getStudyHistory() {

    return getData(
        STUDY_HISTORY_KEY
    );
}


// ============================================================
// DASHBOARD STATISTICS
// ============================================================

function updateDashboardStats() {

    const tasks =
        getData(TASKS_KEY);

    const subjects =
        getData(SUBJECTS_KEY);

    const exams =
        getData(EXAMS_KEY);


    /* --------------------------------------------------------
       TASKS
       -------------------------------------------------------- */

    const pendingTasks =
        tasks.filter(
            task => !task.completed
        ).length;


    /* --------------------------------------------------------
       UPCOMING EXAMS
       -------------------------------------------------------- */

    const upcomingExams =
        exams.filter(
            exam =>
                getDaysUntil(
                    exam.date
                ) >= 0
        ).length;


    /* --------------------------------------------------------
       OVERALL SUBJECT PROGRESS
       -------------------------------------------------------- */

    let overallProgress = 0;

    if (subjects.length > 0) {

        const totalProgress =
            subjects.reduce(
                (sum, subject) =>
                    sum +
                    (
                        Number(
                            subject.progress
                        ) || 0
                    ),
                0
            );

        overallProgress =
            Math.round(
                totalProgress /
                subjects.length
            );
    }


    /* --------------------------------------------------------
       DASHBOARD ELEMENTS
       -------------------------------------------------------- */

    const taskCountElement =
        document.getElementById(
            "task-count"
        );

    const subjectCountElement =
        document.getElementById(
            "subject-count"
        );

    const examCountElement =
        document.getElementById(
            "exam-count"
        );

    const overallProgressElement =
        document.getElementById(
            "overall-progress"
        );


    /* --------------------------------------------------------
       UPDATE DASHBOARD
       -------------------------------------------------------- */

    if (taskCountElement) {

        taskCountElement.textContent =
            pendingTasks;
    }


    if (subjectCountElement) {

        subjectCountElement.textContent =
            subjects.length;
    }


    if (examCountElement) {

        examCountElement.textContent =
            upcomingExams;
    }


    if (overallProgressElement) {

        overallProgressElement.textContent =
            overallProgress;
    }

}


// ============================================================
// SMART DASHBOARD
// ============================================================

function updateSmartDashboard() {

    const schedule =
        getData(
            SCHEDULE_KEY
        );

    const exams =
        getData(
            EXAMS_KEY
        );

    const subjects =
        getData(
            SUBJECTS_KEY
        );


    // TODAY'S SCHEDULE

    const todayName =
        getTodayName();


    const todaySchedule =
        schedule.filter(
            item =>
                item.day ===
                todayName
        );


    const todayScheduleElement =
        document.getElementById(
            "today-schedule"
        );


    if (
        todayScheduleElement
    ) {

        if (
            todaySchedule.length === 0
        ) {

            todayScheduleElement.innerHTML = `
                <p class="empty-message">
                    No classes scheduled for today.
                </p>
            `;

        } else {

            todayScheduleElement.innerHTML =
                todaySchedule.map(
                    item => `

                        <div class="smart-item">

                            <strong>
                                ${escapeHTML(
                                    item.subject
                                )}
                            </strong>

                            <span>
                                ${escapeHTML(
                                    item.startTime
                                )}
                                -
                                ${escapeHTML(
                                    item.endTime
                                )}
                            </span>

                            <small>
                                ${escapeHTML(
                                    item.room ||
                                    "Room not specified"
                                )}
                            </small>

                        </div>

                    `
                ).join("");

        }
    }


    // UPCOMING EXAM

    const upcomingExams =
        exams
            .filter(
                exam =>
                    getDaysUntil(
                        exam.date
                    ) >= 0
            )
            .sort(
                (a, b) =>
                    new Date(a.date) -
                    new Date(b.date)
            );


    const examAlertElement =
        document.getElementById(
            "exam-alert"
        );


    if (
        examAlertElement
    ) {

        if (
            upcomingExams.length === 0
        ) {

            examAlertElement.innerHTML = `
                <p class="empty-message">
                    No upcoming exams.
                </p>
            `;

        } else {

            const exam =
                upcomingExams[0];


            const days =
                getDaysUntil(
                    exam.date
                );


            let dayText;


            if (
                days === 0
            ) {

                dayText =
                    "Today";

            } else if (
                days === 1
            ) {

                dayText =
                    "Tomorrow";

            } else {

                dayText =
                    `In ${days} days`;
            }


            examAlertElement.innerHTML = `
                <div class="smart-item">

                    <strong>
                        ${escapeHTML(
                            exam.subject
                        )}
                    </strong>

                    <span>
                        ${dayText}
                    </span>

                    <small>
                        ${formatDate(
                            exam.date
                        )}
                        •
                        ${escapeHTML(
                            exam.time
                        )}
                    </small>

                </div>
            `;
        }
    }


    // PROGRESS SUMMARY

    const progressSummaryElement =
        document.getElementById(
            "smart-progress-summary"
        );


    if (
        progressSummaryElement
    ) {

        if (
            subjects.length === 0
        ) {

            progressSummaryElement.innerHTML = `
                <p class="empty-message">
                    Add subjects to see your progress.
                </p>
            `;

        } else {

            const totalProgress =
                subjects.reduce(
                    (sum, subject) =>
                        sum +
                        (
                            Number(
                                subject.progress
                            ) || 0
                        ),
                    0
                );


            const averageProgress =
                Math.round(
                    totalProgress /
                    subjects.length
                );


            progressSummaryElement.innerHTML = `

                <div class="smart-progress-value">
                    ${averageProgress}%
                </div>

                <p>
                    Average progress across
                    ${subjects.length}
                    subject${
                        subjects.length === 1
                            ? ""
                            : "s"
                    }.
                </p>

            `;
        }
    }


    // STUDY RECOMMENDATION

    const recommendationElement =
        document.getElementById(
            "study-recommendation"
        );


    if (
        recommendationElement
    ) {

        if (
            subjects.length === 0
        ) {

            recommendationElement.innerHTML = `
                <p>
                    Add your subjects and progress
                    to receive a study recommendation.
                </p>
            `;

        } else {

            const lowestSubject =
                [...subjects].sort(
                    (a, b) =>
                        (
                            Number(
                                a.progress
                            ) || 0
                        ) -
                        (
                            Number(
                                b.progress
                            ) || 0
                        )
                )[0];


            recommendationElement.innerHTML = `
                <p>
                    Focus more on
                    <strong>
                        ${escapeHTML(
                            lowestSubject.name
                        )}
                    </strong>
                    because its current progress is
                    ${
                        Number(
                            lowestSubject.progress
                        ) || 0
                    }%.
                </p>
            `;
        }
    }
}


// ============================================================
// PROGRESS DASHBOARD
// ============================================================

function updateProgressDashboard() {

    const tasks =
        getData(
            TASKS_KEY
        );

    const subjects =
        getData(
            SUBJECTS_KEY
        );

    const completedSessions =
        getCompletedStudySessions();


    const completedTasks =
        tasks.filter(
            task =>
                task.completed
        ).length;


    const pendingTasks =
        tasks.filter(
            task =>
                !task.completed
        ).length;


    let overallProgress = 0;


    if (
        subjects.length > 0
    ) {

        const totalProgress =
            subjects.reduce(
                (sum, subject) =>
                    sum +
                    (
                        Number(
                            subject.progress
                        ) || 0
                    ),
                0
            );


        overallProgress =
            Math.round(
                totalProgress /
                subjects.length
            );
    }


    const overallElement =
        document.getElementById(
            "progress-overall"
        );


    const completedElement =
        document.getElementById(
            "progress-completed-tasks"
        );


    const pendingElement =
        document.getElementById(
            "progress-pending-tasks"
        );


    const sessionsElement =
        document.getElementById(
            "progress-study-sessions"
        );


    const subjectListElement =
        document.getElementById(
            "progress-subject-list"
        );


    const summaryElement =
        document.getElementById(
            "academic-summary-text"
        );


    if (
        overallElement
    ) {

        overallElement.textContent =
            overallProgress +
            "%";
    }


    if (
        completedElement
    ) {

        completedElement.textContent =
            completedTasks;
    }


    if (
        pendingElement
    ) {

        pendingElement.textContent =
            pendingTasks;
    }


    if (
        sessionsElement
    ) {

        sessionsElement.textContent =
            completedSessions;
    }


    if (
        subjectListElement
    ) {

        if (
            subjects.length === 0
        ) {

            subjectListElement.innerHTML = `
                <p class="empty-message">
                    Add subjects to see subject progress.
                </p>
            `;

        } else {

            subjectListElement.innerHTML =
                subjects.map(
                    subject => {

                        const progress =
                            Number(
                                subject.progress
                            ) || 0;


                        return `

                            <div class="progress-subject-item">

                                <div class="progress-subject-header">

                                    <span>
                                        ${escapeHTML(
                                            subject.name
                                        )}
                                    </span>

                                    <strong>
                                        ${progress}%
                                    </strong>

                                </div>

                                <div class="progress-bar">

                                    <div
                                        class="progress-fill"
                                        style="
                                            width:${progress}%
                                        "
                                    ></div>

                                </div>

                            </div>

                        `;

                    }
                ).join("");
        }
    }


    if (
        summaryElement
    ) {

        if (
            subjects.length === 0 &&
            tasks.length === 0 &&
            completedSessions === 0
        ) {

            summaryElement.textContent =
                "Start adding subjects, tasks and study sessions to build your academic progress.";

        } else {

            summaryElement.textContent =
                `Your current average subject progress is ${overallProgress}%. You have completed ${completedTasks} task${completedTasks === 1 ? "" : "s"}, ${pendingTasks} pending task${pendingTasks === 1 ? "" : "s"}, and ${completedSessions} completed study session${completedSessions === 1 ? "" : "s"}.`;
        }
    }
}


// ============================================================
// INTELLIGENT ACADEMIC INSIGHTS
// ============================================================

function updateAcademicInsights() {

    const tasks =
        getData(
            TASKS_KEY
        );

    const subjects =
        getData(
            SUBJECTS_KEY
        );

    const exams =
        getData(
            EXAMS_KEY
        );


    const studyFocusElement =
        document.getElementById(
            "study-focus-insight"
        );


    const subjectInsightElement =
        document.getElementById(
            "subject-insight"
        );


    const taskInsightElement =
        document.getElementById(
            "task-insight"
        );


    const examInsightElement =
        document.getElementById(
            "exam-insight"
        );


    // STUDY FOCUS

    if (
        studyFocusElement
    ) {

        if (
            subjects.length === 0
        ) {

            studyFocusElement.innerHTML = `
                <p>
                    Add subjects to receive a
                    personalized study focus.
                </p>
            `;

        } else {

            const lowestSubject =
                [...subjects].sort(
                    (a, b) =>
                        (
                            Number(
                                a.progress
                            ) || 0
                        ) -
                        (
                            Number(
                                b.progress
                            ) || 0
                        )
                )[0];


            const upcomingExams =
                exams
                    .filter(
                        exam =>
                            getDaysUntil(
                                exam.date
                            ) >= 0
                    )
                    .sort(
                        (a, b) =>
                            new Date(a.date) -
                            new Date(b.date)
                    );


            let message =
                `Focus on ${escapeHTML(lowestSubject.name)}, which currently has ${Number(lowestSubject.progress) || 0}% progress.`;


            if (
                upcomingExams.length > 0
            ) {

                const nearestExam =
                    upcomingExams[0];


                const days =
                    getDaysUntil(
                        nearestExam.date
                    );


                message +=
                    ` Your nearest exam is ${escapeHTML(nearestExam.subject)} ${days === 0 ? "today" : days === 1 ? "tomorrow" : `in ${days} days`}.`;
            }


            studyFocusElement.innerHTML = `
                <p>
                    ${message}
                </p>
            `;
        }
    }


    // SUBJECT INSIGHT

    if (
        subjectInsightElement
    ) {

        if (
            subjects.length === 0
        ) {

            subjectInsightElement.innerHTML = `
                <p>
                    Add subjects to analyze your
                    academic performance.
                </p>
            `;

        } else {

            const total =
                subjects.reduce(
                    (sum, subject) =>
                        sum +
                        (
                            Number(
                                subject.progress
                            ) || 0
                        ),
                    0
                );


            const average =
                Math.round(
                    total /
                    subjects.length
                );


            const lowestSubject =
                [...subjects].sort(
                    (a, b) =>
                        (
                            Number(
                                a.progress
                            ) || 0
                        ) -
                        (
                            Number(
                                b.progress
                            ) || 0
                        )
                )[0];


            subjectInsightElement.innerHTML = `
                <p>
                    Your average subject progress is
                    <strong>
                        ${average}%
                    </strong>.
                    The subject currently needing the
                    most attention is
                    <strong>
                        ${escapeHTML(
                            lowestSubject.name
                        )}
                    </strong>.
                </p>
            `;
        }
    }


    // TASK INSIGHT

    if (
        taskInsightElement
    ) {

        if (
            tasks.length === 0
        ) {

            taskInsightElement.innerHTML = `
                <p>
                    Add tasks to analyze your
                    task completion performance.
                </p>
            `;

        } else {

            const completedTasks =
                tasks.filter(
                    task =>
                        task.completed
                ).length;


            const completionRate =
                Math.round(
                    (
                        completedTasks /
                        tasks.length
                    ) *
                    100
                );


            taskInsightElement.innerHTML = `
                <p>
                    You have completed
                    <strong>
                        ${completedTasks}
                    </strong>
                    out of
                    <strong>
                        ${tasks.length}
                    </strong>
                    tasks, giving you a completion
                    rate of
                    <strong>
                        ${completionRate}%
                    </strong>.
                </p>
            `;
        }
    }


    // EXAM INSIGHT

    if (
        examInsightElement
    ) {

        const upcomingExams =
            exams
                .filter(
                    exam =>
                        getDaysUntil(
                            exam.date
                        ) >= 0
                )
                .sort(
                    (a, b) =>
                        new Date(a.date) -
                        new Date(b.date)
                );


        if (
            upcomingExams.length === 0
        ) {

            examInsightElement.innerHTML = `
                <p>
                    No upcoming exams have been added.
                </p>
            `;

        } else {

            const nearestExam =
                upcomingExams[0];


            const days =
                getDaysUntil(
                    nearestExam.date
                );


            let timingText;


            if (
                days === 0
            ) {

                timingText =
                    "today";

            } else if (
                days === 1
            ) {

                timingText =
                    "tomorrow";

            } else {

                timingText =
                    `in ${days} days`;
            }


            examInsightElement.innerHTML = `
                <p>
                    Your nearest exam is
                    <strong>
                        ${escapeHTML(
                            nearestExam.subject
                        )}
                    </strong>
                    ${timingText}.
                    Plan your revision accordingly.
                </p>
            `;
        }
    }
}


// ============================================================
// ACADEMIC ANALYTICS
// ============================================================

function updateAcademicAnalytics() {

    const tasks =
        getData(
            TASKS_KEY
        );

    const subjects =
        getData(
            SUBJECTS_KEY
        );

    const exams =
        getData(
            EXAMS_KEY
        );

    const completedSessions =
        getCompletedStudySessions();


    const completedTasks =
        tasks.filter(
            task =>
                task.completed
        ).length;


    const pendingTasks =
        tasks.filter(
            task =>
                !task.completed
        ).length;


    let taskCompletionRate = 0;


    if (
        tasks.length > 0
    ) {

        taskCompletionRate =
            Math.round(
                (
                    completedTasks /
                    tasks.length
                ) *
                100
            );
    }


    let averageSubjectProgress = 0;


    if (
        subjects.length > 0
    ) {

        const totalProgress =
            subjects.reduce(
                (sum, subject) =>
                    sum +
                    (
                        Number(
                            subject.progress
                        ) || 0
                    ),
                0
            );


        averageSubjectProgress =
            Math.round(
                totalProgress /
                subjects.length
            );
    }


    const upcomingExams =
        exams.filter(
            exam =>
                getDaysUntil(
                    exam.date
                ) >= 0
        );


    const examPreparation =
        averageSubjectProgress;


    const taskCompletionElement =
        document.getElementById(
            "analytics-task-completion"
        );


    const subjectAverageElement =
        document.getElementById(
            "analytics-subject-average"
        );


    const studySessionsElement =
        document.getElementById(
            "analytics-study-sessions"
        );


    const examPreparationElement =
        document.getElementById(
            "analytics-exam-preparation"
        );


    if (
        taskCompletionElement
    ) {

        taskCompletionElement.textContent =
            taskCompletionRate;
    }


    if (
        subjectAverageElement
    ) {

        subjectAverageElement.textContent =
            averageSubjectProgress;
    }


    if (
        studySessionsElement
    ) {

        studySessionsElement.textContent =
            completedSessions;
    }


    if (
        examPreparationElement
    ) {

        examPreparationElement.textContent =
            examPreparation;
    }


    // PERFORMANCE OVERVIEW

    const performanceElement =
        document.getElementById(
            "analytics-performance-overview"
        );


    if (
        performanceElement
    ) {

        if (
            tasks.length === 0 &&
            subjects.length === 0 &&
            exams.length === 0
        ) {

            performanceElement.innerHTML = `
                <p class="empty-message">
                    Add academic data to view
                    your performance overview.
                </p>
            `;

        } else {

            performanceElement.innerHTML = `

                <div class="analytics-detail-row">

                    <span class="analytics-detail-label">
                        Overall Subject Progress
                    </span>

                    <span class="analytics-detail-value">
                        ${averageSubjectProgress}%
                    </span>

                </div>

                <div class="analytics-detail-row">

                    <span class="analytics-detail-label">
                        Task Completion
                    </span>

                    <span class="analytics-detail-value">
                        ${taskCompletionRate}%
                    </span>

                </div>

                <div class="analytics-detail-row">

                    <span class="analytics-detail-label">
                        Pending Tasks
                    </span>

                    <span class="analytics-detail-value">
                        ${pendingTasks}
                    </span>

                </div>

                <div class="analytics-detail-row">

                    <span class="analytics-detail-label">
                        Upcoming Exams
                    </span>

                    <span class="analytics-detail-value">
                        ${upcomingExams.length}
                    </span>

                </div>

            `;
        }
    }


    // STUDY ACTIVITY

    const studyActivityElement =
        document.getElementById(
            "analytics-study-activity"
        );


    if (
        studyActivityElement
    ) {

        if (
            completedSessions === 0
        ) {

            studyActivityElement.innerHTML = `
                <p class="empty-message">
                    Complete study sessions to see
                    your activity.
                </p>
            `;

        } else {

            const history =
                getStudyHistory();


            const totalMinutes =
                history.reduce(
                    (sum, session) =>
                        sum +
                        (
                            Number(
                                session.duration
                            ) || 25
                        ),
                    0
                );


            const hours =
                Math.floor(
                    totalMinutes /
                    60
                );


            const minutes =
                totalMinutes %
                60;


            let focusTimeText = "";


            if (
                hours > 0
            ) {

                focusTimeText =
                    `${hours} hour${
                        hours === 1
                            ? ""
                            : "s"
                    }`;
            }


            if (
                minutes > 0
            ) {

                if (
                    focusTimeText !== ""
                ) {

                    focusTimeText +=
                        " ";
                }


                focusTimeText +=
                    `${minutes} minute${
                        minutes === 1
                            ? ""
                            : "s"
                    }`;
            }


            if (
                focusTimeText === ""
            ) {

                focusTimeText =
                    "0 minutes";
            }


            studyActivityElement.innerHTML = `

                <div class="analytics-detail-row">

                    <span class="analytics-detail-label">
                        Completed Study Sessions
                    </span>

                    <span class="analytics-detail-value">
                        ${completedSessions}
                    </span>

                </div>

                <div class="analytics-detail-row">

                    <span class="analytics-detail-label">
                        Session Duration
                    </span>

                    <span class="analytics-detail-value">
                        25 minutes
                    </span>

                </div>

                <div class="analytics-detail-row">

                    <span class="analytics-detail-label">
                        Total Focus Time
                    </span>

                    <span class="analytics-detail-value">
                        ${focusTimeText}
                    </span>

                </div>

            `;
        }
    }


    updateVisualAnalytics(
        tasks,
        subjects,
        completedSessions,
        taskCompletionRate,
        averageSubjectProgress
    );


    updateSmartRecommendations(
        tasks,
        subjects,
        exams,
        completedSessions,
        taskCompletionRate,
        averageSubjectProgress
    );


    updateStudyPlanner();

}


// ============================================================
// VISUAL ANALYTICS
// ============================================================

function updateVisualAnalytics(
    tasks,
    subjects,
    completedSessions,
    taskCompletionRate,
    averageSubjectProgress
) {

    // SUBJECT PROGRESS

    const subjectChart =
        document.getElementById(
            "subject-progress-chart"
        );


    if (
        subjectChart
    ) {

        if (
            subjects.length === 0
        ) {

            subjectChart.innerHTML = `
                <p class="empty-message">
                    Add subjects to view the progress chart.
                </p>
            `;

        } else {

            subjectChart.innerHTML =
                subjects.map(
                    subject => {

                        const progress =
                            Math.max(
                                0,
                                Math.min(
                                    100,
                                    Number(
                                        subject.progress
                                    ) || 0
                                )
                            );


                        return `

                            <div class="subject-chart-item">

                                <div class="subject-chart-header">

                                    <span class="subject-chart-name">
                                        ${escapeHTML(
                                            subject.name
                                        )}
                                    </span>

                                    <span class="subject-chart-value">
                                        ${progress}%
                                    </span>

                                </div>

                                <div class="subject-chart-bar">

                                    <div
                                        class="subject-chart-fill"
                                        style="
                                            width:${progress}%
                                        "
                                    ></div>

                                </div>

                            </div>

                        `;

                    }
                ).join("");
        }
    }


    // TASK PERFORMANCE

    const taskChart =
        document.getElementById(
            "task-performance-chart"
        );


    if (
        taskChart
    ) {

        if (
            tasks.length === 0
        ) {

            taskChart.innerHTML = `
                <p class="empty-message">
                    Add tasks to view task performance.
                </p>
            `;

        } else {

            const completedTasks =
                tasks.filter(
                    task =>
                        task.completed
                ).length;


            const pendingTasks =
                tasks.filter(
                    task =>
                        !task.completed
                ).length;


            const completedPercentage =
                Math.round(
                    (
                        completedTasks /
                        tasks.length
                    ) *
                    100
                );


            const pendingPercentage =
                100 -
                completedPercentage;


            taskChart.innerHTML = `

                <div class="task-chart-item">

                    <div class="task-chart-header">

                        <span class="task-chart-label">
                            Completed
                        </span>

                        <span class="task-chart-value">
                            ${completedTasks}
                            (${completedPercentage}%)
                        </span>

                    </div>

                    <div class="task-chart-bar">

                        <div
                            class="task-chart-fill"
                            style="
                                width:${completedPercentage}%;
                                background:#22c55e;
                            "
                        ></div>

                    </div>

                </div>


                <div class="task-chart-item">

                    <div class="task-chart-header">

                        <span class="task-chart-label">
                            Pending
                        </span>

                        <span class="task-chart-value">
                            ${pendingTasks}
                            (${pendingPercentage}%)
                        </span>

                    </div>

                    <div class="task-chart-bar">

                        <div
                            class="task-chart-fill"
                            style="
                                width:${pendingPercentage}%;
                                background:#f59e0b;
                            "
                        ></div>

                    </div>

                </div>


                <div class="task-chart-item">

                    <div class="task-chart-header">

                        <span class="task-chart-label">
                            Overall Completion
                        </span>

                        <span class="task-chart-value">
                            ${taskCompletionRate}%
                        </span>

                    </div>

                    <div class="task-chart-bar">

                        <div
                            class="task-chart-fill"
                            style="
                                width:${taskCompletionRate}%;
                                background:#2563eb;
                            "
                        ></div>

                    </div>

                </div>

            `;
        }
    }


    // STUDY ACTIVITY

    const studyChart =
        document.getElementById(
            "study-activity-chart"
        );


    if (
        studyChart
    ) {

        const history =
            getStudyHistory();


        if (
            completedSessions === 0 ||
            history.length === 0
        ) {

            studyChart.innerHTML = `
                <p class="empty-message">
                    Complete study sessions to view activity.
                </p>
            `;

        } else {

            const totalMinutes =
                history.reduce(
                    (sum, session) =>
                        sum +
                        (
                            Number(
                                session.duration
                            ) || 25
                        ),
                    0
                );


            const hours =
                Math.floor(
                    totalMinutes /
                    60
                );


            const minutes =
                totalMinutes %
                60;


            let totalTimeText;


            if (
                hours > 0 &&
                minutes > 0
            ) {

                totalTimeText =
                    `${hours}h ${minutes}m`;

            } else if (
                hours > 0
            ) {

                totalTimeText =
                    `${hours}h`;

            } else {

                totalTimeText =
                    `${minutes}m`;
            }


            const today =
                new Date();


            today.setHours(
                0,
                0,
                0,
                0
            );


            const dailyData = [];


            for (
                let i = 6;
                i >= 0;
                i--
            ) {

                const date =
                    new Date(today);


                date.setDate(
                    today.getDate() -
                    i
                );


                const dateKey =
                    date
                        .toISOString()
                        .split("T")[0];


                const sessionsForDay =
                    history.filter(
                        session => {

                            const sessionDate =
                                new Date(
                                    session.date
                                );


                            const sessionKey =
                                sessionDate
                                    .toISOString()
                                    .split("T")[0];


                            return (
                                sessionKey ===
                                dateKey
                            );

                        }
                    ).length;


                dailyData.push({

                    date:
                        date,

                    sessions:
                        sessionsForDay

                });
            }


            const maxSessions =
                Math.max(
                    ...dailyData.map(
                        item =>
                            item.sessions
                    ),
                    1
                );


            const bars =
                dailyData.map(
                    item => {

                        const height =
                            Math.max(
                                8,
                                (
                                    item.sessions /
                                    maxSessions
                                ) * 100
                            );


                        const dayLabel =
                            item.date.toLocaleDateString(
                                "en-IN",
                                {
                                    weekday:
                                        "short"
                                }
                            );


                        return `

                            <div
                                class="study-session-bar"
                                style="
                                    height:${height}px
                                "
                                title="
                                    ${dayLabel}:
                                    ${item.sessions}
                                    session${
                                        item.sessions === 1
                                            ? ""
                                            : "s"
                                    }
                                "
                            ></div>

                        `;

                    }
                ).join("");


            const labels =
                dailyData.map(
                    item => {

                        const dayLabel =
                            item.date.toLocaleDateString(
                                "en-IN",
                                {
                                    weekday:
                                        "short"
                                }
                            );


                        return `
                            <span>
                                ${dayLabel}
                            </span>
                        `;

                    }
                ).join("");


            studyChart.innerHTML = `

                <div class="study-chart-summary">

                    <span class="study-chart-label">
                        Completed Sessions
                    </span>

                    <span class="study-chart-value">
                        ${completedSessions}
                    </span>

                </div>


                <div class="study-chart-summary">

                    <span class="study-chart-label">
                        Total Focus Time
                    </span>

                    <span class="study-chart-value">
                        ${totalTimeText}
                    </span>

                </div>


                <div class="study-session-bars">

                    ${bars}

                </div>


                <div
                    class="study-session-labels"
                    style="
                        justify-content:space-between;
                        gap:0;
                    "
                >

                    ${labels}

                </div>

            `;
        }
    }


    // ACADEMIC SUMMARY

    const summaryChart =
        document.getElementById(
            "academic-summary-chart"
        );


    if (
        summaryChart
    ) {

        if (
            tasks.length === 0 &&
            subjects.length === 0 &&
            completedSessions === 0
        ) {

            summaryChart.innerHTML = `
                <p class="empty-message">
                    Add academic data to generate
                    your summary.
                </p>
            `;

        } else {

            summaryChart.innerHTML = `

                <div class="summary-meter">

                    <div class="summary-meter-header">

                        <span class="summary-meter-label">
                            Subject Progress
                        </span>

                        <span class="summary-meter-value">
                            ${averageSubjectProgress}%
                        </span>

                    </div>

                    <div class="summary-meter-track">

                        <div
                            class="summary-meter-fill"
                            style="
                                width:${averageSubjectProgress}%
                            "
                        ></div>

                    </div>

                </div>


                <div class="summary-meter">

                    <div class="summary-meter-header">

                        <span class="summary-meter-label">
                            Task Completion
                        </span>

                        <span class="summary-meter-value">
                            ${taskCompletionRate}%
                        </span>

                    </div>

                    <div class="summary-meter-track">

                        <div
                            class="summary-meter-fill"
                            style="
                                width:${taskCompletionRate}%
                            "
                        ></div>

                    </div>

                </div>


                <div class="summary-meter">

                    <div class="summary-meter-header">

                        <span class="summary-meter-label">
                            Study Sessions
                        </span>

                        <span class="summary-meter-value">
                            ${completedSessions}
                        </span>

                    </div>

                    <div class="summary-meter-track">

                        <div
                            class="summary-meter-fill"
                            style="
                                width:${Math.min(
                                    completedSessions * 10,
                                    100
                                )}%
                            "
                        ></div>

                    </div>

                </div>

            `;
        }
    }
}


// ============================================================
// SMART RECOMMENDATION ENGINE
// ============================================================

function updateSmartRecommendations(
    tasks = getData(TASKS_KEY),
    subjects = getData(SUBJECTS_KEY),
    exams = getData(EXAMS_KEY),
    completedSessions = getCompletedStudySessions(),
    taskCompletionRate = calculateTaskCompletionRate(tasks),
    averageSubjectProgress = calculateAverageSubjectProgress(subjects)
) {

    const container =
        document.getElementById(
            "smart-recommendations"
        );


    if (!container) {
        return;
    }


    const recommendations = [];


    // LOWEST SUBJECT

    if (
        subjects.length > 0
    ) {

        const lowestSubject =
            [...subjects].sort(
                (a, b) =>
                    (
                        Number(
                            a.progress
                        ) || 0
                    ) -
                    (
                        Number(
                            b.progress
                        ) || 0
                    )
            )[0];


        const lowestProgress =
            Number(
                lowestSubject.progress
            ) || 0;


        if (
            lowestProgress < 50
        ) {

            recommendations.push({

                icon:
                    "📚",

                title:
                    "Focus on a Low-Progress Subject",

                text:
                    `${escapeHTML(
                        lowestSubject.name
                    )} currently has ${lowestProgress}% progress. Consider giving this subject additional study time.`

            });

        } else {

            recommendations.push({

                icon:
                    "📚",

                title:
                    "Maintain Subject Progress",

                text:
                    `Your lowest subject progress is ${lowestProgress}%. Continue reviewing your subjects regularly to maintain steady progress.`

            });
        }
    }


    // PENDING TASKS

    const pendingTasks =
        tasks.filter(
            task =>
                !task.completed
        ).length;


    if (
        pendingTasks >= 5
    ) {

        recommendations.push({

            icon:
                "✅",

            title:
                "Reduce Pending Tasks",

            text:
                `You currently have ${pendingTasks} pending tasks. Consider completing the most important tasks first.`

        });

    } else if (
        pendingTasks > 0
    ) {

        recommendations.push({

            icon:
                "✅",

            title:
                "Keep Completing Tasks",

            text:
                `You have ${pendingTasks} pending task${pendingTasks === 1 ? "" : "s"}. Completing them will improve your task completion rate.`

        });

    } else if (
        tasks.length > 0
    ) {

        recommendations.push({

            icon:
                "🎉",

            title:
                "All Tasks Completed",

            text:
                "You have no pending tasks right now. You can use the available time for revision or preparation."

        });
    }


    // UPCOMING EXAM

    const upcomingExams =
        exams
            .filter(
                exam =>
                    getDaysUntil(
                        exam.date
                    ) >= 0
            )
            .sort(
                (a, b) =>
                    new Date(a.date) -
                    new Date(b.date)
            );


    if (
        upcomingExams.length > 0
    ) {

        const nearestExam =
            upcomingExams[0];


        const days =
            getDaysUntil(
                nearestExam.date
            );


        if (
            days <= 3
        ) {

            recommendations.push({

                icon:
                    "🚨",

                title:
                    "Exam Preparation",

                text:
                    `Your ${escapeHTML(
                        nearestExam.subject
                    )} exam is ${
                        days === 0
                            ? "today"
                            : days === 1
                                ? "tomorrow"
                                : `in ${days} days`
                    }. Prioritize revision and exam preparation.`

            });

        } else if (
            days <= 7
        ) {

            recommendations.push({

                icon:
                    "📝",

                title:
                    "Upcoming Exam",

                text:
                    `${escapeHTML(
                        nearestExam.subject
                    )} is scheduled in ${days} days. Start or continue your revision plan now.`

            });

        } else {

            recommendations.push({

                icon:
                    "📅",

                title:
                    "Plan Ahead",

                text:
                    `Your next exam is ${escapeHTML(
                        nearestExam.subject
                    )} in ${days} days. You have time to create a steady revision schedule.`

            });
        }
    }


    // STUDY SESSIONS

    if (
        completedSessions === 0
    ) {

        recommendations.push({

            icon:
                "⏱️",

            title:
                "Start a Study Session",

            text:
                "You have not completed a study session yet. Try a 25-minute focused study session using the Study Timer."

        });

    } else if (
        completedSessions < 3
    ) {

        recommendations.push({

            icon:
                "⏱️",

            title:
                "Build a Study Routine",

            text:
                `You have completed ${completedSessions} study session${completedSessions === 1 ? "" : "s"}. Try to maintain a regular focused-study routine.`

        });

    } else {

        recommendations.push({

            icon:
                "🔥",

            title:
                "Keep Your Study Momentum",

            text:
                `You have completed ${completedSessions} study sessions. Continue maintaining consistent focused study time.`

        });
    }


    // OVERALL ACADEMIC RECOMMENDATION

    if (
        subjects.length > 0 &&
        tasks.length > 0
    ) {

        if (
            averageSubjectProgress < 50 &&
            taskCompletionRate < 50
        ) {

            recommendations.push({

                icon:
                    "🎯",

                title:
                    "Create a Consistent Study Plan",

                text:
                    "Both subject progress and task completion are currently below 50%. Break your academic work into smaller daily goals."

            });

        } else if (
            averageSubjectProgress >= 75 &&
            taskCompletionRate >= 75
        ) {

            recommendations.push({

                icon:
                    "🌟",

                title:
                    "Maintain Your Progress",

                text:
                    "Your subject progress and task completion are both strong. Continue following your current study routine and review regularly."

            });

        } else {

            recommendations.push({

                icon:
                    "🎯",

                title:
                    "Balance Study and Tasks",

                text:
                    "Keep a balance between improving subject progress and completing academic tasks."

            });
        }
    }


    // DISPLAY ONLY THE FIRST 5

    const visibleRecommendations =
        recommendations.slice(
            0,
            5
        );


    if (
        visibleRecommendations.length === 0
    ) {

        container.innerHTML = `

            <div class="recommendation-item">

                <div class="recommendation-icon">
                    💡
                </div>

                <div class="recommendation-content">

                    <h4>
                        Getting Started
                    </h4>

                    <p>
                        Add subjects, tasks, and exams
                        to receive personalized recommendations.
                    </p>

                </div>

            </div>

        `;

        return;
    }


    container.innerHTML =
        visibleRecommendations.map(
            recommendation => `

                <div class="recommendation-item">

                    <div class="recommendation-icon">
                        ${recommendation.icon}
                    </div>

                    <div class="recommendation-content">

                        <h4>
                            ${recommendation.title}
                        </h4>

                        <p>
                            ${recommendation.text}
                        </p>

                    </div>

                </div>

            `
        ).join("");
}


// ============================================================
// CALCULATION HELPERS
// ============================================================

function calculateTaskCompletionRate(
    tasks
) {

    if (
        !tasks ||
        tasks.length === 0
    ) {

        return 0;

    }


    const completedTasks =
        tasks.filter(
            task =>
                task.completed
        ).length;


    return Math.round(
        (
            completedTasks /
            tasks.length
        ) *
        100
    );
}


function calculateAverageSubjectProgress(
    subjects
) {

    if (
        !subjects ||
        subjects.length === 0
    ) {

        return 0;

    }


    const total =
        subjects.reduce(
            (sum, subject) =>
                sum +
                (
                    Number(
                        subject.progress
                    ) || 0
                ),
            0
        );


    return Math.round(
        total /
        subjects.length
    );
}


// ============================================================
// DAILY STUDY PLANNER
// ============================================================

function updateStudyPlanner() {

    const planner =
        document.getElementById(
            "study-planner"
        );


    if (!planner) {
        return;
    }


    const tasks =
        getData(
            TASKS_KEY
        );


    const subjects =
        getData(
            SUBJECTS_KEY
        );


    const exams =
        getData(
            EXAMS_KEY
        );


    const completedSessions =
        getCompletedStudySessions();


    const pendingTasks =
        tasks.filter(
            task =>
                !task.completed
        );


    const upcomingExams =
        exams
            .filter(
                exam =>
                    getDaysUntil(
                        exam.date
                    ) >= 0
            )
            .sort(
                (a, b) =>
                    new Date(a.date) -
                    new Date(b.date)
            );


    const plan = [];


    // ========================================================
    // PRIORITY 1 — VERY NEAR EXAM
    // ========================================================

    if (
        upcomingExams.length > 0
    ) {

        const nearestExam =
            upcomingExams[0];


        const days =
            getDaysUntil(
                nearestExam.date
            );


        if (
            days <= 7
        ) {

            plan.push({

                icon:
                    "📝",

                title:
                    `Revise ${nearestExam.subject}`,

                text:
                    days === 0
                        ? `Your ${nearestExam.subject} exam is today. Focus on important concepts, formulas, definitions, and final revision.`
                        : days === 1
                            ? `Your ${nearestExam.subject} exam is tomorrow. Prioritize revision of important topics and practice questions.`
                            : `Your ${nearestExam.subject} exam is in ${days} days. Start your revision today and divide the syllabus into smaller sections.`

            });

        }
    }


    // ========================================================
    // PRIORITY 2 — LOWEST SUBJECT
    // ========================================================

    if (
        subjects.length > 0
    ) {

        const weakestSubject =
            [...subjects].sort(
                (a, b) =>
                    (
                        Number(
                            a.progress
                        ) || 0
                    ) -
                    (
                        Number(
                            b.progress
                        ) || 0
                    )
            )[0];


        const progress =
            Number(
                weakestSubject.progress
            ) || 0;


        plan.push({

            icon:
                "📚",

            title:
                `Study ${weakestSubject.name}`,

            text:
                `${weakestSubject.name} currently has ${progress}% progress. Spend a focused study block improving this subject.`

        });
    }


    // ========================================================
    // PRIORITY 3 — PENDING TASK
    // ========================================================

    if (
        pendingTasks.length > 0
    ) {

        const task =
            pendingTasks[0];


        plan.push({

            icon:
                "✅",

            title:
                `Complete: ${task.title}`,

            text:
                task.description
                    ? escapeHTML(
                        task.description
                    )
                    : "Complete this pending academic task before moving to less important work."

        });
    }


    // ========================================================
    // PRIORITY 4 — STUDY TIMER
    // ========================================================

    if (
        completedSessions === 0
    ) {

        plan.push({

            icon:
                "⏱️",

            title:
                "Complete a 25-Minute Study Session",

            text:
                "Use the Study Timer for one focused 25-minute session. Keep distractions away until the session is complete."

        });

    } else {

        plan.push({

            icon:
                "⏱️",

            title:
                "Complete Another Focus Session",

            text:
                `You have completed ${completedSessions} study session${completedSessions === 1 ? "" : "s"}. Add another focused 25-minute session to today's study routine.`

        });
    }


    // ========================================================
    // PRIORITY 5 — REVIEW
    // ========================================================

    if (
        subjects.length > 0 &&
        pendingTasks.length === 0 &&
        upcomingExams.length === 0
    ) {

        plan.push({

            icon:
                "🔄",

            title:
                "Review Your Subjects",

            text:
                "There are no pending tasks or upcoming exams. Use today's study time for revision and strengthening your subject knowledge."

        });
    }


    // ========================================================
    // NO DATA
    // ========================================================

    if (
        plan.length === 0
    ) {

        planner.innerHTML = `

            <div class="study-plan-item">

                <div class="study-plan-number">
                    1
                </div>

                <div class="study-plan-content">

                    <h4>
                        Getting Your Study Plan Ready
                    </h4>

                    <p>
                        Add subjects, tasks, and exams
                        to generate your personalized
                        study plan.
                    </p>

                </div>

            </div>

        `;

        return;
    }


    // ========================================================
    // LIMIT TO 5 DAILY ACTIVITIES
    // ========================================================

    const dailyPlan =
        plan.slice(
            0,
            5
        );


    planner.innerHTML =
        dailyPlan.map(
            (item, index) => `

                <div class="study-plan-item">

                    <div class="study-plan-number">
                        ${index + 1}
                    </div>

                    <div class="study-plan-content">

                        <h4>
                            ${item.icon}
                            ${escapeHTML(
                                item.title
                            )}
                        </h4>

                        <p>
                            ${item.text}
                        </p>

                    </div>

                </div>

            `
        ).join("");
}


// ============================================================
// SIDEBAR NAVIGATION
// ============================================================

function setupNavigation() {

    const navItems =
        document.querySelectorAll(
            ".nav-item"
        );


    const sections =
        document.querySelectorAll(
            ".dashboard-section"
        );


    navItems.forEach(
        item => {

            item.addEventListener(
                "click",
                function(event) {

                    event.preventDefault();


                    const targetId =
                        this.getAttribute(
                            "href"
                        );


                    if (!targetId) {
                        return;
                    }


                    const targetSection =
                        document.querySelector(
                            targetId
                        );


                    if (!targetSection) {
                        return;
                    }


                    navItems.forEach(
                        nav => {

                            nav.classList.remove(
                                "active"
                            );

                        }
                    );


                    this.classList.add(
                        "active"
                    );


                    sections.forEach(
                        section => {

                            section.style.display =
                                "none";

                        }
                    );


                    targetSection.style.display =
                        "block";


                    window.scrollTo({

                        top:
                            0,

                        behavior:
                            "smooth"

                    });

                }
            );

        }
    );


    sections.forEach(
        section => {

            section.style.display =
                "none";

        }
    );


    const dashboardSection =
        document.querySelector(
            "#dashboard"
        );


    if (
        dashboardSection
    ) {

        dashboardSection.style.display =
            "block";

    }


    const firstNav =
        document.querySelector(
            '.nav-item[href="#dashboard"]'
        );


    if (
        firstNav
    ) {

        firstNav.classList.add(
            "active"
        );

    }
}


// ============================================================
// INITIAL APPLICATION LOAD
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        renderTasks();

        renderSubjects();

        renderNotes();

        renderSchedule();

        renderExams();

        updateTimerDisplay();

        updateDashboardStats();

        updateSmartDashboard();

        updateProgressDashboard();

        updateAcademicInsights();

        updateAcademicAnalytics();

        updateSmartRecommendations();

        updateStudyPlanner();

        setupNavigation();

    }
);
document
    .getElementById("add-task-button")
    .addEventListener("click", addTask);
    /* ============================================================
   SMART STUDY ASSISTANT
   ============================================================ */

function getAIStudyResponse(question) {

    const tasks =
        getData(TASKS_KEY);

    const subjects =
        getData(SUBJECTS_KEY);

    const exams =
        getData(EXAMS_KEY);

    const studyHistory =
        getStudyHistory();


    const pendingTasks =
        tasks.filter(
            task => !task.completed
        );


    const completedTasks =
        tasks.filter(
            task => task.completed
        );


    let response = "";


    /* --------------------------------------------------------
       WHAT SHOULD I STUDY TODAY?
       -------------------------------------------------------- */

    if (
        question.includes("what should i study") ||
        question.includes("study today") ||
        question.includes("what to study")
    ) {

        if (
            exams.length === 0 &&
            subjects.length === 0 &&
            pendingTasks.length === 0
        ) {

            return `
                <p>
                    I don't have enough academic data yet.
                    Add some subjects, tasks, or exams and
                    I'll create a study recommendation for you.
                </p>
            `;

        }


        let weakestSubject = null;


        if (subjects.length > 0) {

            weakestSubject =
                subjects.reduce(
                    (weakest, subject) => {

                        const currentProgress =
                            Number(
                                subject.progress || 0
                            );

                        const weakestProgress =
                            Number(
                                weakest.progress || 0
                            );

                        return currentProgress <
                            weakestProgress
                            ? subject
                            : weakest;

                    }
                );

        }


        let nearestExam = null;


        if (exams.length > 0) {

            const today =
                new Date();

            nearestExam =
                exams
                    .filter(
                        exam =>
                            new Date(
                                exam.date
                            ) >= today
                    )
                    .sort(
                        (a, b) =>
                            new Date(a.date) -
                            new Date(b.date)
                    )[0];

        }


        if (nearestExam) {

            response += `
                <p>
                    📝 <strong>Priority:</strong>
                    Prepare for your upcoming
                    <strong>
                        ${escapeHTML(
                            nearestExam.subject
                        )}
                    </strong>
                    exam on
                    <strong>
                        ${escapeHTML(
                            nearestExam.date
                        )}
                    </strong>.
                </p>
            `;

        }


        if (weakestSubject) {

            response += `
                <p>
                    📚 <strong>Focus subject:</strong>
                    Spend some time on
                    <strong>
                        ${escapeHTML(
                            weakestSubject.name
                        )}
                    </strong>,
                    which currently has
                    <strong>
                        ${Number(
                            weakestSubject.progress || 0
                        )}%
                    </strong>
                    progress.
                </p>
            `;

        }


        if (pendingTasks.length > 0) {

            const nextTask =
                pendingTasks[0];

            response += `
                <p>
                    📝 <strong>Task:</strong>
                    Work on
                    <strong>
                        ${escapeHTML(
                            nextTask.title
                        )}
                    </strong>.
                </p>
            `;

        }


        if (studyHistory.length === 0) {

            response += `
                <p>
                    ⏱️ You haven't completed a study
                    session yet. Try starting a
                    25-minute focus session.
                </p>
            `;

        } else {

            response += `
                <p>
                    ⏱️ You've completed
                    <strong>
                        ${studyHistory.length}
                    </strong>
                    study session(s). Keep the
                    consistency going!
                </p>
            `;

        }

    }


    /* --------------------------------------------------------
       SUBJECT NEEDING ATTENTION
       -------------------------------------------------------- */

    else if (
        question.includes("subject") &&
        (
            question.includes("attention") ||
            question.includes("weak") ||
            question.includes("focus")
        )
    ) {

        if (subjects.length === 0) {

            return `
                <p>
                    📚 No subjects have been added yet.
                    Add your subjects and their progress
                    so I can identify which one needs
                    more attention.
                </p>
            `;

        }


        const weakestSubject =
            subjects.reduce(
                (weakest, subject) => {

                    return Number(
                        subject.progress || 0
                    ) <
                    Number(
                        weakest.progress || 0
                    )
                        ? subject
                        : weakest;

                }
            );


        response = `
            <p>
                📊 Your subject that currently needs
                the most attention is
                <strong>
                    ${escapeHTML(
                        weakestSubject.name
                    )}
                </strong>.
            </p>

            <p>
                Current progress:
                <strong>
                    ${Number(
                        weakestSubject.progress || 0
                    )}%
                </strong>
            </p>

            <p>
                💡 Consider spending your next study
                session improving this subject.
            </p>
        `;

    }


    /* --------------------------------------------------------
       EXAM PREPARATION
       -------------------------------------------------------- */

    else if (
        question.includes("exam") ||
        question.includes("exams")
    ) {

        if (exams.length === 0) {

            response = `
                <p>
                    📝 You don't have any exams added yet.
                </p>

                <p>
                    Add your upcoming exams and I'll
                    help you prioritize your preparation.
                </p>
            `;

        } else {

            const upcomingExams =
                exams
                    .filter(
                        exam =>
                            new Date(exam.date) >=
                            new Date()
                    )
                    .sort(
                        (a, b) =>
                            new Date(a.date) -
                            new Date(b.date)
                    );


            if (upcomingExams.length === 0) {

                response = `
                    <p>
                        ✅ There are no upcoming exams
                        in your schedule.
                    </p>
                `;

            } else {

                response = `
                    <p>
                        📝 Here are your upcoming exams:
                    </p>
                `;


                upcomingExams
                    .slice(0, 5)
                    .forEach(
                        exam => {

                            response += `
                                <p>
                                    • <strong>
                                        ${escapeHTML(
                                            exam.subject
                                        )}
                                    </strong>
                                    —
                                    ${escapeHTML(
                                        exam.date
                                    )}
                                </p>
                            `;

                        }
                    );

            }

        }

    }


    /* --------------------------------------------------------
       TASKS
       -------------------------------------------------------- */

    else if (
        question.includes("task") ||
        question.includes("tasks")
    ) {

        response = `
            <p>
                📝 You currently have
                <strong>
                    ${pendingTasks.length}
                </strong>
                pending task(s) and
                <strong>
                    ${completedTasks.length}
                </strong>
                completed task(s).
            </p>
        `;


        if (pendingTasks.length > 0) {

            response += `
                <p>
                    Your next pending task is:
                    <strong>
                        ${escapeHTML(
                            pendingTasks[0].title
                        )}
                    </strong>
                </p>
            `;

        }

    }


    /* --------------------------------------------------------
       DEFAULT RESPONSE
       -------------------------------------------------------- */

    else {

        response = `
            <p>
                🤖 I can help you understand your
                academic data.
            </p>

            <p>
                Try asking:
            </p>

            <p>
                • What should I study today?
            </p>

            <p>
                • Which subject needs the most attention?
            </p>

            <p>
                • What exams should I prepare for?
            </p>

            <p>
                • How many tasks do I have?
            </p>
        `;

    }


    return response;

}


/* ============================================================
   DISPLAY AI MESSAGE
   ============================================================ */

function addAIMessage(
    message,
    type = "assistant"
) {

    const messages =
        document.getElementById(
            "ai-assistant-messages"
        );

    if (!messages) {
        return;
    }


    const messageDiv =
        document.createElement("div");


    messageDiv.className =
        `ai-message ${
            type === "user"
                ? "user-message"
                : "assistant-message"
        }`;


    if (type === "user") {

        messageDiv.innerHTML = `
            <div class="ai-message-icon">
                👤
            </div>

            <div class="ai-message-content">

                <strong>
                    You
                </strong>

                <p>
                    ${escapeHTML(message)}
                </p>

            </div>
        `;

    } else {

        messageDiv.innerHTML = `
            <div class="ai-message-icon">
                🤖
            </div>

            <div class="ai-message-content">

                <strong>
                    Smart Study Assistant
                </strong>

                ${message}

            </div>
        `;

    }


    messages.appendChild(
        messageDiv
    );


    messages.scrollTop =
        messages.scrollHeight;

}


/* ============================================================
   SEND AI QUESTION
   ============================================================ */

function sendAIQuestion() {

    const input =
        document.getElementById(
            "ai-assistant-input"
        );

    if (!input) {
        return;
    }


    const question =
        input.value.trim();


    if (!question) {
        return;
    }


    addAIMessage(
        question,
        "user"
    );


    const response =
        getAIStudyResponse(
            question.toLowerCase()
        );


    setTimeout(
        () => {

            addAIMessage(
                response,
                "assistant"
            );

        },
        300
    );


    input.value = "";

}


/* ============================================================
   AI ASSISTANT EVENTS
   ============================================================ */

function initializeAIStudyAssistant() {

    const sendButton =
        document.getElementById(
            "ai-assistant-send"
        );


    const input =
        document.getElementById(
            "ai-assistant-input"
        );


    if (
        sendButton &&
        !sendButton.dataset.initialized
    ) {

        sendButton.addEventListener(
            "click",
            sendAIQuestion
        );

        sendButton.dataset.initialized =
            "true";

    }


    if (
        input &&
        !input.dataset.initialized
    ) {

        input.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Enter"
                ) {

                    sendAIQuestion();

                }

            }
        );


        input.dataset.initialized =
            "true";

    }


    const suggestionButtons =
        document.querySelectorAll(
            ".ai-suggestion-button"
        );


    suggestionButtons.forEach(
        button => {

            if (
                button.dataset.initialized
            ) {
                return;
            }


            button.addEventListener(
                "click",
                () => {

                    const question =
                        button.dataset.question;


                    const input =
                        document.getElementById(
                            "ai-assistant-input"
                        );


                    if (input) {

                        input.value =
                            question;

                        sendAIQuestion();

                    }

                }
            );


            button.dataset.initialized =
                "true";

        }
    );

}


/* ============================================================
   INITIALIZE AI ASSISTANT
   ============================================================ */

initializeAIStudyAssistant();
/* ============================================================
   LOGIN PROTECTION
   ============================================================ */

function checkLoginStatus() {

    const isLoggedIn =
        localStorage.getItem(
            "smartStudentLoggedIn"
        );


    if (isLoggedIn !== "true") {

        window.location.href =
            "login.html";

    }

}


/* ============================================================
   CHECK LOGIN
   ============================================================ */

checkLoginStatus();
/* ============================================================
   NOTIFICATIONS & REMINDERS
   ============================================================ */

function renderNotifications() {

    const notificationsList =
        document.getElementById("notifications-list");

    if (!notificationsList) {
        return;
    }

    const tasks =
        getData(TASKS_KEY, []);

    const exams =
        getData(EXAMS_KEY, []);

    const notifications = [];

    const today = new Date();
    today.setHours(0, 0, 0, 0);


    /* --------------------------------------------------------
       TASK NOTIFICATIONS
    -------------------------------------------------------- */

    tasks.forEach(task => {

        if (task.completed) {
            return;
        }

        if (!task.dueDate) {
            return;
        }

        const dueDate =
            new Date(task.dueDate);

        dueDate.setHours(0, 0, 0, 0);

        const difference =
            Math.round(
                (dueDate - today) /
                (1000 * 60 * 60 * 24)
            );


        if (difference < 0) {

            notifications.push({
                type: "danger",
                icon: "🔴",
                message:
                    `Task "${task.title}" is overdue.`
            });

        }

        else if (difference === 0) {

            notifications.push({
                type: "warning",
                icon: "🟠",
                message:
                    `Task "${task.title}" is due today.`
            });

        }

        else if (difference === 1) {

            notifications.push({
                type: "warning",
                icon: "🟡",
                message:
                    `Task "${task.title}" is due tomorrow.`
            });

        }

    });


    /* --------------------------------------------------------
       EXAM NOTIFICATIONS
    -------------------------------------------------------- */

    exams.forEach(exam => {

        if (!exam.date) {
            return;
        }

        const examDate =
            new Date(exam.date);

        examDate.setHours(0, 0, 0, 0);

        const difference =
            Math.round(
                (examDate - today) /
                (1000 * 60 * 60 * 24)
            );


        if (difference < 0) {
            return;
        }


        if (difference === 0) {

            notifications.push({
                type: "danger",
                icon: "📝",
                message:
                    `Your ${exam.subject} exam is today.`
            });

        }

        else if (difference <= 3) {

            notifications.push({
                type: "warning",
                icon: "📚",
                message:
                    `${exam.subject} exam is in ${difference} day${difference === 1 ? "" : "s"}.`
            });

        }

    });


    /* --------------------------------------------------------
       DISPLAY EMPTY STATE
    -------------------------------------------------------- */

    if (notifications.length === 0) {

        notificationsList.innerHTML = `
            <div class="notification-empty">
                🎉 No important notifications right now.
            </div>
        `;

        return;
    }


    /* --------------------------------------------------------
       DISPLAY NOTIFICATIONS
    -------------------------------------------------------- */

    notificationsList.innerHTML =
        notifications.map(notification => {

            return `
                <div class="notification-item ${notification.type}">

                    <span class="notification-icon">
                        ${notification.icon}
                    </span>

                    <span class="notification-message">
                        ${escapeHTML(notification.message)}
                    </span>

                </div>
            `;

        }).join("");

}


/* ============================================================
   INITIALIZE NOTIFICATIONS
   ============================================================ */

renderNotifications();
/* ============================================================
   KNOWLEDGE TEST
   ============================================================ */

/* ------------------------------------------------------------
   KNOWLEDGE TEST QUESTION BANK
   ------------------------------------------------------------ */

const KNOWLEDGE_TEST_QUESTION_BANK = {

    "Database Management Systems": {

        easy: [

            {
                question:
                    "What does DBMS stand for?",

                options: [
                    "Database Management Systems",
                    "Data Backup Management System",
                    "Database Monitoring System",
                    "Data Management Software"
                ],

                answer: 0
            },

            {
                question:
                    "Which SQL command is used to retrieve data?",

                options: [
                    "INSERT",
                    "SELECT",
                    "DELETE",
                    "UPDATE"
                ],

                answer: 1
            },

            {
                question:
                    "Which key uniquely identifies a record in a table?",

                options: [
                    "Foreign Key",
                    "Primary Key",
                    "Candidate Key",
                    "Composite Key"
                ],

                answer: 1
            },

            {
                question:
                    "Which SQL command is used to add a new record?",

                options: [
                    "ADD",
                    "INSERT",
                    "CREATE",
                    "APPEND"
                ],

                answer: 1
            },

            {
                question:
                    "What is a table in a relational database?",

                options: [
                    "A collection of rows and columns",
                    "Only a collection of columns",
                    "Only a collection of rows",
                    "A programming function"
                ],

                answer: 0
            }

        ],


        medium: [

            {
                question:
                    "Which normal form removes partial dependency?",

                options: [
                    "1NF",
                    "2NF",
                    "3NF",
                    "BCNF"
                ],

                answer: 1
            },

            {
                question:
                    "Which command permanently removes a table?",

                options: [
                    "DELETE",
                    "REMOVE",
                    "DROP",
                    "CLEAR"
                ],

                answer: 2
            },

            {
                question:
                    "What is a foreign key used for?",

                options: [
                    "To uniquely identify every database",
                    "To establish a relationship between tables",
                    "To delete duplicate rows",
                    "To encrypt a table"
                ],

                answer: 1
            },

            {
                question:
                    "Which property of a transaction means it is treated as an indivisible unit?",

                options: [
                    "Consistency",
                    "Isolation",
                    "Atomicity",
                    "Durability"
                ],

                answer: 2
            },

            {
                question:
                    "Which SQL clause is used to filter rows?",

                options: [
                    "ORDER BY",
                    "GROUP BY",
                    "WHERE",
                    "HAVING"
                ],

                answer: 2
            }

        ],


        hard: [

            {
                question:
                    "Which normal form eliminates transitive dependency?",

                options: [
                    "1NF",
                    "2NF",
                    "3NF",
                    "4NF"
                ],

                answer: 2
            },

            {
                question:
                    "Which ACID property ensures that committed data survives system failure?",

                options: [
                    "Atomicity",
                    "Consistency",
                    "Isolation",
                    "Durability"
                ],

                answer: 3
            },

            {
                question:
                    "Which join returns only the rows having matching values in both tables?",

                options: [
                    "LEFT JOIN",
                    "RIGHT JOIN",
                    "FULL JOIN",
                    "INNER JOIN"
                ],

                answer: 3
            },

            {
                question:
                    "Which technique is primarily used to improve database query performance?",

                options: [
                    "Indexing",
                    "Normalization only",
                    "Deleting tables",
                    "Removing constraints"
                ],

                answer: 0
            },

            {
                question:
                    "Which SQL clause is used to filter grouped results?",

                options: [
                    "WHERE",
                    "HAVING",
                    "ORDER BY",
                    "LIMIT"
                ],

                answer: 1
            }

        ]

    },


    "Operating System": {

        easy: [

            {
                question:
                    "What is the main function of an operating system?",

                options: [
                    "Manage computer resources",
                    "Create websites",
                    "Design databases",
                    "Write source code"
                ],

                answer: 0
            },

            {
                question:
                    "Which component manages processes in an operating system?",

                options: [
                    "Process scheduler",
                    "Compiler",
                    "Web browser",
                    "Text editor"
                ],

                answer: 0
            },

            {
                question:
                    "What is a process?",

                options: [
                    "A program in execution",
                    "A storage device",
                    "A programming language",
                    "A network cable"
                ],

                answer: 0
            },

            {
                question:
                    "Which scheduling algorithm uses a time quantum?",

                options: [
                    "FCFS",
                    "Round Robin",
                    "SJF",
                    "Priority"
                ],

                answer: 1
            },

            {
                question:
                    "Which memory is directly accessible by the CPU?",

                options: [
                    "Main memory",
                    "Hard disk",
                    "DVD",
                    "USB drive"
                ],

                answer: 0
            }

        ],


        medium: [

            {
                question:
                    "Which scheduling algorithm executes the process with the shortest CPU burst first?",

                options: [
                    "FCFS",
                    "Round Robin",
                    "SJF",
                    "FIFO"
                ],

                answer: 2
            },

            {
                question:
                    "Which condition is necessary for deadlock?",

                options: [
                    "Mutual exclusion",
                    "Compilation",
                    "Paging",
                    "Caching"
                ],

                answer: 0
            },

            {
                question:
                    "What is virtual memory?",

                options: [
                    "A technique that uses secondary storage to extend apparent main memory",
                    "A type of CPU",
                    "A type of keyboard",
                    "A network protocol"
                ],

                answer: 0
            },

            {
                question:
                    "What does a context switch do?",

                options: [
                    "Changes the current process or thread being executed",
                    "Deletes a process permanently",
                    "Formats memory",
                    "Creates a new hard disk"
                ],

                answer: 0
            },

            {
                question:
                    "Which technique divides memory into fixed-size blocks?",

                options: [
                    "Paging",
                    "Segmentation",
                    "Compaction",
                    "Spooling"
                ],

                answer: 0
            }

        ],


        hard: [

            {
                question:
                    "Which of the following is NOT one of the four necessary conditions for deadlock?",

                options: [
                    "Mutual exclusion",
                    "Hold and wait",
                    "Preemption",
                    "Circular wait"
                ],

                answer: 2
            },

            {
                question:
                    "Which algorithm can be used for deadlock avoidance?",

                options: [
                    "Banker's Algorithm",
                    "Round Robin",
                    "FCFS",
                    "FIFO"
                ],

                answer: 0
            },

            {
                question:
                    "What is thrashing?",

                options: [
                    "Excessive paging activity",
                    "CPU overheating",
                    "File deletion",
                    "Network congestion"
                ],

                answer: 0
            },

            {
                question:
                    "Which page replacement algorithm replaces the page that has not been used for the longest period of time?",

                options: [
                    "FIFO",
                    "LRU",
                    "FCFS",
                    "Round Robin"
                ],

                answer: 1
            },

            {
                question:
                    "Which mechanism allows processes to communicate and synchronize by exchanging messages?",

                options: [
                    "Message passing",
                    "Paging",
                    "Spooling",
                    "Fragmentation"
                ],

                answer: 0
            }

        ]

    }

};


/* ------------------------------------------------------------
   SHUFFLE QUESTIONS
   ------------------------------------------------------------ */

function shuffleKnowledgeTestArray(array) {

    const shuffled =
        [...array];

    for (
        let i = shuffled.length - 1;
        i > 0;
        i--
    ) {

        const j =
            Math.floor(
                Math.random() * (i + 1)
            );

        [
            shuffled[i],
            shuffled[j]
        ] =
        [
            shuffled[j],
            shuffled[i]
        ];

    }

    return shuffled;

}


/* ------------------------------------------------------------
   GET QUESTIONS FOR TEST
   ------------------------------------------------------------ */

function getKnowledgeTestQuestions(
    subjectName,
    difficulty,
    questionCount
) {

    const subjectBank =
        KNOWLEDGE_TEST_QUESTION_BANK[
            subjectName
        ];


    if (!subjectBank) {

        return [];

    }


    let questions = [];


    if (difficulty === "mixed") {

        questions = [
            ...subjectBank.easy,
            ...subjectBank.medium,
            ...subjectBank.hard
        ];

    } else {

        questions =
            [
                ...(subjectBank[difficulty] || [])
            ];

    }


    questions =
        shuffleKnowledgeTestArray(
            questions
        );


    return questions.slice(
        0,
        Math.min(
            Number(questionCount),
            questions.length
        )
    );

}


/* ------------------------------------------------------------
   START KNOWLEDGE TEST
   ------------------------------------------------------------ */

let currentKnowledgeTestQuestions = [];

let currentKnowledgeTestSubject = "";

let currentKnowledgeTestScore = 0;


function startKnowledgeTest() {

    const subjectSelect =
        document.getElementById(
            "knowledge-test-subject"
        );

    const questionCountSelect =
        document.getElementById(
            "knowledge-test-question-count"
        );

    const difficultySelect =
        document.getElementById(
            "knowledge-test-difficulty"
        );


    if (
        !subjectSelect ||
        !questionCountSelect ||
        !difficultySelect
    ) {

        return;

    }


    const subject =
        subjectSelect.value;

    const questionCount =
        Number(
            questionCountSelect.value
        );

    const difficulty =
        difficultySelect.value;


    if (!subject) {

        alert(
            "Please select a completed subject."
        );

        return;

    }


    currentKnowledgeTestQuestions =
        getKnowledgeTestQuestions(
            subject,
            difficulty,
            questionCount
        );


    if (
        currentKnowledgeTestQuestions.length === 0
    ) {

        alert(
            "No questions are available for this subject and difficulty."
        );

        return;

    }


    currentKnowledgeTestSubject =
        subject;


    currentKnowledgeTestScore = 0;


    renderKnowledgeTestQuestions();


    const setup =
        document.querySelector(
            ".knowledge-test-setup"
        );

    const testArea =
        document.getElementById(
            "knowledge-test-area"
        );

    const resultArea =
        document.getElementById(
            "knowledge-test-result"
        );


    if (setup) {

        setup.style.display =
            "none";

    }


    if (resultArea) {

        resultArea.style.display =
            "none";

    }


    if (testArea) {

        testArea.style.display =
            "block";

    }

}


/* ------------------------------------------------------------
   RENDER QUESTIONS
   ------------------------------------------------------------ */

function renderKnowledgeTestQuestions() {

    const questionContainer =
        document.getElementById(
            "knowledge-test-questions"
        );


    const progressText =
        document.getElementById(
            "knowledge-test-progress"
        );


    const title =
        document.getElementById(
            "knowledge-test-title"
        );


    if (!questionContainer) {

        return;

    }


    if (title) {

        title.textContent =
            `${currentKnowledgeTestSubject} - Knowledge Test`;

    }


    if (progressText) {

        progressText.textContent =
            `${currentKnowledgeTestQuestions.length} Questions`;

    }


    questionContainer.innerHTML =
        currentKnowledgeTestQuestions.map(
            (question, index) => {

                return `

                    <div class="knowledge-test-question">

                        <h4>
                            ${index + 1}.
                            ${escapeHTML(
                                question.question
                            )}
                        </h4>


                        <div class="knowledge-test-options">

                            ${question.options.map(
                                (option, optionIndex) => {

                                    return `

                                        <label
                                            class="knowledge-test-option"
                                        >

                                            <input
                                                type="radio"
                                                name="knowledge-question-${index}"
                                                value="${optionIndex}"
                                            >

                                            <span>
                                                ${escapeHTML(
                                                    option
                                                )}
                                            </span>

                                        </label>

                                    `;

                                }
                            ).join("")}

                        </div>

                    </div>

                `;

            }
        ).join("");

}


/* ------------------------------------------------------------
   SUBMIT KNOWLEDGE TEST
   ------------------------------------------------------------ */

function submitKnowledgeTest() {

    if (
        currentKnowledgeTestQuestions.length === 0
    ) {

        return;

    }


    let score = 0;


    currentKnowledgeTestQuestions.forEach(
        (question, index) => {

            const selected =
                document.querySelector(
                    `input[name="knowledge-question-${index}"]:checked`
                );


            if (
                selected &&
                Number(selected.value) ===
                Number(question.answer)
            ) {

                score++;

            }

        }
    );


    currentKnowledgeTestScore =
        score;


    showKnowledgeTestResult();

}


/* ------------------------------------------------------------
   SHOW TEST RESULT
   ------------------------------------------------------------ */

function showKnowledgeTestResult() {

    const resultArea =
        document.getElementById(
            "knowledge-test-result"
        );

    const scoreElement =
        document.getElementById(
            "knowledge-test-score"
        );

    const percentageElement =
        document.getElementById(
            "knowledge-test-percentage"
        );

    const messageElement =
        document.getElementById(
            "knowledge-test-result-message"
        );

    if (!resultArea) {
        return;
    }

    const totalQuestions =
        currentKnowledgeTestQuestions.length;

    const percentage =
        totalQuestions > 0
            ? Math.round(
                (currentKnowledgeTestScore /
                    totalQuestions) * 100
            )
            : 0;

    /* --------------------------------------------------------
       DISPLAY RESULT
       -------------------------------------------------------- */

    if (scoreElement) {

        scoreElement.textContent =
            `${currentKnowledgeTestScore} / ${totalQuestions}`;

    }

    if (percentageElement) {

        percentageElement.textContent =
            `${percentage}%`;

    }

    if (messageElement) {

        if (percentage >= 90) {

            messageElement.textContent =
                "Excellent! You have a strong understanding of this subject.";

        } else if (percentage >= 75) {

            messageElement.textContent =
                "Very good! You have a solid understanding of this subject.";

        } else if (percentage >= 50) {

            messageElement.textContent =
                "Good effort! Review the topics you found difficult.";

        } else {

            messageElement.textContent =
                "Keep studying! Review the subject and try the test again.";

        }

    }


    /* --------------------------------------------------------
       SAVE KNOWLEDGE TEST RESULT
       -------------------------------------------------------- */

    const results =
        getData(
            KNOWLEDGE_TEST_RESULTS_KEY
        );

    const result = {

        subject:
            currentKnowledgeTestSubject,

        score:
            currentKnowledgeTestScore,

        total:
            totalQuestions,

        percentage:
            percentage,

        date:
            new Date().toISOString()

    };

    results.push(result);

    saveData(
        KNOWLEDGE_TEST_RESULTS_KEY,
        results
    );


    /* --------------------------------------------------------
       SHOW RESULT AREA
       -------------------------------------------------------- */

    resultArea.style.display =
        "block";


    /* Hide test area */

    const testArea =
        document.getElementById(
            "knowledge-test-area"
        );

    if (testArea) {

        testArea.style.display =
            "none";

    }

}


/* ------------------------------------------------------------
   RETAKE KNOWLEDGE TEST
   ------------------------------------------------------------ */

function retakeKnowledgeTest() {

    const setup =
        document.querySelector(
            ".knowledge-test-setup"
        );

    const resultArea =
        document.getElementById(
            "knowledge-test-result"
        );


    if (resultArea) {

        resultArea.style.display =
            "none";

    }


    if (setup) {

        setup.style.display =
            "block";

    }

}


/* ------------------------------------------------------------
   KNOWLEDGE TEST BUTTON CONNECTIONS
   ------------------------------------------------------------ */

const startKnowledgeTestButton =
    document.getElementById(
        "start-knowledge-test"
    );


const submitKnowledgeTestButton =
    document.getElementById(
        "submit-knowledge-test"
    );


const retakeKnowledgeTestButton =
    document.getElementById(
        "retake-knowledge-test"
    );


if (startKnowledgeTestButton) {

    startKnowledgeTestButton.addEventListener(
        "click",
        startKnowledgeTest
    );

}


if (submitKnowledgeTestButton) {

    submitKnowledgeTestButton.addEventListener(
        "click",
        submitKnowledgeTest
    );

}


if (retakeKnowledgeTestButton) {

    retakeKnowledgeTestButton.addEventListener(
        "click",
        retakeKnowledgeTest
    );

}