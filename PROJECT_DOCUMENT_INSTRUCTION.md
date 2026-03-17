# Chase Materials Stone Visualizer Tool – Functional Requirements (Phase 1)

## 1. Project Overview

This document defines the functional requirements for the Phase 1 development of a custom Stone Visualizer Tool for Chase Materials (buyriverrock.com). The tool will allow customers to upload a photo of their property and visualize decorative stone products applied to selected areas.

---

## 2. Project Objectives

- Allow users to upload a photo of their house, yard, or project area.
- Enable manual area selection using a brush-based masking tool.
- Apply realistic stone textures within selected regions.
- Allow instant switching between multiple stone materials.
- Provide smooth performance on desktop and mobile devices.
- Embed seamlessly into a Wix website via iframe.
- Allow users to download or share the final rendered image.

---

## 3. Scope (Phase 1)

- Photo upload functionality.
- Brush/select area tool.
- Texture overlay system.
- Material switching.
- Mobile optimization.
- Wix embeddable application.
- Image export (download/share).

---

## 4. Out of Scope (Future Enhancements)

> **⚠️ NOT TO WORK ON IT**

- User accounts or authentication.
- Database storage or user galleries.
- AI-assisted area detection.
- Advanced masking tools.

---

## 5. Functional Requirements

### 5.1 Image Upload

Users shall be able to upload an image from desktop or mobile devices. Supported formats include **JPG**, **JPEG**, and **PNG**. Uploaded images must display within an interactive canvas.

### 5.2 Area Selection (Brush Tool)

Users shall manually select areas using a brush tool. The tool must support:

- Adjustable brush size
- Smooth drawing interaction
- Selected areas forming a mask that restricts texture rendering

### 5.3 Texture Overlay

Selected stone textures shall be applied realistically within masked areas only. Textures must:

- Scale proportionally
- Tile seamlessly
- Remain constrained within boundaries

### 5.4 Material Switching

Users shall be able to switch between available stone products **instantly** without reselecting areas.

### 5.5 Stone Catalog

The application shall support an initial catalog of approximately **20–25 stone products**. Each product shall include:

- A name
- A texture image

### 5.6 Image Export

Users shall be able to download or share the final visualized image. The exported image shall include applied textures at high quality.

### 5.7 Mobile Compatibility

The tool shall function on mobile devices with:

- Touch support
- Responsive layout
- Optimized performance

### 5.8 Wix Embedding

The application shall be hosted independently and embedded into Wix using an iframe or equivalent embedding method.

---

## 6. Non-Functional Requirements

| Category      | Requirement                                                                 |
|---------------|-----------------------------------------------------------------------------|
| **Performance** | Smooth real-time rendering on modern desktop and mobile browsers.          |
| **Usability**   | Simple and intuitive interface requiring minimal learning.                 |
| **Compatibility** | Support latest versions of Chrome, Safari, Edge, and Firefox.           |
| **Scalability**  | Architecture should allow future AI and advanced features.               |
| **Security**     | Images processed client-side where possible; no persistent storage.     |

---

## 7. Technical Approach (Recommended)

| Component         | Technology                                      |
|-------------------|-------------------------------------------------|
| Frontend Framework | Next.js                                       |
| Canvas Engine      | Konva.js (or similar HTML5 Canvas library)    |
| Rendering          | Browser-based masking and texture compositing |
| Hosting            | Standalone deployment                         |
| Embedding          | Wix iframe integration                        |

---

## 8. Project Milestones

### Milestone 1

- Image upload functionality
- Brush/select tool implementation

### Milestone 2

- Texture overlay system
- Material switching
- Mobile optimization
- Wix embedding
- Final testing and delivery

---

## 9. Client Deliverables Required

- 20–25 high-resolution stone texture images
- Flat top-down images with even lighting
- List of stone product names
- Branding assets (if applicable)

---

## 10. Acceptance Criteria

- [ ] Users can upload images successfully.
- [ ] Brush tool accurately masks selected areas.
- [ ] Textures apply realistically without seams.
- [ ] Material switching updates instantly.
- [ ] Tool works smoothly on mobile devices.
- [ ] Tool embeds correctly into Wix.
- [ ] Users can export final images.
