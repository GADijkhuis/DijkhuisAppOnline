import {supabase} from "./supaclient";

export async function getTimeRegistrationDataFromDatabase(weekNumber) {
    try {
        if (!weekNumber) {
            return null;
        }

        return await supabase.from(`timeregistration`)
            .select(`*`)
            .eq(`week`, weekNumber);
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function getAllTimeRegistrationWeekNumberFromDatabase() {
    try {
        return await supabase.from(`timeregistration`)
            .select(`week`);
    } catch (error) {
        console.error(error);
        return null;
    }
}