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
          h2 { margin-bottom: 5px; }
          .section { margin-top: 15px; font-weight: bold; }
          .subtotal { margin: 6px 0 12px 0; font-style: italic; }
          .img { display: block; width: 75px; height: 75px; -webkit-filter: grayscale(100%); filter: grayscale(100%); }
          .header { display: flex; justify-content: space-between; align-items: center }
        </style>
      `;

    for (const user in dataByUser) {
        let userTotalMinutes = 0;

        html += `<div class="page">`;
        html += `<div class="header">`;
        html += `<div>`
        html += `<h2>Urenbriefje</h2>`;
        html += `<p><strong>Naam:</strong> ${user}<br/><strong>Week:</strong> ${week ?? "-"}</p>`;
        html += `</div>`;
        html += `<img class="img" src="data:image/jpeg;base64,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" alt="Dijkhuis Logo"/>`;
        html += `</div>`;


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
