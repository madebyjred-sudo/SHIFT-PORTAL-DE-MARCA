import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PUBLIC_DIR = path.join(__dirname, '../public');
const OUTPUT_FILE = path.join(__dirname, '../src/data/localAssets.ts');

const VALID_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.svg', '.webp'];

function getDirectories(source) {
    if (!fs.existsSync(source)) return [];
    return fs.readdirSync(source, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);
}

// Generate Manifest V5: Support for Multi-layer, Flat, and Root-level assets
function generateManifest() {
    const BASE_ASSETS_DIR = path.join(PUBLIC_DIR, 'assets');
    if (!fs.existsSync(BASE_ASSETS_DIR)) {
        console.error(`Directory not found: ${BASE_ASSETS_DIR}`);
        return;
    }

    const collectionsDirs = getDirectories(BASE_ASSETS_DIR);
    const allAssets = [];
    const collections = [];

    collectionsDirs.forEach(collectionDirName => { // e.g. "LOGO", "ICONS", "MOTION"
        const collectionPath = path.join(BASE_ASSETS_DIR, collectionDirName);

        // 1. Find Cover Video
        const files = fs.readdirSync(collectionPath);
        // Priority for cover video: WAVES, then any other mp4
        let videoFile = files.find(f => f.toUpperCase().includes('WAVES') && f.toLowerCase().endsWith('.mp4'));
        if (!videoFile) videoFile = files.find(f => f.toLowerCase().endsWith('.mp4'));

        const coverVideoUrl = videoFile ? `/assets/${collectionDirName}/${videoFile}` : null;

        // 2. Scan for individual assets (either in subdirs or root)
        const subDirs = getDirectories(collectionPath);
        let collectionItemCount = 0;

        // Process files directly in root (Strategy C: MOTION)
        files.forEach(file => {
            const ext = path.extname(file).toLowerCase();
            const isVideo = ext === '.mp4';

            // SKIP THUMBNAILS: If the file is a UI thumbnail (contains 'THUMBNAIL'), don't list it as a downloadable asset.
            if (file.toUpperCase().includes('THUMBNAIL')) return;

            if (VALID_EXTENSIONS.includes(ext) || isVideo) {
                // If it's a video used as cover, skip it from assets? OR list it? 
                // Let's list it if it's in MOTION.
                const fileNameNoExt = path.parse(file).name;
                const cleanName = fileNameNoExt.replace(/[-_]/g, ' ');
                const relativePath = `/assets/${collectionDirName}/${file}`;

                allAssets.push({
                    id: `local-${collectionDirName}-root-${fileNameNoExt}`.replace(/\s+/g, '-'),
                    name: cleanName,
                    type: isVideo ? 'video' : 'Image',
                    format: ext.substring(1).toUpperCase(),
                    availableFormats: [ext.substring(1).toUpperCase()],
                    size: 'N/A',
                    modified: new Date().toISOString(),
                    owner: 'Local',
                    previewUrl: relativePath,
                    downloadUrl: relativePath,
                    cloudUrl: null,
                    source: 'local',
                    category: collectionDirName,
                    tags: [collectionDirName, 'General'],
                    localPaths: { png: !isVideo ? relativePath : null, svg: ext === '.svg' ? relativePath : null }
                });
                collectionItemCount++;
            }
        });

        // 3. Scan subdirs (Strategy A/B)
        subDirs.forEach(variantName => {
            const variantPath = path.join(collectionPath, variantName);
            const hasThumbnailsDir = fs.existsSync(path.join(variantPath, 'THUMBNAILS/PNG'));

            if (hasThumbnailsDir) {
                // --- STRATEGY A: STRUCTURED (LOGOS) ---
                const pngDir = path.join(variantPath, 'PNG');
                const svgDir = path.join(variantPath, 'SVG');
                const thumbDir = path.join(variantPath, 'THUMBNAILS/PNG');

                const thumbnails = fs.readdirSync(thumbDir)
                    .filter(file => VALID_EXTENSIONS.includes(path.extname(file).toLowerCase()));

                thumbnails.forEach(thumbFile => {
                    const fileNameNoExt = path.parse(thumbFile).name;
                    const cleanName = fileNameNoExt.replace(/_\d+$/, '');

                    let pngPath = null;
                    if (fs.existsSync(pngDir)) {
                        const pngFiles = fs.readdirSync(pngDir);
                        const match = pngFiles.find(f => path.parse(f).name === cleanName) ||
                            pngFiles.find(f => path.parse(f).name.startsWith(cleanName));
                        if (match) pngPath = path.join('/assets', collectionDirName, variantName, 'PNG', match);
                    }

                    let svgPath = null;
                    if (fs.existsSync(svgDir)) {
                        const svgFiles = fs.readdirSync(svgDir);
                        const svgMatch = svgFiles.find(f => path.parse(f).name === cleanName) ||
                            svgFiles.find(f => path.parse(f).name.startsWith(cleanName));
                        if (svgMatch) svgPath = path.join('/assets', collectionDirName, variantName, 'SVG', svgMatch);
                    }

                    const thumbPath = path.join('/assets', collectionDirName, variantName, 'THUMBNAILS/PNG', thumbFile);
                    const availableFormats = [];
                    if (pngPath) availableFormats.push('PNG');
                    if (svgPath) availableFormats.push('SVG');

                    allAssets.push({
                        id: `local-${collectionDirName}-${variantName}-${fileNameNoExt}`.replace(/\s+/g, '-'),
                        name: cleanName.replace(/[-_]/g, ' '),
                        type: 'Image',
                        format: svgPath ? 'SVG' : 'PNG',
                        availableFormats: availableFormats,
                        size: 'N/A',
                        modified: new Date().toISOString(),
                        owner: 'Local',
                        previewUrl: thumbPath.replace(/ /g, '%20'),
                        downloadUrl: (svgPath || pngPath || thumbPath).replace(/ /g, '%20'),
                        cloudUrl: null,
                        source: 'local',
                        category: collectionDirName,
                        tags: [collectionDirName, variantName],
                        localPaths: {
                            png: pngPath ? pngPath.replace(/ /g, '%20') : null,
                            svg: svgPath ? svgPath.replace(/ /g, '%20') : null
                        }
                    });
                    collectionItemCount++;
                });

            } else {
                // --- STRATEGY B: FLAT (ICONS) ---
                const images = fs.readdirSync(variantPath)
                    .filter(file => VALID_EXTENSIONS.includes(path.extname(file).toLowerCase()));

                images.forEach(imageFile => {
                    const fileNameNoExt = path.parse(imageFile).name;
                    const ext = path.extname(imageFile).substring(1).toUpperCase();
                    const relativePath = path.join('/assets', collectionDirName, variantName, imageFile);

                    allAssets.push({
                        id: `local-${collectionDirName}-${variantName}-${fileNameNoExt}`.replace(/\s+/g, '-'),
                        name: fileNameNoExt.replace(/[-_]/g, ' '),
                        type: 'Image',
                        format: ext,
                        availableFormats: [ext],
                        size: 'N/A',
                        modified: new Date().toISOString(),
                        owner: 'Local',
                        previewUrl: relativePath.replace(/ /g, '%20'),
                        downloadUrl: relativePath.replace(/ /g, '%20'),
                        cloudUrl: null,
                        source: 'local',
                        category: collectionDirName,
                        tags: [collectionDirName, variantName],
                        localPaths: {
                            png: ext === 'PNG' ? relativePath.replace(/ /g, '%20') : null,
                            svg: ext === 'SVG' ? relativePath.replace(/ /g, '%20') : null
                        }
                    });
                    collectionItemCount++;
                });
            }
        });

        collections.push({
            id: collectionDirName,
            title: collectionDirName === 'LOGO' ? 'System Logos' : collectionDirName,
            coverVideoUrl: coverVideoUrl ? coverVideoUrl.replace(/ /g, '%20') : null,
            coverImageUrl: null,
            itemCount: collectionItemCount,
            route: `/assets/${collectionDirName.toLowerCase()}`
        });
    });

    const fileContent = `// Auto-generated by scripts/generateAssetsManifest.js
import { Asset, Collection } from '../types';

export const localAssets: Asset[] = ${JSON.stringify(allAssets, null, 4)};

export const localCollections: Collection[] = ${JSON.stringify(collections, null, 4)};
`;

    fs.writeFileSync(OUTPUT_FILE, fileContent);
    console.log(`Generated manifest with ${allAssets.length} assets and ${collections.length} collections at ${OUTPUT_FILE}`);
}

generateManifest();
