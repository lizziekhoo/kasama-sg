# Kasama SG / FLOWSPACE

**NUS Orbital 2026**
**Proposed Level of Achievement: Vostok**

## Project Overview

Kasama SG / FLOWSPACE is a mobile-first web application designed to support migrant domestic helpers in Singapore by making key resources easier to access. The platform aims to consolidate important information such as multilingual onboarding, support contacts, rights information, basic resource browsing, and personal tracking tools into one simple prototype.

The project was motivated by the observation that many useful resources for migrant domestic helpers are scattered across different websites, community groups, social media posts, or shared by word of mouth. This makes it difficult for new users to find relevant help quickly, especially if they are new to Singapore or unfamiliar with where to search.

Kasama SG therefore focuses on presenting key information in a simple, mobile-friendly, and accessible way. For Milestone 2, the goal is to demonstrate a working prototype with multiple usable features that show the intended direction of the application.

## Aim

Our aim is to create a simple support platform that helps migrant domestic helpers access essential information more easily. The app focuses on improving access to community resources, emergency support, rights-related information, communication help, and basic personal logging tools.

The prototype is not meant to be a fully polished production-ready platform yet. Instead, it demonstrates the minimum working structure required for a Vostok-level Milestone 2 submission and provides a foundation for future improvements.

## Target Users

The main target users are migrant domestic helpers in Singapore who may need easier access to practical support information.

These users may include:

* newly arrived domestic helpers who are unfamiliar with available resources
* domestic helpers looking for help contacts or support organisations
* users who want simple information about rights and support channels
* users who may benefit from basic communication phrases
* users who want a simple personal record or salary log
* users who prefer a mobile-friendly platform with simple navigation

## Proposed Level of Achievement

**Vostok**

For Milestone 2, our focus is on meeting the minimum project requirements by delivering a working prototype with several basic but usable features. The app demonstrates the main user flows and core functionality of the platform, while leaving room for future improvement and refinement.

Earlier versions of the project proposal referenced a higher level of achievement, but the current Milestone 2 submission is scoped at Vostok. This README has therefore been updated to reflect the current submission level more accurately.

## Milestone 2 Progress

For Milestone 2, we expanded the initial proof of concept into a working prototype. The prototype now includes multiple pages and core user flows that demonstrate the intended direction of the application.

The following features have been completed to a basic usable level:

* multilingual onboarding and language selection
* login and registration flow using Supabase authentication
* basic help directory / emergency support page
* basic rights and information library
* basic phrasebook / communication support page
* basic salary tracker / personal log feature
* basic resource / location directory page
* mobile-friendly navigation and page structure
* deployed working version of the application
* updated README documentation and clearer setup instructions
* improved GitHub workflow using branches and pull requests

These features are implemented at a prototype level and are meant to satisfy the minimum Milestone 2 requirements for a Vostok-level submission. The focus is on showing that the app has progressed beyond a single feature and now contains a broader working structure that can be improved in future milestones.

## Features Implemented

### 1. Multilingual Onboarding

The app includes a language selection flow that allows users to begin by selecting their preferred language. This supports the project’s goal of making the platform more accessible to users who may not be fully comfortable navigating resources in English.

At this stage, the multilingual feature is implemented as a basic onboarding and navigation support feature. It establishes the intended user flow for future expansion into more complete translated content.

**Complexity justification:**
This feature is more than a static landing page because it affects the first user interaction and sets up the intended multilingual user journey. The implementation requires routing, state handling for language selection, and clear page transitions so that users can move from onboarding into the rest of the app.

### 2. Authentication

The app includes a basic login and registration flow using Supabase authentication. Users can register for an account and log in through the authentication pages.

This provides the foundation for future user-specific features such as saved personal logs, user preferences, and personalised resource access.

**Complexity justification:**
Authentication introduces backend integration complexity because the frontend needs to communicate with Supabase. The team had to understand Supabase authentication, environment variables, login/register flows, and how authentication fits into the app’s navigation structure.

### 3. Help Directory

