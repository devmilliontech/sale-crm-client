export const formatABN = (value) => {
    const digits = value.replace(/\D/g, "");
    return digits
        .replace(/^(\d{2})(\d{0,3})(\d{0,3})(\d{0,3}).*/, (_, a, b, c, d) =>
            [a, b, c, d].filter(Boolean).join(" ")
        )
        .trim();
};

export const formatPhone = (value) => {
    const digits = value.replace(/\D/g, "");
    return digits
        .replace(/^(\d{4})(\d{0,3})(\d{0,3}).*/, (_, a, b, c) =>
            [a, b, c].filter(Boolean).join(" ")
        )
        .trim();
};


export const stageLabelMap = {
    warmLead: "Warm Lead",
    proposalSent: "Proposal Sent",
    meeting: "Meeting",
    interestIn: "Interest In",
    agreementSent: "Agreement Sent",
    invoice: "Invoice",
    paymentComplete: "Payment Complete",
    noInterested: "Not Interested",
    onHold: "On Hold",
    noResponse: "No Response",
    callBack: "Call Back",
};

export const getActiveStage = (client) => {
    if (!client) return null;
    if (client.stage) return client.stage;
    if (client.stages) {
        // primary boolean stages
        const primary = ["warmLead", "proposalSent", "meeting", "interestIn", "agreementSent", "invoice", "paymentComplete"];
        for (const p of primary) if (client.stages[p]) return p;
        // additional stages with status
        const additional = ["noInterested", "onHold", "noResponse", "callBack"];
        for (const a of additional) if (client.additionalStages[a]?.status) return a;
    }   
    return null;
};

export const getStageLabel = (stageKey) => stageLabelMap[stageKey] || stageKey || "-";


// Parse one ISO string and return useful formats
function parseIsoToDateAndMonth(iso, { locale = 'en-US', useUTC = false } = {}) {
    const d = new Date(iso);
    if (isNaN(d)) return null;

    const optsDate = { year: 'numeric', month: 'short', day: 'numeric' }; // e.g. "Sep 30, 2025"
    const optsLongMonth = { month: 'long' }; // e.g. "September"
    const optsMonthYear = { month: 'long', year: 'numeric' }; // e.g. "September 2025"

    // If you want to force UTC instead of local timezone, set timeZone: 'UTC' in options
    if (useUTC) {
        optsDate.timeZone = 'UTC';
        optsLongMonth.timeZone = 'UTC';
        optsMonthYear.timeZone = 'UTC';
    }

    return {
        isoDate: d.toISOString().slice(0, 10), // "2025-09-30"
        prettyDate: d.toLocaleDateString(locale, optsDate), // "Sep 30, 2025" or locale-specific
        shortMonth: d.toLocaleString(locale, optsLongMonth), // "September"
        monthYear: d.toLocaleString(locale, optsMonthYear), // "September 2025"
        fullUTC: d.toUTCString(), // "Tue, 30 Sep 2025 07:13:35 GMT"
    };
}
