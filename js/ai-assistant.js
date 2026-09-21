/* ============================================================
   SMART STUDY ASSISTANT
   ============================================================ */

function sendAIQuestion() {

    const input =
        document.getElementById("ai-assistant-input");

    const messages =
        document.getElementById("ai-assistant-messages");


    if (!input || !messages) {
        return;
    }


    const question =
        input.value.trim();


    if (!question) {
        return;
    }


    /* User message */

    const userMessage =
        document.createElement("div");

    userMessage.className =
        "ai-message user-message";

    userMessage.innerHTML = `
        <div class="ai-message-icon">
            👤
        </div>

        <div class="ai-message-content">

            <strong>
                You
            </strong>

            <p>
                ${escapeHTML(question)}
            </p>

        </div>
    `;

    messages.appendChild(userMessage);


    /* Generate response */

    const response =
        generateStudyResponse(
            question.toLowerCase()
        );


    /* Assistant message */

    const assistantMessage =
        document.createElement("div");

    assistantMessage.className =
        "ai-message assistant-message";

    assistantMessage.innerHTML = `
        <div class="ai-message-icon">
            🤖
        </div>

        <div class="ai-message-content">

            <strong>
                Smart Study Assistant
            </strong>

            ${response}

        </div>
    `;

    messages.appendChild(
        assistantMessage
    );


    messages.scrollTop =
        messages.scrollHeight;


    input.value = "";

}


/* ============================================================
   STUDY RESPONSE ENGINE
   ============================================================ */

function generateStudyResponse(question) {

    const tasks =
        getData(TASKS_KEY);

    const subjects =
        getData(SUBJECTS_KEY);

    const exams =
        getData(EXAMS_KEY);


    const pendingTasks =
        tasks.filter(
            task => !task.completed
        );


    const completedTasks =
        tasks.filter(
            task => task.completed
        );


    /* --------------------------------------------------------
       STUDY TODAY
       -------------------------------------------------------- */

    if (
        question.includes("study today") ||
        question.includes("what should i study") ||
        question.includes("what to study")
    ) {

        let response = `
            <p>
                📚 Based on your current academic data,
                here's what I recommend:
            </p>
        `;


        /* Weakest subject */

        if (subjects.length > 0) {

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


            response += `
                <p>
                    🎯 Focus on
                    <strong>
                        ${escapeHTML(
                            weakestSubject.name
                        )}
                    </strong>
                    because its current progress is
                    <strong>
                        ${Number(
                            weakestSubject.progress || 0
                        )}%
                    </strong>.
                </p>
            `;

        }


        /* Pending task */

        if (pendingTasks.length > 0) {

            response += `
                <p>
                    📝 Work on your pending task:
                    <strong>
                        ${escapeHTML(
                            pendingTasks[0].title
                        )}
                    </strong>.
                </p>
            `;

        }


        /* Upcoming exam */

        if (exams.length > 0) {

            const today =
                new Date();

            today.setHours(
                0,
                0,
                0,
                0
            );


            const upcomingExams =
                exams
                    .filter(
                        exam =>
                            new Date(
                                exam.date +
                                "T00:00:00"
                            ) >= today
                    )
                    .sort(
                        (a, b) =>
                            new Date(
                                a.date
                            ) -
                            new Date(
                                b.date
                            )
                    );


            if (
                upcomingExams.length > 0
            ) {

                const exam =
                    upcomingExams[0];


                response += `
                    <p>
                        📝 Your next exam is
                        <strong>
                            ${escapeHTML(
                                exam.subject
                            )}
                        </strong>
                        on
                        <strong>
                            ${escapeHTML(
                                exam.date
                            )}
                        </strong>.
                    </p>
                `;

            }

        }


        response += `
            <p>
                ⏱️ After that, start a 25-minute
                focused study session.
            </p>
        `;


        return response;

    }


    /* --------------------------------------------------------
       SUBJECT ATTENTION
       -------------------------------------------------------- */

    if (
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
                    📚 You haven't added any subjects yet.
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


        return `
            <p>
                📊 Your lowest-progress subject is
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
                💡 Consider making this subject the
                focus of your next study session.
            </p>
        `;

    }


    /* --------------------------------------------------------
       EXAMS
       -------------------------------------------------------- */

    if (
        question.includes("exam") ||
        question.includes("exams")
    ) {

        if (exams.length === 0) {

            return `
                <p>
                    📝 You don't have any exams
                    scheduled yet.
                </p>
            `;

        }


        return `
            <p>
                📝 You currently have
                <strong>
                    ${exams.length}
                </strong>
                exam(s) in your schedule.
            </p>
        `;

    }


    /* --------------------------------------------------------
       TASKS
       -------------------------------------------------------- */

    if (
        question.includes("task") ||
        question.includes("tasks")
    ) {

        return `
            <p>
                📝 You have
                <strong>
                    ${pendingTasks.length}
                </strong>
                pending task(s).
            </p>

            <p>
                ✅ You have completed
                <strong>
                    ${completedTasks.length}
                </strong>
                task(s).
            </p>
        `;

    }


    /* --------------------------------------------------------
       DEFAULT
       -------------------------------------------------------- */

    return `
        <p>
            🤖 I can help you analyze your academic
            information.
        </p>

        <p>
            Try asking:
        </p>

        <p>
            📚 What should I study today?
        </p>

        <p>
            📊 Which subject needs the most attention?
        </p>

        <p>
            📝 What exams should I prepare for?
        </p>

        <p>
            ✅ How many tasks do I have?
        </p>
    `;

}