The help directory provides a basic structure for emergency contacts and support resources. It is intended to help users quickly locate important support channels.

At the prototype level, this feature demonstrates how support information can be organised into categories and displayed in a simple, mobile-friendly way.

**Complexity justification:**
The complexity of this feature comes from organising urgent support information clearly. Since users may access this page in stressful situations, the layout needs to be easy to scan, mobile-friendly, and structured around categories that can later support phone numbers, websites, addresses, and descriptions.

### 4. Rights and Information Library

The rights library organises practical information into simple sections. This feature is intended to help users understand important workplace and support-related information in a more accessible format.

For Milestone 2, the rights library is implemented as a basic information section that can be expanded with more detailed and verified content in future iterations.

**Complexity justification:**
This feature requires information to be broken down into readable and reusable sections instead of being placed as one long text page. It also needs to be designed in a way that allows new topics and translations to be added later without changing the overall structure.

### 5. Phrasebook

The phrasebook provides basic communication support through commonly needed phrases. This is intended to help users in everyday situations where simple structured phrases may be useful.

At this stage, the phrasebook demonstrates the intended structure of communication cards and can be expanded with more categories, translations, and audio support in future versions.

**Complexity justification:**
The phrasebook requires a repeatable card structure and category-based organisation. This makes it easier to expand the feature later with additional languages, more phrase categories, and possible audio pronunciation support.

### 6. Salary Tracker / Personal Log

The salary tracker provides a basic form of personal record keeping. Users can record salary-related information or notes, forming the foundation for a more complete tracking feature in future development.

This feature is intended to support users in keeping track of payment-related details in a simple and accessible way.

**Complexity justification:**
Unlike static information pages, the salary tracker involves user input, form handling, empty states, and basic data display. It creates the foundation for future improvements such as local storage, editing, deleting, summaries, and optional backend sync.

### 7. Resource / Location Directory

The resource directory provides a basic structure for displaying useful places or resources. This feature is intended to support future expansion into a more complete curated map or location-based directory.

For Milestone 2, the feature demonstrates the basic idea of organising useful locations and resources within the app.

**Complexity justification:**
The original idea included a curated map, but for the current Vostok scope, this has been implemented as a simpler resource/location directory. This keeps the feature realistic while still showing how useful places and services can be grouped and displayed for users.

### 8. Mobile-Friendly Navigation

The app uses a simple page structure and navigation flow so that users can move between the main features. The interface is designed with a mobile-first approach, as the target users are likely to access the platform through a phone.

**Complexity justification:**
The navigation structure connects multiple features into one working prototype. This is important because Milestone 2 is not only about individual pages, but also about showing that the app functions as a connected system.

## Current User Flow

The current prototype supports the following basic flow:

1. User opens the app.
2. User selects a preferred language.
3. User can register or log in.
4. User can navigate to different resource sections.
5. User can access support information, rights information, phrasebook content, salary tracking, and resource pages.

This flow demonstrates the minimum working structure of the platform for Milestone 2.

## Planned Features

The current Vostok prototype implements the basic version of the main feature pages. Future versions can improve the app by expanding the depth, reliability, and polish of each feature.

Planned improvements include:

* more complete translations across the app
* expanded help directory with verified organisations and contact details
* stronger rights library content with clearer categories and verified sources
* improved phrasebook with more languages and more everyday situations
* improved salary tracker with editing, deletion, summaries, and local storage
* fuller resource directory with map links, filters, and directions
* stronger offline support and installable PWA behaviour
* more formal automated testing
* better UI consistency and accessibility

## Tech Stack

* React
* Vite
* Supabase
* GitHub
* Vercel / deployment platform
* Mobile-first web app structure

### React

React is used to build the frontend interface. It allows the app to be structured into reusable components such as cards, forms, pages, and navigation elements.

### Vite

Vite is used as the frontend build tool. It provides a fast development environment and a simple build process for the React application.

### Supabase

Supabase is used for backend-related functionality, especially authentication. It provides hosted authentication and creates a foundation for future database-backed features.

### GitHub

