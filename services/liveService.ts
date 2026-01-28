import { GoogleGenAI, LiveServerMessage, Modality } from "@google/genai";
import { INITIAL_SYSTEM_INSTRUCTION } from '../constants';

// Audio Configuration
const INPUT_SAMPLE_RATE = 16000;
const OUTPUT_SAMPLE_RATE = 24000;

export class ShiftVoiceClient {
    private ai: GoogleGenAI;
    private inputContext: AudioContext | null = null;
    private outputContext: AudioContext | null = null;
    private stream: MediaStream | null = null;
    private processor: ScriptProcessorNode | null = null;
    private source: MediaStreamAudioSourceNode | null = null;
    private nextStartTime = 0;
    private isConnected = false;
    private closeCallback: (() => void) | null = null;

    constructor() {
        this.ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });
    }

    async connect(onAudioData: (isPlaying: boolean) => void, onClose: () => void) {
        this.closeCallback = onClose;
        this.inputContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: INPUT_SAMPLE_RATE });
        this.outputContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: OUTPUT_SAMPLE_RATE });

        try {
            this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            this.isConnected = true;

            const sessionPromise = this.ai.live.connect({
                model: 'gemini-2.5-flash-native-audio-preview-12-2025',
                config: {
                    responseModalities: [Modality.AUDIO],
                    systemInstruction: INITIAL_SYSTEM_INSTRUCTION, // Enforcing strict brand guidelines
                    speechConfig: {
                        voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } }, // Professional tone
                    },
                },
                callbacks: {
                    onopen: () => {
                        console.log("Shifty Live Resonance: Connected");
                        this.startAudioInput(sessionPromise);
                    },
                    onmessage: async (message: LiveServerMessage) => {
                        // Handle Audio Output
                        const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
                        if (base64Audio) {
                            onAudioData(true); // Signal UI that AI is speaking
                            await this.playAudioChunk(base64Audio);
                        }

                        // Handle Interruptions
                        if (message.serverContent?.interrupted) {
                            this.nextStartTime = 0; // Reset buffer cursor
                            onAudioData(false);
                        }
                    },
                    onclose: () => {
                        console.log("Shifty Live Resonance: Closed");
                        this.disconnect();
                    },
                    onerror: (e) => {
                        console.error("Shifty Live Error:", e);
                        this.disconnect();
                    }
                }
            });

        } catch (error) {
            console.error("Failed to initialize voice session:", error);
            this.disconnect();
        }
    }

    private startAudioInput(sessionPromise: Promise<any>) {
        if (!this.inputContext || !this.stream) return;

        this.source = this.inputContext.createMediaStreamSource(this.stream);
        this.processor = this.inputContext.createScriptProcessor(4096, 1, 1);

        this.processor.onaudioprocess = (e) => {
            if (!this.isConnected) return;

            const inputData = e.inputBuffer.getChannelData(0);
            const pcmBlob = this.float32ToPCM16(inputData);

            sessionPromise.then((session) => {
                session.sendRealtimeInput({
                    media: {
                        mimeType: 'audio/pcm;rate=16000',
                        data: pcmBlob
                    }
                });
            });
        };

        this.source.connect(this.processor);
        this.processor.connect(this.inputContext.destination);
    }

    private async playAudioChunk(base64Audio: string) {
        if (!this.outputContext) return;

        const audioData = this.base64ToUint8Array(base64Audio);
        const float32Data = new Float32Array(audioData.length / 2);
        const dataView = new DataView(audioData.buffer);

        for (let i = 0; i < audioData.length / 2; i++) {
            float32Data[i] = dataView.getInt16(i * 2, true) / 32768.0;
        }

        const buffer = this.outputContext.createBuffer(1, float32Data.length, OUTPUT_SAMPLE_RATE);
        buffer.getChannelData(0).set(float32Data);

        const source = this.outputContext.createBufferSource();
        source.buffer = buffer;
        source.connect(this.outputContext.destination);

        const currentTime = this.outputContext.currentTime;
        // Schedule next chunk to play immediately after the previous one
        const startTime = Math.max(currentTime, this.nextStartTime);

        source.start(startTime);
        this.nextStartTime = startTime + buffer.duration;
    }

    disconnect() {
        this.isConnected = false;

        if (this.source) this.source.disconnect();
        if (this.processor) this.processor.disconnect();

        this.stream?.getTracks().forEach(track => track.stop());

        this.inputContext?.close();
        this.outputContext?.close();

        if (this.closeCallback) this.closeCallback();

        this.inputContext = null;
        this.outputContext = null;
        this.stream = null;
        this.processor = null;
        this.source = null;
    }

    // --- Helpers ---

    private float32ToPCM16(float32: Float32Array): string {
        const int16 = new Int16Array(float32.length);
        for (let i = 0; i < float32.length; i++) {
            let s = Math.max(-1, Math.min(1, float32[i]));
            int16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
        }

        let binary = '';
        const bytes = new Uint8Array(int16.buffer);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
    }

    private base64ToUint8Array(base64: string): Uint8Array {
        const binaryString = atob(base64);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes;
    }
}