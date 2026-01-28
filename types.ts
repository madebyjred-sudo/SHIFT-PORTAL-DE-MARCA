import React from 'react';

export type ViewType = 'home' | 'assets' | 'guidelines' | 'templates';

export interface Asset {
  id: string;
  name: string;
  type: 'logo' | 'video' | 'template' | 'image' | 'Image';
  format: string; // Primary format (e.g. SVG)
  availableFormats?: string[]; // List of all available (e.g. ['PNG', 'SVG'])
  size: string;
  previewUrl: string; // URL for the visual card (JPG/PNG)
  downloadUrl?: string; // URL for the actual file (SharePoint/Drive link)
  modified?: string;
  owner?: string;
  category?: string;
  tags?: string[];
  source?: 'local' | 'onedrive';
  localPaths?: {
    png: string | null;
    svg: string | null;
  };
}

export interface Collection {
  id: string;
  title: string;
  coverVideoUrl: string | null;
  coverImageUrl: string | null;
  itemCount: number;
  route: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isStreaming?: boolean;
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'filled' | 'outlined' | 'text' | 'elevated';
  size?: 'small' | 'medium' | 'large';
  icon?: React.ReactNode;
}