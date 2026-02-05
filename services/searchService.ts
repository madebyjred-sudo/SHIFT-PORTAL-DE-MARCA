import Fuse from 'fuse.js';
import { localAssets } from '../src/data/localAssets';
import { Asset } from '../types';

export interface SearchResult {
    item: Asset;
    matches?: ReadonlyArray<any>;
    score?: number;
}

class SearchService {
    private fuse: Fuse<Asset>;
    // Explicitly cast or omit strict type if causing issues, or use Fuse.IFuseOptions<Asset>
    private options: any = {
        keys: [
            { name: 'name', weight: 0.7 },
            { name: 'tags', weight: 0.5 },
            { name: 'category', weight: 0.3 },
            { name: 'format', weight: 0.1 }
        ],
        threshold: 0.3, // 0.0 = perfect match, 1.0 = match anything. 0.3 is good for fuzzy.
        includeScore: true,
        includeMatches: true,
        minMatchCharLength: 2,
        shouldSort: true,
    };

    constructor() {
        this.fuse = new Fuse(localAssets, this.options);
    }

    public search(query: string): SearchResult[] {
        if (!query || query.trim().length === 0) return [];
        return this.fuse.search(query);
    }

    // Identify categories for filters if needed eventually
    public getCategories(): string[] {
        const categories = new Set(localAssets.map(a => a.category || 'Uncategorized'));
        return Array.from(categories) as string[];
    }
}

export const searchService = new SearchService();
