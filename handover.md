# AI Progress Handover

## Current Objective

Refine the Coach Portal mobile web prototype into a cleaner, more polished mobile experience that matches the README goals: simple for older coaches, login-first, bottom navigation, and hamburger drawer for secondary controls.

## Work Completed

- Re-read `coach-portal-readme.md` and confirmed the real priorities are elderly-friendly readability, clear next actions, static mock flows, and simple navigation.
- Re-read `handover.md` and identified stale decisions that no longer matched the current user direction.
- Researched current `ClassPass` login structure on `classpass.com/login` for reference on mobile-web login simplicity:
  - Welcome-back heading
  - Social sign-in buttons
  - Email and password fields
  - Primary login CTA
  - Secondary recovery/help paths
- Rebuilt the prototype UI in `src/App.tsx` and `src/styles.css`:
  - Added a static email/password login screen
  - Added bottom navigation for `Today / Classes / Students / Inbox / More`
  - Added a hamburger drawer for secondary navigation and settings
  - Added 3-level font size switching in the drawer
  - Replaced the previous heavy dark visual treatment with a lighter blue mobile-web design
  - Kept overlays for class, student, alert, parent, admin, and safety flows
- Verified the app builds successfully with `npm run build`.

## In-Progress Items

- The prototype is redesigned, but it is not yet expanded to all 27 minimum screens from the README.
- Current focus should be screen coverage and refinement rather than another top-level visual rewrite.

## Next Recommended Steps

1. Review the new login and dashboard flow in the browser and collect concrete visual feedback.
2. Expand missing README screens, starting with:
   - Attendance summary
   - Coach attendance
   - Progress update
   - Test readiness
   - Equipment issue report
   - Handover notes
3. Improve the drawer into a fuller `More`/settings experience if needed.
4. Replace the inline SVG placeholder with the exact brand asset if provided.
5. Keep verifying with `npm run build` after each UI pass.

## Open Blockers / Risks

- No technical blocker at the moment.
- The main risk is over-styling the prototype and drifting away from the README requirement for simplicity and elderly-friendly clarity.

## Decisions Made

- **README is the source of truth** when `handover.md` and recent visual experiments conflict.
- **Login is static only**: any email/password is accepted and transitions into the prototype.
- **Navigation uses both bottom tabs and a hamburger drawer**:
  - Bottom nav for primary destinations
  - Drawer for secondary access and font size settings
- **System UI font stack** is being used instead of loading a webfont.
- **No backend**: all flows remain static mock UI only.

## Important Context / References

- Product spec: `coach-portal-readme.md`
- Existing app entry: `src/App.tsx`, `src/mockData.ts`, `src/styles.css`
- Vite config: `vite.config.ts`
- Current ClassPass login reference used for structure only: `https://classpass.com/login`
- Node modules installed, `npm run build` passes
