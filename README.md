
# KASAMA

**Team ID:** 6347
**Level of Achievement:** Vostok
**Team Members:** Sean Tan, Elizabeth(Liz) Khoo
**Milestone:** 2
**GitHub:** https://github.com/lizziekhoo/kasama-sg
**Deployment:** To be updated / Available on request

---

## Table of Contents

1. [Problem Motivation](#1-problem-motivation)
2. [Target Audience](#2-target-audience)
3. [Our Solution](#3-our-solution)
4. [Features](#4-features)
5. [Tech Stack](#5-tech-stack)
6. [System Architecture](#6-system-architecture)
7. [Planning & Version Control](#7-planning--version-control)
8. [Technical Proof of Concept](#8-technical-proof-of-concept)
9. [Testing](#9-testing)
10. [Development Plan](#10-development-plan)

---

## 1. Problem Motivation

Migrant domestic workers and foreign workers in Singapore may face practical challenges when trying to access everyday support. Important information can be scattered across different websites, hotlines, maps, agencies, and organisations. For users who may be unfamiliar with Singapore’s systems, local geography, or language, finding the correct information quickly can be confusing and stressful.

This issue becomes more important when users need support during urgent or unfamiliar situations. Existing resources may contain useful information, but they are not always presented in a simple, mobile-first format that allows users to quickly access emergency contacts, rights information, useful locations, salary records, and common phrases.

KASAMA aims to reduce this friction by creating a centralised support platform that presents key resources in a clear, accessible, and user-friendly way.

---

## 2. Target Audience

### Primary Users

Our primary users are migrant domestic workers and foreign workers in Singapore who may need quick access to support information, useful contacts, basic rights information, salary tracking tools, maps of important locations, and simple communication phrases.

These users may need information that is easy to understand, easy to navigate, and accessible on mobile devices.

### Secondary Users

Secondary users may include volunteers, support organisations, employers, or community members who want to direct workers to a simple resource hub containing basic guidance and support information.

---

## 3. Our Solution

KASAMA is a mobile-first web application that brings together practical support tools into one platform. Instead of requiring users to search across multiple websites or documents, the app organises important resources into clear feature pages such as contact categories, rights information, useful places, salary tracking, and phrase cards.

The core value of the app is accessibility. Users can begin with language selection, navigate through clear resource categories, and access information in a format that is easy to scan on mobile. For Milestone 2, our focus is to build the main feature pages, demonstrate the key user flows, and show how the app can serve as a useful support hub.

**Link to app / demo:** To be updated / Available on request

---

## 4. Features

### Feature 1: Login and Language Selection

**Milestone:** 2
**Status:** Implemented
**User role:** Public user / Registered user

**What it does:**
Users can enter the app through a login and onboarding flow. The language selection flow helps users start the app in a more accessible way by allowing them to choose a preferred language before using the platform.

**Complexity justification:**
This feature is non-trivial because it sets up the entry point for the entire app. The app must consider onboarding flow, authentication state, language preference, and how users move from the starting screen into the main application.

**Design decisions:**
We chose to make language selection part of the early onboarding flow so that accessibility is considered from the start, rather than being hidden inside settings. This makes the app more approachable for users who may not be comfortable navigating an English-only interface.

---

### Feature 2: Contact Categories / Help Directory

**Milestone:** 2
**Status:** Implemented
**User role:** Public user

**What it does:**
Users can browse support contacts organised into readable categories. This allows users to quickly identify the type of help they need and locate relevant information.

**Complexity justification:**
This feature requires contact information to be structured in a clear and scannable way. The information must be grouped logically so users can quickly find the right type of support, especially in urgent situations.

**Design decisions:**
We used a category-based layout because users may not want to read through long pages of text when looking for help. Grouping contacts into cards makes the page easier to scan and more mobile-friendly.

---

### Feature 3: Rights and Information Library

**Milestone:** 2
**Status:** Implemented
**User role:** Public user

**What it does:**
Users can access basic rights and information pages. The rights library provides a structured way for users to learn about important topics instead of relying on scattered online sources.

**Complexity justification:**
This feature is non-trivial because information must be organised into both a main library page and individual detail pages. The app needs to support a clear flow from an overview of topics to more detailed explanations.

**Design decisions:**
We separated the rights library into summary cards and detail pages. This allows users to first browse available topics before choosing to read more detailed information.

---

### Feature 4: Map and Place Details

**Milestone:** 2
**Status:** Implemented
**User role:** Public user

**What it does:**
Users can browse useful locations and view details about each place. This may include important resource locations, service providers, and other places that may be relevant to workers.

**Complexity justification:**
This feature requires the app to represent place-based information in a structured way. The place detail flow must connect overview information with more specific details about each location.

**Design decisions:**
We separated the map/resource directory page from the place detail page to make the browsing experience cleaner. Users can first scan a list of useful places, then open individual details when needed.

---

### Feature 5: Local Salary Tracker

**Milestone:** 2
**Status:** Implemented
**User role:** Registered user / Local user

**What it does:**
Users can record salary-related information locally. This helps users keep track of payments and maintain a personal salary log.

**Complexity justification:**
This feature is non-trivial because it requires a form-based flow and a way to display saved records clearly. Salary-related information must be organised in a way that is understandable and useful to the user.

**Design decisions:**
We kept the salary tracker simple and focused on basic logging first. For Milestone 2, the priority is to demonstrate the core feature flow before adding more complex calculations or backend persistence.

---

### Feature 6: Phrase Cards / Phrasebook

**Milestone:** 2
**Status:** Implemented
**User role:** Public user

**What it does:**
Users can view useful phrase cards for simple communication. This supports users who may need help expressing common needs or asking for assistance.

**Complexity justification:**
This feature requires phrases to be categorised and displayed clearly. The design must support quick reading, especially on mobile, so that users can find relevant phrases during real-life conversations.

**Design decisions:**
We used a card-based phrasebook layout because users may need to quickly find and show a phrase. Categories help users locate the type of phrase they need more efficiently.

---

## 5. Tech Stack

| Layer                    | Technology                    | Why we chose it                                                                                                                             |
| ------------------------ | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Frontend                 | React                         | React allows us to build reusable UI components and separate the app into clear feature pages.                                              |
| Build Tool               | Vite                          | Vite provides a fast development environment and simple setup for a React project.                                                          |
| Styling                  | CSS / Component-based styling | This allows us to style pages in a mobile-friendly way while keeping the project lightweight.                                               |
| Data                     | Local JavaScript data files   | For the Vostok prototype, local data files are sufficient to demonstrate feature flows without requiring a full backend for every resource. |
| Authentication / Backend | Supabase, where applicable    | Supabase can support authentication and database features if the app is expanded beyond the prototype stage.                                |
| Hosting                  | To be updated                 | Deployment can be added through platforms such as Vercel after integration is complete.                                                     |

**How the stack fits together:**
The React frontend is organised into pages, reusable components, and data files. Users interact with feature pages such as Contacts, Rights, Map, Salary, and Phrasebook. These pages render structured information from local data files and reusable UI components. Supabase can be used where authentication or database-backed features are needed.

---

## 6. System Architecture

### Architecture Diagram

```text
User
 |
 | interacts with
 v
React Frontend
 |
 |-- AuthPage / HomePage
 |-- ContactsPage
 |-- RightsPage / RightsDetailPage
 |-- MapPage / PlaceDetailPage
 |-- SalaryPage
 |-- PhrasebookPage
 |
 | uses
 v
Reusable Components
 |
 | reads from
 v
Local Data Files / Supabase where applicable
```

### Explanation

The app is structured as a React frontend with separate pages for each major feature. Each page focuses on one user goal, such as finding contacts, reading rights information, browsing places, logging salary information, or viewing phrase cards.

Reusable components help keep the interface consistent across pages. Local data files are used for structured prototype content, while Supabase can support authentication and future database-backed features.

### User Flow / Use Cases

#### Use Case 1: Finding Support Contacts

**Actor:** Public user
**Goal:** Find the right type of help quickly
**Steps:** User opens the app → navigates to Contacts → browses contact categories → selects the relevant category
**Outcome:** User can identify the support contact or resource they need.

#### Use Case 2: Reading Rights Information

**Actor:** Public user
**Goal:** Understand basic rights or support information
**Steps:** User opens the app → navigates to Rights → selects a topic → reads the detail page
**Outcome:** User receives clearer information about a selected rights-related topic.

#### Use Case 3: Browsing Useful Places

**Actor:** Public user
**Goal:** Find useful locations or resources
**Steps:** User opens the app → navigates to Map/Places → browses available places → opens a place detail page
**Outcome:** User can view more information about a useful location.

#### Use Case 4: Using Phrase Cards

**Actor:** Public user
**Goal:** Communicate a common need more easily
**Steps:** User opens the app → navigates to Phrasebook → browses categories → selects a useful phrase
**Outcome:** User can read or show a phrase for basic communication.

---

## 7. Planning & Version Control

**GitHub Repository:** https://github.com/lizziekhoo/kasama-sg

### Version Control Practices

For Milestone 2, we organised our work using Git and GitHub. As our project became more feature-based, we separated our work into feature branches so that each major feature could be added and reviewed more clearly before being merged into the main repository.

We use simple conventional commit messages to make the purpose of each change easier to understand. Examples include:

* `feat:` for new features
* `docs:` for documentation updates

### Branching Strategy

Each major feature is developed on a separate feature branch before being merged into `main` through a pull request. This allows us to keep each feature contribution separate and easier to review.

Examples of feature branches:

* `feature/auth-language`
* `feature/contact-categories`
* `feature/rights-library`
* `feature/map-place-details`
* `feature/salary-tracker`
* `feature/phrase-cards`
* `docs/readme-template-update`

### Responsibility Split

Liz is responsible for:

* Login and language selection
* Rights and information library
* Local salary logging and tracking

Sean is responsible for:

* Contact categories / help directory
* Map and place details
* Phrase cards / phrasebook

### Pull Request Workflow

For Milestone 2, each completed feature is pushed to GitHub through a feature branch. A pull request is then opened so that the other teammate can review the changes before merging.

Our workflow is:

1. Create a feature branch from `main`.
2. Develop and test the feature locally in VS Code.
3. Commit the feature using a clear commit message.
4. Push the branch to GitHub.
5. Open a pull request.
6. The other teammate reviews the code.
7. The pull request is approved and merged into `main`.

This helps us show clearer version control evidence and separates each teammate’s contributions by feature.

---

## 8. Technical Proof of Concept

### How to access the PoC

**Live demo:** To be updated / Available on request
**Credentials for testing:** To be updated if authentication is required

### Local testing instructions

```bash
npm install
npm run dev
```

### What the PoC demonstrates

1. Users can enter the app through an onboarding/login and language selection flow.
2. Users can navigate to support-related feature pages such as Contacts, Rights, Map, Salary, and Phrasebook.
3. The app demonstrates structured information display using React pages, reusable components, and local data files.
4. The prototype shows the main user journeys required for the Vostok Milestone 2 scope.
5. The project demonstrates a feature-branch and pull-request workflow between both team members.

### Screenshot / screen recording

#### Language Selection

![Language selection screen](docs/language1.jpeg)

![Language selection confirmation screen](docs/language2.jpeg)

#### Login Attempt

![Login attempt screen](docs/loginattempt.jpeg)

#### Create Account

![Create account screen](docs/createaccount.jpeg)

#### Login Error Handling

![Login error handling screen](docs/loginfail.jpeg)

#### Successful Login

![Successful login screen](docs/loginsucess.jpeg)
---

## 9. Testing

For Milestone 2, we mainly carried out manual system testing. Since our features were developed separately, each member first tested their own assigned features individually in their own local VS Code copy before pushing the completed work to the main GitHub repository.

Our testing process was:

1. Each feature was developed and tested locally in VS Code.
2. We checked that the page loaded correctly and that the main user flow worked as intended.
3. We checked that the feature layout was readable and usable on a basic mobile-sized screen.
4. Once the feature was working satisfactorily, it was committed and pushed to the main repository through a feature branch.
5. The other team member then reviewed the pull request before it was merged.

| Test Case                    | Steps                                                                            | Expected Result                                         | Actual Result | Pass? |
| ---------------------------- | -------------------------------------------------------------------------------- | ------------------------------------------------------- | ------------- | ----- |
| Login and language selection | Tested locally in VS Code by opening the page and going through the entry flow   | User can access the login/language flow clearly         | As expected   | ✓     |
| Contact categories           | Tested locally by opening the Contacts page and checking the listed categories   | Contact categories display clearly and are easy to scan | As expected   | ✓     |
| Rights library               | Tested locally by opening the Rights page and checking the topic/detail flow     | User can browse rights information clearly              | As expected   | ✓     |
| Map and place details        | Tested locally by opening the Map page and checking the place detail flow        | User can view useful places and their details           | As expected   | ✓     |
| Salary tracker               | Tested locally by opening the Salary page and checking the logging interface     | Salary tracker interface displays correctly             | As expected   | ✓     |
| Phrase cards                 | Tested locally by opening the Phrasebook page and checking the phrase categories | Phrase cards display clearly in categories              | As expected   | ✓     |
| Pull request review          | Pushed each completed feature to the main repository through a feature branch    | Other teammate can review the code before merging       | As expected   | ✓     |

---

## 10. Development Plan

### Completed by Milestone 2

* Login and language selection flow
* Contact categories / help directory page
* Rights and information library pages
* Map and place detail pages
* Local salary tracker page
* Phrasebook / phrase cards page
* Basic feature split and GitHub pull request workflow
* Basic manual system testing

### Planned for Milestone 3

* Improve routing and final integration between all pages
* Add more polished UI styling and mobile responsiveness
* Add screenshots or screen recording for documentation
* Improve data quality and expand resource content
* Add stronger Supabase integration where useful
* Conduct user testing with a small group of users
* Final documentation and README cleanup

### Risks and Mitigations

* **Risk:** Some feature pages may depend on shared components or data files that are not yet fully integrated.
  **Mitigation:** We will create a final integration PR to fix imports, routing, shared components, and build issues.

* **Risk:** Scope may become too large if we try to fully implement backend features for every page.
  **Mitigation:** For Vostok, we focus on a working frontend prototype with clear feature flows and only add backend support where necessary.

* **Risk:** The app may not yet be fully polished for mobile use.
  **Mitigation:** We will prioritise mobile layout testing and UI cleanup before Milestone 3.

---
