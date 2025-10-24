# Privacy Components

This folder contains the privacy-specific components that were moved from the UI folder to improve code organization and reusability.

## Components

### PrivacyLayout.astro
Main layout component for privacy pages. Handles:
- Layout structure with HeaderPill
- DarkModeContainer wrapper
- Main content area
- ShareBar integration
- Global privacy page styling

### PrivacySection.astro
The main content section component that includes:
- Section header with title and subtitle
- InView animation wrapper
- Content grid layout
- Integration with PrivacyHighlights and PrivacyDetails components

### PrivacyHighlights.astro
Component for displaying the numbered highlight sections:
- Numbered items with purple accent color
- Flexible layout for different highlight types
- Responsive design
- Dark mode support

### PrivacyDetails.astro
Component for the detailed privacy information section:
- Expandable content sections
- Architecture, moderation, principles information
- Third-party, retention, and contact details
- Last updated information
- Styled container with glass effect

## Usage

```astro
---
import PrivacyLayout from '../../components/Legals/Privacy/PrivacyLayout.astro';
import { translations } from '../../i18n/translations.js';

const t = translations.en;
const privacyData = t.privacy;
---

<PrivacyLayout
  title="Karen Ortiz - Privacy Policy"
  lang="en"
  privacyData={privacyData}
/>
```

## Migrated from UI Components

These components were extracted from the original privacy pages which had duplicated code across multiple language versions:
- `/pages/privacy.astro`
- `/pages/es/privacidad.astro`  
- `/pages/fr/confidentialite.astro`

This refactoring eliminates code duplication and provides a single source of truth for privacy page styling and functionality.
