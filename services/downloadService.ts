import JSZip from 'jszip';
import saveAs from 'file-saver';
import { Asset } from '../types';

/**
 * Downloads a single asset.
 * If the URL is external (SharePoint/Drive), it opens in a new tab.
 * If it's local/accessible, it triggers a direct download.
 */
export const downloadSingleAsset = async (asset: Asset) => {
    // Priority: use downloadUrl if available (SharePoint link), otherwise previewUrl
    const urlToDownload = asset.downloadUrl || asset.previewUrl;
    
    // Check if it's an external cloud storage link
    const isExternalLink = urlToDownload.includes('sharepoint.com') || 
                          urlToDownload.includes('drive.google.com') || 
                          urlToDownload.includes('box.com') ||
                          urlToDownload.includes('dropbox.com');

    if (isExternalLink) {
        // External links usually block direct "fetch" via CORS. 
        // We open them in a new tab so the provider (Microsoft/Google) handles the download.
        window.open(urlToDownload, '_blank');
        return;
    }

    try {
        const response = await fetch(urlToDownload);
        if (!response.ok) throw new Error('Network response was not ok');
        const blob = await response.blob();
        saveAs(blob, `${asset.name.replace(/\s+/g, '_')}.${asset.format.toLowerCase()}`);
    } catch (error) {
        console.warn('Direct download failed, opening link fallback:', error);
        window.open(urlToDownload, '_blank');
    }
};

/**
 * Batch Download Logic.
 * Attempt to ZIP files. If files are on SharePoint (CORS blocked),
 * it creates a text file with the list of links instead.
 */
export const downloadBatchAssets = async (assets: Asset[]) => {
    const zip = new JSZip();
    const folder = zip.folder("Shift_Brand_Assets");
    
    // Separate assets into "zippable" (local) and "external" (SharePoint)
    const externalAssets: Asset[] = [];
    const zippableAssets: Asset[] = [];

    assets.forEach(asset => {
        const url = asset.downloadUrl || asset.previewUrl;
        if (url.includes('sharepoint.com') || url.includes('drive.google.com')) {
            externalAssets.push(asset);
        } else {
            zippableAssets.push(asset);
        }
    });

    // 1. Handle Zippable Assets
    const downloadPromises = zippableAssets.map(async (asset) => {
        try {
            const url = asset.downloadUrl || asset.previewUrl;
            const response = await fetch(url);
            const blob = await response.blob();
            const fileName = `${asset.name.replace(/\s+/g, '_')}.${asset.format.toLowerCase()}`;
            folder?.file(fileName, blob);
        } catch (e) {
            console.error(`Failed to zip ${asset.name}`, e);
            externalAssets.push(asset); // Move to external list if fetch fails
        }
    });

    await Promise.all(downloadPromises);

    // 2. Handle External Assets (SharePoint)
    // Since we can't download them to zip them, we create a "Links.txt" file inside the zip
    if (externalAssets.length > 0) {
        let linksContent = "Some files could not be zipped directly due to SharePoint security settings.\n";
        linksContent += "Please download them individually using these links:\n\n";
        
        externalAssets.forEach(asset => {
            linksContent += `[${asset.name}] - ${asset.format}\n`;
            linksContent += `${asset.downloadUrl || asset.previewUrl}\n\n`;
        });

        folder?.file("SharePoint_Links.txt", linksContent);
        
        // Also open the first few links (max 3) to be helpful, but avoid popup blocker spam
        if (zippableAssets.length === 0 && externalAssets.length < 4) {
             externalAssets.forEach(asset => {
                window.open(asset.downloadUrl || asset.previewUrl, '_blank');
             });
             return; // If only external links, just opening them might be better than a zip with a text file
        }
    }

    // 3. Generate and Save Zip
    try {
        const content = await zip.generateAsync({ type: "blob" });
        saveAs(content, "Shift_Assets_Batch.zip");
    } catch (error) {
        console.error("Error generating zip", error);
        alert("Could not generate zip file.");
    }
};