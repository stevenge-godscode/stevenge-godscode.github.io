# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a static website for 神典·Genesis智识图谱 (Genesis Knowledge Graph), a Chinese company offering intelligent knowledge management solutions. The site showcases their GraphRAG-based technology for enterprise knowledge bases.

## Architecture

This is a pure static HTML/CSS/JavaScript website with no build system or package.json. The site follows Apple's design system principles and uses a component-based structure:

### File Structure
- **HTML Pages**: `index.html`, `about.html`, `cases.html`, `solutions.html`, `technology.html`
- **Components**: Reusable HTML components in `components/` (header.html, footer.html)
- **Styles**: CSS organized by component in `src/styles/` with Apple design system variables
- **Assets**: Images and icons in `src/assets/`
- **JavaScript**: Minimal vanilla JS for navigation and interactions

### Design System
The site uses Apple's design system with CSS custom properties:
- Color scheme: System blue (#007AFF), white/gray backgrounds
- Typography: Apple system fonts with specific sizing scales
- Components: Button styles, card layouts, navigation patterns
- Animations: Subtle hover effects and transitions

### Key Technologies
- **Apple Design Language**: Consistent with iOS/macOS design principles
- **Responsive Design**: Mobile-first approach with CSS Grid/Flexbox
- **Vanilla JavaScript**: No frameworks, minimal interaction code
- **Chinese Content**: All user-facing text is in Chinese

## Development Commands

Since this is a static site with no build system:
- **Local Development**: Use any static file server (e.g., `python -m http.server` or Live Server extension)
- **No Build Step**: Files are served directly as-is
- **No Package Manager**: No npm/yarn dependencies

## Content Management

The site content is primarily in Chinese and focuses on:
- **Knowledge Graph Technology**: GraphRAG implementation details
- **Enterprise Solutions**: Research analysis, knowledge management, decision support
- **Case Studies**: Academic research and financial sector implementations
- **Security**: Emphasis on on-premise deployment for data security

## Key Features

- **Apple-style Navigation**: Fixed header with blur effect
- **Hero Section**: Primary CTA buttons linking to external demos
- **Feature Cards**: Four core advantages with detailed examples
- **Solution Showcase**: Three main application scenarios
- **Case Studies**: Success stories from real implementations
- **Responsive Design**: Mobile-optimized layouts

## External Links

The site links to two main external services:
- `http://webui.genesis.godscode.com.cn/` - Main knowledge Q&A interface
- `http://admin.genesis.godscode.com.cn/` - Genesis Admin (management plane) + historical knowledge graph demo
