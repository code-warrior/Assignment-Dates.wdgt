window.onload = () => {
    'use strict';

    const months = [
            `January`,
            `February`,
            `March`,
            `April`,
            `May`,
            `June`,
            `July`,
            `August`,
            `September`,
            `October`,
            `November`,
            `December`
        ],
        HOUR_IN_SECONDS = 3600,
        HOURS_IN_DAY = 24,
        ONE_SECOND_IN_MS = 1000,
        MILLIS_IN_A_DAY = (ONE_SECOND_IN_MS * HOUR_IN_SECONDS * HOURS_IN_DAY),
        DONE = 4,
        OK = 200;

    let midtermDueDateContainer =
            document.querySelector(`[data-midterm-due-date]`),
        semesterAssignmentDueDateContainer =
            document.querySelector(`[data-semester-assignment-due-date]`),
        finalProjectDueDateContainer =
            document.querySelector(`[data-final-project-due-date]`),
        semesterContainer =
            document.querySelector(`header > h1 > span:first-of-type`),
        courseContainer =
            document.querySelector(`header > h1 > i`),
        catalogNumberContainer =
            document.querySelector(`header > h1 > span:last-of-type`),
        collegeContainer =
            document.querySelector(`header > p`),
        midtermLinkURLContainer =
            document.querySelector(`[data-link-to-midterm]`),
        semesterProjectURLContainer =
            document.querySelector(`[data-link-to-semester-assignment]`),
        finalProjectURLContainer =
            document.querySelector(`[data-link-to-final]`),
        daysLeftForMidtermContainer = document.querySelector(
            `[data-days-left-before-midterm-submission]`),
        daysLeftForSemesterAssignmentContainer = document.querySelector(
            `[data-days-left-before-semester-assignment-submission]`),
        daysLeftBeforeFinalContainer = document.querySelector(
            `[data-days-left-before-project-due-submission]`),
        xmlhttp = new XMLHttpRequest(),
        school = `at-queens-college`,
        course = `web-design`,
        file = `project-dates-and-links.txt`,
        url = `https://roy.vanegas.org/teaching/${school}/${course}/${file}`;

    let processResponse = () => {
        if ((xmlhttp.readyState === DONE) && (xmlhttp.status === OK)) {
            let items = xmlhttp.responseText.split(`,`),

                // Retrieve the year, month, and day that the assignments are due.
                midtermDueDateItems = items.slice(4, 7),
                semesterProjectDueDateItems = items.slice(8, 11),
                finalProjectDueDateItems = items.slice(12, 15),

                // Create due dates based on previous three array slices containing
                // due date items.
                midtermDueDate =
                    new Date(...midtermDueDateItems),
                semesterAssignmentDueDate =
                    new Date(...semesterProjectDueDateItems),
                finalProjectDueDate =
                    new Date(...finalProjectDueDateItems),

                // Retrieve the URLs to all assignments.
                midtermLinkURL = items.slice(7, 8),
                semesterProjectURL = items.slice(11, 12),
                finalProjectURL = items.slice(15, 16),

                now = new Date(),

                // Perform all date-based math to calculate due dates in terms of
                // numbered days left.
                midtermDueDateTimeDiffInMS =
                    (midtermDueDate.getTime() - now.getTime()),
                daysLeftBeforeMidterm =
                    Math.ceil(midtermDueDateTimeDiffInMS / MILLIS_IN_A_DAY),

                semesterProjectDueDateTimeDiffInMS =
                    (semesterAssignmentDueDate.getTime() - now.getTime()),
                daysLeftBeforeSemesterAssignment =
                    Math.ceil(semesterProjectDueDateTimeDiffInMS / MILLIS_IN_A_DAY),

                finalProjectDueDateTimeDiffInMS =
                    (finalProjectDueDate.getTime() - now.getTime()),
                daysLeftBeforeFinalProject =
                    Math.ceil(finalProjectDueDateTimeDiffInMS / MILLIS_IN_A_DAY);

            // Because links in widgets don’t work the same as links in regular web
            // pages, I need to assign a click listener to the <a>nchor element,
            // disable the default behaviour attached to <a>nchors, then use the
            // widget object to open the URL.
            midtermLinkURLContainer.addEventListener(`click`, function(event) {
                event.preventDefault();
                widget.openURL(midtermLinkURL[0]);
            }, false);

            semesterProjectURLContainer.addEventListener(`click`, function (event) {
                event.preventDefault();
                widget.openURL(semesterProjectURL[0]);
            }, false);

            finalProjectURLContainer.addEventListener(`click`, function (event) {
                event.preventDefault();
                widget.openURL(finalProjectURL[0]);
            }, false);

            semesterContainer.textContent = items[0];     // Such as “Spring 2019”
            courseContainer.textContent = items[1];       // Such as “Web Design I”
            catalogNumberContainer.textContent = items[2];// Such as “Arts 214”
            collegeContainer.textContent = items[3];      // Such as “Queens College”

            // The due date has passed. Thus, color the text of the numbered days
            // left red.
            if (daysLeftBeforeMidterm < 0) {
                daysLeftForMidtermContainer.style.color = `red`;
            }

            if (daysLeftBeforeSemesterAssignment < 0) {
                daysLeftForSemesterAssignmentContainer.style.color = `red`;
            }

            if (daysLeftBeforeFinalProject < 0) {
                daysLeftBeforeFinalContainer.style.color = `red`;
            }

            // Populate the values to the “Due” items in the widget.
            midtermDueDateContainer.textContent =
                `${midtermDueDate.getDate()}
                ${months[midtermDueDate.getMonth()]}
                ${midtermDueDate.getFullYear()}`;
            semesterAssignmentDueDateContainer.textContent =
                `${semesterAssignmentDueDate.getDate()}
                ${months[semesterAssignmentDueDate.getMonth()]}
                ${semesterAssignmentDueDate.getFullYear()}`;
            finalProjectDueDateContainer.textContent =
                `${finalProjectDueDate.getDate()}
                ${months[finalProjectDueDate.getMonth()]}
                ${finalProjectDueDate.getFullYear()}`;

            // Populate the values to the “Days Left” items in the widget.
            daysLeftForMidtermContainer.textContent =
                daysLeftBeforeMidterm.toString();
            daysLeftForSemesterAssignmentContainer.textContent =
                daysLeftBeforeSemesterAssignment.toString();
            daysLeftBeforeFinalContainer.textContent =
                daysLeftBeforeFinalProject.toString();
        }
    };

    xmlhttp.open(`GET`, url, true);
    xmlhttp.onreadystatechange = processResponse;
    xmlhttp.send(null);
};
