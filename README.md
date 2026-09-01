# TaskAura: Your AI Productivity Companion

Create a complete, beautifully designed, all-in-one AI Productivity and Daily Problem Solver app named "TaskAura".

Build this with React, Tailwind CSS, Lucide icons, and Shadcn UI components with a modern, clean, dark/light theme toggle.

Core Features & UI Components to build directly in the frontend:

1. Header & Navigation:

   - App logo "TaskAura" with a glowing sparkle icon.

   - Navigation links: Dashboard, AI Task Parser, Daily Problem Solver, and Analytics.

   - Quick "Add Task" button and Theme Toggle.

2. AI Smart Input Bar (Task Parser):

   - A prominent input box allowing users to type or simulate voice input for tasks (e.g., "Finish project report by tomorrow 5pm urgent").

   - Built-in smart frontend logic to parse the input into:

     * Task Title

     * Priority (High/Medium/Low with color badges)

     * Due Date & Time

     * Category (Work, Personal, Finance, Daily Problem)

3. Task List & Interactive Task Cards:

   - Filter tasks by Category and Priority.

   - Each Task Card must feature a button: "✨ Breakdown with AI".

   - Clicking "Breakdown with AI" opens a sub-task accordion/modal that generates 3-5 step-by-step actionable sub-tasks with checkboxes.

4. Daily Problem Solver Widget:

   - A dedicated AI search bar: "Ask any daily problem (technical, personal, work)..."

   - When a user submits a problem (e.g., "WiFi not working" or "How to prepare a presentation"), display a clean step-by-step solution card (Step 1, Step 2, Step 3).

   - Save recent problem queries in a quick-access sidebar.

5. Visual Progress Dashboard:

   - Statistics cards: Total Tasks, Completed Tasks, Productivity Score (%).

   - Progress bar showing daily completion rate.

Please generate the entire frontend layout, state management, interactive mock data, and smooth animations so the app is 100% functional, responsive, and ready to demonstrate!

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/505ec4f4-0f32-449b-b6b3-eb1d98742907).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
