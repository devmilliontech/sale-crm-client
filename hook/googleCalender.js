import { useEffect, useState } from "react";
import { gapi } from "gapi-script";

const CLIENT_ID = import.meta.env.VITE_GOODLE_CLIENT_ID
const API_KEY = import.meta.env.VITE_GOOGLE_CLIENT_SECRET
const SCOPES = "https://www.googleapis.com/auth/calendar";

export const useGoogleCalendar = () => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        gapi.load("client:auth2", () => {
            gapi.client.init({ apiKey: API_KEY, clientId: CLIENT_ID, scope: SCOPES });
        });
    }, []);

    const signIn = async () => await gapi.auth2.getAuthInstance().signIn();

    const fetchEvents = async () => {
        const res = await gapi.client.calendar.events.list({
            calendarId: "primary",
            timeMin: new Date().toISOString(),
            singleEvents: true,
            orderBy: "startTime",
        });
        const mappedEvents = res.result.items.map((evt) => ({
            title: evt.summary,
            start: evt.start.dateTime || evt.start.date,
            end: evt.end.dateTime || evt.end.date,
            id: evt.id,
        }));
        setEvents(mappedEvents);
    };

    const createEvent = async (event) => {
        await gapi.client.calendar.events.insert({
            calendarId: "primary",
            resource: event,
            sendUpdates: "all",
        });
        fetchEvents();
    };

    return { events, signIn, fetchEvents, createEvent };
};