/* ============================================================
   BUTTON + INPUT EVENTS
   ============================================================ */

function initializeStudyAssistant() {

    const sendButton =
        document.getElementById(
            "ai-assistant-send"
        );

    const input =
        document.getElementById(
            "ai-assistant-input"
        );


    if (sendButton) {

        sendButton.addEventListener(
            "click",
            sendAIQuestion
        );

    }


    if (input) {

        input.addEventListener(
            "keydown",
            function(event) {

                if (
                    event.key === "Enter"
                ) {

                    sendAIQuestion();

                }

            }
        );

    }


    /*
       IMPORTANT FIX

       Only select suggestion buttons that
       actually have a data-question.

       This prevents the
       "Generate My Study Plan" button
       from sending "undefined".
    */

    const suggestionButtons =
        document.querySelectorAll(
            ".ai-suggestion-button[data-question]"
        );


    suggestionButtons.forEach(
        function(button) {

            button.addEventListener(
                "click",
                function() {

                    const input =
                        document.getElementById(
                            "ai-assistant-input"
                        );


                    if (!input) {
                        return;
                    }


                    const question =
                        button.dataset.question;


                    if (!question) {
                        return;
                    }


                    input.value =
                        question;


                    sendAIQuestion();

                }
            );

        }
    );

}


/* ============================================================
   START ASSISTANT
   ============================================================ */

if (
    document.readyState === "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeStudyAssistant
    );

} else {

    initializeStudyAssistant();

}


/* ============================================================
   ADVANCED AI STUDY PLAN
   ============================================================ */

