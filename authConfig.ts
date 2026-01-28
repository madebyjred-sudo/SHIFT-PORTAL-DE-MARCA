import { Configuration, PopupRequest } from "@azure/msal-browser";

// Configuration for MSAL (Microsoft Authentication Library)
// If VITE_AZURE_CLIENT_ID is not set, the app will run in "Simulation Mode"
export const msalConfig: Configuration = {
    auth: {
        clientId: import.meta.env.VITE_AZURE_CLIENT_ID || "SIMULATION_MODE_CLIENT_ID",
        authority: `https://login.microsoftonline.com/${import.meta.env.VITE_AZURE_TENANT_ID || "common"}`,
        redirectUri: window.location.origin,
    },
    cache: {
        cacheLocation: "sessionStorage", // This configures where your cache will be stored
    }
};

// Scopes required for the application
export const loginRequest: PopupRequest = {
    scopes: ["User.Read", "Files.Read.All"]
};

// Helper to check if we are in simulation mode
export const isSimulationMode = () => {
    return !import.meta.env.VITE_AZURE_CLIENT_ID;
};
