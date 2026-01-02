import {getAllTimeRegistrationWeekNumberFromDatabase, getTimeRegistrationDataFromDatabase} from "./databasehandler";
import TimeRegistration from "../models/TimeRegistration";
import WeekNumber from "../models/WeekNumber";

export async function getTimeRegistrationData(weekNumber) {
    const result = await getTimeRegistrationDataFromDatabase(weekNumber);

    if (!result) {
        return null;
    }

    return result.data.map((registration) => new TimeRegistration(registration.id, registration.week, registration.project_title, registration.user, registration.date, registration.hours, registration.description));
}

export async function getAllTimeRegistrationWeekNumbers() {
    const result = await getAllTimeRegistrationWeekNumberFromDatabase();
    if (!result) {
        return null;
    }

    const distinctWeeks = [...new Set(result.data.map(row => row.week))];

    return distinctWeeks.map((weekNumber) => new WeekNumber(weekNumber)).sort((a, b) => a.week > b.week ? -1 : 1).slice(0, 100);
}