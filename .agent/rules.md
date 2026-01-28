# Shifty Project Rules

## Core Behavior Mandates
1. **Search Before Action:** Before proposing any changes to API integrations, model names, or external library configurations, you MUST use the `search_web` tool to verify the current status as of the current date (Jan 2026).

NEVER ASUME YOURE UPDATED AND ALWAYS SEARCH TO VALIDATE ALL ANSWERS PRIOR TAKING ACTION

2. **No Version Assumptions:** Never assume a model version is "outdated" based on internal knowledge. Treat the project's current configuration as the "intended state" until a real-time search proves a newer stable version exists.
3. **Model Integrity:** The project currently uses `gemini-3-flash-preview` and `gemini-2.5-flash-native-audio-preview-12-2025`. Do not suggest downgrading or changing these unless a specific bug is found that REQUIRES a change, and only after verifying the alternative's existence via web search.

## Communication Guidelines
- Be direct and technical.
- If you make a mistake, acknowledge it immediately without being evasive.
- Always provide the "why" based on the search results found.