GitHub is used for version control, collaboration, branches, pull requests, code review, and documentation.

## Supabase Database / Entity List

At the current Vostok prototype level, Supabase is mainly used for authentication. However, the planned data structure is included below to show how the app can be expanded.

### Current Entity

#### Users

Purpose:

* stores authenticated user accounts through Supabase Auth
* supports login and registration
* forms the basis for future user-specific features

Possible fields:

* user_id
* email
* created_at
* preferred_language

### Planned Entities

#### Help Contacts

Purpose:

* stores support and emergency contact information

Possible fields:

* contact_id
* name
* category
* phone_number
* website
* address
* description
* language_support

#### Rights Articles

Purpose:

* stores rights-related information pages

Possible fields:

* article_id
* title
* category
* content
* language
* last_updated

#### Phrasebook Entries

Purpose:

* stores phrasebook phrases and translations

Possible fields:

* phrase_id
* category
* english_text
* translated_text
* language
* notes

#### Salary Logs

Purpose:

* stores user salary or personal log records

Possible fields:

* log_id
* user_id
* expected_amount
* received_amount
* payment_date
* notes
* created_at

#### Resource Locations

Purpose:

* stores useful places or resource directory entries

Possible fields:

* location_id
* name
* category
* address
* description
* map_link
* opening_hours

## Design Diagrams

The following text-based diagrams explain the intended structure of the application. Visual diagrams and screenshots may be added in future documentation updates.

### Component Hierarchy

```text
App
├── Onboarding
│   └── LanguageSelection
├── Auth
│   ├── Login
│   └── Register
├── MainLayout
│   ├── Navigation
│   ├── Home
│   ├── HelpDirectory
│   │   └── HelpContactCard
│   ├── RightsLibrary
│   │   └── RightsInfoCard
│   ├── Phrasebook
│   │   └── PhraseCard
│   ├── SalaryTracker
│   │   ├── SalaryForm
│   │   └── SalaryRecordCard
│   └── ResourceDirectory
│       └── ResourceCard
```

### User Flow

```text
User opens app
        ↓
Language selection
        ↓
Login / Register
        ↓
Main app navigation
        ↓
User chooses feature:
    - Help Directory
    - Rights Library
    - Phrasebook
    - Salary Tracker
    - Resource Directory
```

### Data Flow

```text
User action
   ↓
React component
   ↓
State / form handling
   ↓
Supabase Auth or local app data
   ↓
Updated UI display
```

For the current Vostok prototype, most feature pages use static or local data structures. Supabase is primarily used for authentication. Future iterations can move more feature data into Supabase tables.

## Software Engineering Practices

For Milestone 2, we improved the structure of the project by separating features into clearer pages and components. The app follows a React and Vite frontend structure, with Supabase used for authentication and backend-related setup.

We also improved our development process by using branches and pull requests rather than pushing all changes directly to `main`. This makes the workflow easier to track and gives both team members a clearer review process before changes are merged.

## GitHub Practices

During Milestone 1, we mainly worked individually and pushed directly while learning React, Supabase, and deployment workflows. After receiving feedback, we realised that our GitHub practices were not strong enough and that our development process needed to show clearer collaboration.

For Milestone 2 consolidation, we adopted a more structured GitHub workflow:

* feature branches
* pull requests into `main`
* peer review before merging
* clearer commit messages
* improved README documentation
* separation of feature work into smaller updates

Since Liz owns the main repository, Sean worked on separate feature branches and submitted pull requests into Liz’s repository. Liz reviewed and merged Sean’s implementation-focused pull requests. This allowed us to demonstrate branching, pull requests, peer review, and a clearer GitHub collaboration workflow after the Milestone 1 feedback.

### Responsibility Split

Sean took primary responsibility for implementation-heavy work, including:

* building feature pages
* setting up routing
* creating layouts and reusable components
* connecting authentication where applicable
* adding forms and basic state handling
* preparing feature branches and pull requests

Liz took primary responsibility for review and quality assurance, including:

