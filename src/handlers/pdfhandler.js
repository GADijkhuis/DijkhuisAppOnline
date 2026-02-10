import html2pdf from "html2pdf.js";
import { parseHoursToMinutes, formatMinutesToHColonMM } from "../utils/timeutil";

export async function generateHoursPdf(registrations, week) {
    if (!registrations || registrations.length === 0) {
        alert("Geen data om PDF te genereren.");
        return;
    }

    const sorted = [...registrations].sort((a, b) => {
        return (
            a.user.localeCompare(b.user) ||
            a.project_title.localeCompare(b.project_title) ||
            (a.description ?? "").localeCompare(b.description ?? "") ||
            a.date.localeCompare(b.date)
        );
    });

    const dataByUser = {};
    for (const r of sorted) {
        const user = r.user;
        const project = r.project_title;
        const desc = r.description ?? "";

        if (!dataByUser[user]) dataByUser[user] = {};
        if (!dataByUser[user][project]) dataByUser[user][project] = {};
        if (!dataByUser[user][project][desc]) dataByUser[user][project][desc] = [];

        dataByUser[user][project][desc].push(r);
    }

    let html = `
        <style>
          body { font-family: Arial, sans-serif; font-size: 12px; }
          .page { page-break-after: always; padding: 20px; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          th, td { border: 1px solid #000; padding: 6px; text-align: left; }
          h2 { text-align: center; margin-bottom: 5px; }
          .section { margin-top: 15px; font-weight: bold; }
          .subtotal { margin: 6px 0 12px 0; font-style: italic; }
        </style>
      `;

    for (const user in dataByUser) {
        let userTotalMinutes = 0;

        html += `<div class="page">`;
        html += `<h2>Urenbriefje</h2>`;
        html += `<p><strong>Naam:</strong> ${user}<br/><strong>Week:</strong> ${week ?? "-"}</p>`;

        for (const project in dataByUser[user]) {
            let totalMinutes = 0;

            html += `<div class="section">${project}</div>`;
            html += `
                      <table>
                        <thead><tr>
                          <th>Datum</th><th>Uren</th><th>Opmerking</th>
                        </tr></thead>
                        <tbody>
                    `;

            for (const desc in dataByUser[user][project]) {

                const entries = dataByUser[user][project][desc];
                let subTotalMinutes = 0;

                for (const e of entries) {

                    const minutes = parseHoursToMinutes(e.hours);
                    const display = formatMinutesToHColonMM(minutes);
                    subTotalMinutes += minutes;

                    html += `
                        <tr>
                          <td>${e.date}</td>
                          <td>${display}</td>
                          <td>${desc}</td>
                        </tr>
                      `;

                }

                totalMinutes += subTotalMinutes;

                html += `
                    <tr>
                        <td><i>Subtotaal ${project} - ${desc}</i></td>
                        <td><i>${formatMinutesToHColonMM(subTotalMinutes)}</i></td>
                        <td></td>
                    </tr>`;
            }

            html += `
                <tr>
                    <td><b>Totaal ${project}</b></td>
                    <td>${formatMinutesToHColonMM(totalMinutes)}</td>
                </tr>`;

            html += `</tbody></table>`;

            if (project.toLowerCase() !== "reiskosten") {
                userTotalMinutes += totalMinutes;
            }
        }

        html += `
            <h4>Totaal aantal uren ${user} (zonder reiskosten): ${formatMinutesToHColonMM(userTotalMinutes)}</h4>
        `;
        html += `</div>`;
    }

    await html2pdf()
        .set({
            margin: 10,
            filename: `Urenbriefjes-Week-${week}.pdf`,
            html2canvas: { scale: 2 },
            jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
        })
        .from(html)
        .save();
}
