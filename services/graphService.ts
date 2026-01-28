import { Client } from "@microsoft/microsoft-graph-client";
import { Asset } from "../types";
import { isSimulationMode } from "../authConfig";

let graphClient: Client | undefined;

// The base folder path in OneDrive
const BASE_FOLDER_PATH = "SHIFT_WEB_PORTAL";

/**
 * Initialize the Graph Client with an Access Token
 */
export const initializeGraphClient = (accessToken: string) => {
    if (isSimulationMode()) {
        console.log("Graph Service: Initialized in SIMULATION MODE");
        return;
    }

    graphClient = Client.init({
        authProvider: (done) => {
            done(null, accessToken);
        }
    });
};

/**
 * Map a Microsoft Graph DriveItem to our internal Asset type
 */
const mapGraphItemToAsset = (item: any): Asset => {
    return {
        id: item.id,
        name: item.name,
        type: item.folder ? 'logo' : (item.video ? 'video' : 'image'),
        format: item.file ? item.name.split('.').pop()?.toUpperCase() || 'FILE' : 'Folder',
        size: item.size > 1024 * 1024
            ? `${(item.size / (1024 * 1024)).toFixed(1)} MB`
            : `${(item.size / 1024).toFixed(1)} KB`,
        previewUrl: item.thumbnails?.[0]?.large?.url || "https://images.unsplash.com/photo-1626785774573-4b799312299d?auto=format&fit=crop&q=80&w=800",
        downloadUrl: item["@microsoft.graph.downloadUrl"] || item.webUrl
    };
};

/**
 * Fetch Assets from OneDrive
 */
export const getOneDriveAssets = async (): Promise<Asset[]> => {
    if (isSimulationMode()) {
        console.log("Graph Service: Fetching Simulated Assets...");
        await new Promise(resolve => setTimeout(resolve, 1500));
        return MOCK_ONEDRIVE_ASSETS;
    }

    if (!graphClient) throw new Error("Graph Client not initialized");

    try {
        // We try to fetch from the Assets subfolder exactly as we planned
        const response = await graphClient.api(`/me/drive/root:/${BASE_FOLDER_PATH}/01_Assets:/children`)
            .expand("thumbnails")
            .get();
        return response.value.map(mapGraphItemToAsset);
    } catch (error: any) {
        // Fallback: If 01_Assets doesn't exist yet, try the root master folder
        if (error.code === 'itemNotFound') {
            const fallback = await graphClient.api(`/me/drive/root:/${BASE_FOLDER_PATH}:/children`)
                .expand("thumbnails")
                .get();
            return fallback.value.map(mapGraphItemToAsset);
        }
        throw error;
    }
};

/**
 * Fetch User Profile Photo
 */
export const getUserProfilePhoto = async (): Promise<string | null> => {
    if (isSimulationMode() || !graphClient) return null;

    try {
        const response = await graphClient.api('/me/photo/$value')
            .responseType('blob')
            .get();
        return URL.createObjectURL(response);
    } catch (error) {
        console.warn("Could not fetch user photo", error);
        return null; // Return null if photo doesn't exist or error
    }
};

/**
 * Fetch Templates from OneDrive
 */
export const getOneDriveTemplates = async (): Promise<any[]> => {
    if (isSimulationMode()) {
        console.log("Graph Service: Fetching Simulated Templates...");
        await new Promise(resolve => setTimeout(resolve, 1200));
        return MOCK_ONEDRIVE_TEMPLATES;
    }

    if (!graphClient) throw new Error("Graph Client not initialized");

    try {
        const response = await graphClient.api(`/me/drive/root:/${BASE_FOLDER_PATH}/02_Templates:/children`)
            .expand("thumbnails")
            .get();

        return response.value.map((item: any) => ({
            id: item.id,
            title: item.name.split('.')[0],
            description: `Sincronizado desde la nube. Tamaño: ${Math.round(item.size / 1024)} KB`,
            format: item.name.split('.').pop()?.toUpperCase() || 'FILE',
            size: `${(item.size / 1024).toFixed(0)} KB`,
            image: item.thumbnails?.[0]?.large?.url || "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800",
            webUrl: item.webUrl // This is the magic link for cloud editing
        }));
    } catch (error) {
        console.error("Error fetching OneDrive templates:", error);
        return [];
    }
};

// MOCK DATA FOR SIMULATION (Remains as fallback)
const MOCK_ONEDRIVE_ASSETS: Asset[] = [
    {
        id: "od-1",
        name: "Q1 Campaign Assets.zip",
        type: "image",
        format: "ZIP",
        size: "156 MB",
        previewUrl: "https://images.unsplash.com/photo-1626785774573-4b799312299d?auto=format&fit=crop&q=80&w=800",
    },
    {
        id: "od-2",
        name: "Executive Headshots 2024",
        type: "image",
        format: "Folder",
        size: "24 items",
        previewUrl: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=800",
    },
    {
        id: "od-3",
        name: "Brand Launch Video_Final.mp4",
        type: "video",
        format: "MP4",
        size: "2.4 GB",
        previewUrl: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=800",
    }
];

const MOCK_ONEDRIVE_TEMPLATES = [
    {
        id: 'od-ppt-1',
        title: 'Q1 2025 Strategy Deck (Cloud)',
        description: 'Editado recientemente. Plantilla estratégica sincronizada.',
        format: 'PPTX',
        size: '14 MB',
        image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800',
        webUrl: 'https://www.office.com/launch/powerpoint'
    },
    {
        id: 'od-doc-1',
        title: 'Contract Template v4 (Cloud)',
        description: 'Siempre actualizado. Última versión aprobada por Legal.',
        format: 'DOCX',
        size: '450 KB',
        image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&q=80&w=800',
        webUrl: 'https://www.office.com/launch/word'
    }
];