* reviewing pull requests
* checking wording and feature clarity
* testing basic user flows
* checking usability and mobile layout
* reviewing whether features align with Vostok Milestone 2 requirements
* merging reviewed pull requests into the main branch

### Feature-Based PR Plan

The main feature branches are organised around the core prototype features:

```text
docs/readme-milestone2-update
feature/auth-onboarding
feature/help-directory
feature/rights-library
feature/phrasebook
feature/salary-tracker
feature/resource-directory
```

This structure makes the development history easier to review and shows that each feature was handled as a separate implementation unit.

## Milestone 2 Reflection

After Milestone 1, we received feedback that our progress and GitHub practices were not sufficiently clear. In response, we made several changes for Milestone 2.

First, we expanded the prototype beyond the initial language selection and login flow by adding multiple basic feature pages. Second, we improved the README so that the project scope, feature list, setup instructions, milestone progress, planned features, feature complexity, Supabase entities, design structure, and testing plan are clearer. Third, we adopted a branch-and-pull-request workflow to better show collaboration and code review.

Although the current prototype is still basic, it now demonstrates the minimum Vostok-level requirements more clearly and provides a better foundation for future development.

## Setup Instructions

Clone the repository:

```bash
git clone https://github.com/lizziekhoo/kasama-sg.git
cd kasama-sg
```

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Build the project:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Environment Variables

The project uses Supabase for authentication and backend-related setup. To run the app locally, create a `.env` file in the root directory and add the required Supabase environment variables.

Example:

```bash
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

The actual keys should not be committed to GitHub.

## Deployment

The project is intended to be deployed as a web application using a frontend deployment platform such as Vercel.

For deployment, the following should be checked:

* dependencies install successfully
* build command runs without errors
* environment variables are added in the deployment dashboard
* deployed link is accessible
* main user flows can be tested on the deployed version

## Testing

For Milestone 2, testing was carried out mainly through manual testing of the main user flows.

Tested flows include:

* opening the app
* selecting a language
* navigating between pages
* registering a user
* logging in
* viewing support directory pages
* viewing rights information pages
* viewing phrasebook pages
* using the salary tracker / personal log page
* checking basic mobile layout responsiveness

### Manual Testing Strategy

#### Onboarding and Authentication

* user can open the app
* user can select a language
* user can navigate to login
* user can navigate to registration
* registration form displays correctly
* login form displays correctly
* basic errors are handled where applicable

#### Help Directory

* help directory page loads
* support cards display correctly
* categories are readable
* layout works on mobile screen sizes

#### Rights Library

* rights page loads
* information sections display correctly
* text is readable on mobile
* navigation to and from the page works

#### Phrasebook

* phrasebook page loads
* phrase cards display correctly
* categories are understandable
* layout is usable on mobile

#### Salary Tracker

* salary tracker page loads
* form fields display correctly
* record display or empty state works
* invalid or empty input does not break the page

#### Resource Directory

* resource directory page loads
* resource cards display correctly
* category grouping is understandable
* navigation works correctly

### Future Testing Improvements

Future versions can improve testing by adding more formal unit tests, integration tests, authentication flow tests, form validation tests, and user testing with target users.

## Limitations

The current version is a basic prototype and has several limitations:

* content is still limited and can be expanded
* translations are not yet complete across all features
* map and location functions are still basic
* salary tracker is a simple prototype rather than a complete financial tracking system
* offline support and PWA features can be improved further
* the interface can be polished for better accessibility and usability
* more formal testing is needed

## Future Improvements

Future work can focus on improving the depth and polish of each feature.

Possible improvements include:

* expanding the rights library with more detailed and verified content
* improving the help directory with more support organisations and clearer categories
* adding more phrasebook categories and translations
* improving the salary tracker with better history, summaries, and editing functions
* developing a more complete curated map or location directory
* improving offline support
* improving mobile UI and accessibility
* adding more structured tests
* continuing to use branches and pull requests for all future development

## Team Members

* Elizabeth Khoo
* Sean Nathaniel Tan

## Repository

Main repository:

```text
https://github.com/lizziekhoo/kasama-sg
```

```