function generateAIStudyPlan() {

    const subjects =
        getData(SUBJECTS_KEY, []);

    const tasks =
        getData(TASKS_KEY, []);

    const exams =
        getData(EXAMS_KEY, []);


    const messages =
        document.getElementById(
            "ai-assistant-messages"
        );


    if (!messages) {
        return;
    }


    /* --------------------------------------------------------
       CURRENT DATE
    -------------------------------------------------------- */

    const today =
        new Date();

    today.setHours(
        0,
        0,
        0,
        0
    );


    /* --------------------------------------------------------
       FIND PENDING TASKS
    -------------------------------------------------------- */

    const pendingTasks =
        tasks.filter(
            task =>
                !task.completed
        );


    /* --------------------------------------------------------
       FIND UPCOMING EXAMS
    -------------------------------------------------------- */

    const upcomingExams =
        exams
            .filter(exam => {

                if (!exam.date) {
                    return false;
                }

                const examDate =
                    new Date(exam.date);

                examDate.setHours(
                    0,
                    0,
                    0,
                    0
                );

                return examDate >= today;

            })
            .sort(
                (a, b) =>
                    new Date(a.date) -
                    new Date(b.date)
            );


    /* --------------------------------------------------------
       FIND WEAKEST SUBJECT
    -------------------------------------------------------- */

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

                },
                subjects[0]
            );

    }


    /* --------------------------------------------------------
       BUILD STUDY PLAN
    -------------------------------------------------------- */

    const plan = [];


    /* --------------------------------------------------------
       PRIORITY 1 — UPCOMING EXAM
    -------------------------------------------------------- */

    if (upcomingExams.length > 0) {

        const exam =
            upcomingExams[0];

        const examDate =
            new Date(exam.date);

        const daysRemaining =
            Math.max(
                0,
                Math.ceil(
                    (
                        examDate -
                        today
                    ) /
                    (
                        1000 *
                        60 *
                        60 *
                        24
                    )
                )
            );


        plan.push({

            icon: "📝",

            title:
                `Prepare for ${exam.subject}`,

            text:
                daysRemaining === 0
                    ? "Your exam is today. Focus on important topics and revision."
                    : `${daysRemaining} day${daysRemaining === 1 ? "" : "s"} remaining. Give this subject priority.`

        });

    }


    /* --------------------------------------------------------
       PRIORITY 2 — WEAKEST SUBJECT
    -------------------------------------------------------- */

    if (weakestSubject) {

        plan.push({

            icon: "📚",

            title:
                `Study ${weakestSubject.name}`,

            text:
                `Current progress is ${Number(weakestSubject.progress || 0)}%. Spend extra study time improving this subject.`

        });

    }


    /* --------------------------------------------------------
       PRIORITY 3 — PENDING TASK
    -------------------------------------------------------- */

    if (pendingTasks.length > 0) {

        const importantTask =
            pendingTasks.find(
                task =>
                    task.priority === "high"
            ) ||
            pendingTasks[0];


        if (importantTask.title) {

            plan.push({

                icon: "✅",

                title:
                    `Complete: ${importantTask.title}`,

                text:
                    importantTask.description
                        ? escapeHTML(
                            importantTask.description
                        )
                        : "Complete this task before moving to less important work."

            });

        }

    }


    /* --------------------------------------------------------
       PRIORITY 4 — STUDY TIMER
    -------------------------------------------------------- */

    plan.push({

        icon: "⏱️",

        title:
            "Study Session",

        text:
            "Complete a focused 25-minute study session, then take a short break."

    });


    /* --------------------------------------------------------
       PRIORITY 5 — REVIEW
    -------------------------------------------------------- */

    plan.push({

        icon: "🔄",

        title:
            "Quick Review",

        text:
            "Spend 10 minutes reviewing what you studied today and identify anything you still need to understand."

    });


    /* --------------------------------------------------------
       DISPLAY PLAN
    -------------------------------------------------------- */

    const planHTML =
        plan.map(
            item => {

                return `
                    <div class="ai-message assistant-message">

                        <div class="ai-message-icon">
                            ${item.icon}
                        </div>

                        <div class="ai-message-content">

                            <strong>
                                ${escapeHTML(item.title)}
                            </strong>

                            <p>
                                ${item.text}
                            </p>

                        </div>

                    </div>
                `;

            }
        ).join("");


    messages.innerHTML += `

        <div class="ai-message assistant-message">

            <div class="ai-message-icon">
                🤖
            </div>

            <div class="ai-message-content">

                <strong>
                    Your Personalized Study Plan
                </strong>

                <p>
                    Based on your current subjects,
                    tasks, exams, and progress:
                </p>

            </div>

        </div>

        ${planHTML}

    `;


    messages.scrollTop =
        messages.scrollHeight;

}