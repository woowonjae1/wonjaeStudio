# Implementation Plan

- [x] 1. Set up database schema and project structure
  - [x] 1.1 Create database migration for music_tracks and admin_users tables
    - Add music_tracks table with id, title, description, image_url, audio_url, display_order, play_count, created_at, updated_at
    - Add admin_users table with id, username, password_hash, created_at
    - Create indexes for performance
    - _Requirements: 5.1, 5.3_

  - [x] 1.2 Set up Supabase Storage buckets
    - Create music-covers bucket for cover images
    - Create music-audio bucket for audio files
    - Configure public access policies
    - _Requirements: 5.3_

  - [x] 1.3 Create admin directory structure and install dependencies
    - Create src/app/admin/ directory structure
    - Install fast-check for property testing
    - Add @tabler/icons-react for icons
    - _Requirements: 6.1_

- [x] 2. Implement authentication system
  - [x] 2.1 Create admin auth API routes
    - Implement POST /api/admin/auth/login with JWT token generation
    - Implement POST /api/admin/auth/logout
    - Use bcrypt for password hashing
    - Store token in HTTP-only cookie
    - _Requirements: 1.1, 1.2, 1.3, 1.5_

  - [x] 2.2 Create auth middleware for protected routes
    - Verify JWT token from cookie
    - Return 401 for unauthorized requests
    - _Requirements: 1.4_

  - [x] 2.3 Write property test for invalid credentials rejection
    - **Property 11: Invalid credentials rejection**
    - **Validates: Requirements 1.3**

  - [x] 2.4 Create login page UI
    - Build login form with username and password fields
    - Handle form submission and error display
    - Redirect to dashboard on success
    - _Requirements: 1.1, 1.2, 1.3_

- [x] 3. Implement admin layout and navigation
  - [x] 3.1 Create AdminSidebar component
    - Navigation links: Dashboard, Music, Topics, Replies
    - Collapsible on mobile (< 768px)
    - Active state indication
    - _Requirements: 6.1, 6.2_

  - [x] 3.2 Create AdminHeader component
    - Display current page title
    - Logout button
    - _Requirements: 1.5, 6.1_

  - [x] 3.3 Create admin layout wrapper
    - Combine sidebar and header
    - Auth check and redirect
    - _Requirements: 6.1_

- [x] 4. Implement dashboard statistics
  - [x] 4.1 Create stats API route
    - GET /api/admin/stats
    - Return totalTopics, totalReplies, totalViews, topicsLast7Days, totalTracks, recentTopics
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

  - [x] 4.2 Write property test for stats aggregation
    - **Property 1: Stats aggregation correctness**
    - **Validates: Requirements 2.1, 2.2, 2.3, 2.4**

  - [x] 4.3 Write property test for recent topics ordering
    - **Property 2: Recent topics ordering and completeness**
    - **Validates: Requirements 2.5**

  - [x] 4.4 Create StatsCards component
    - Display stats in card format similar to shadcn-dashboard
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

  - [x] 4.5 Create dashboard page
    - Fetch and display stats
    - Show recent topics list
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [x] 5. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 6. Implement topics management
  - [x] 6.1 Create topics API routes
    - GET /api/admin/topics with pagination, category filter, search
    - DELETE /api/admin/topics/[id] with cascade delete of replies
    - PUT /api/admin/topics/[id]/pin for toggle pinned status
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_

  - [x] 6.2 Write property test for pagination
    - **Property 3: Pagination correctness**
    - **Validates: Requirements 3.1, 4.1**

  - [x] 6.3 Write property test for topic delete cascade
    - **Property 4: Topic delete cascades to replies**
    - **Validates: Requirements 3.3**

  - [x] 6.4 Write property test for pin toggle
    - **Property 5: Pin toggle idempotence**
    - **Validates: Requirements 3.4**

  - [x] 6.5 Write property test for filter and search
    - **Property 6: Filter and search correctness**
    - **Validates: Requirements 3.5, 3.6**

  - [x] 6.6 Create DataTable component
    - Sortable columns
    - Pagination controls
    - Action buttons (delete, pin)
    - _Requirements: 3.1, 3.2, 6.4_

  - [x] 6.7 Write property test for table sorting
    - **Property 10: Table sorting correctness**
    - **Validates: Requirements 6.4**

  - [x] 6.8 Create topics management page
    - Category filter dropdown
    - Search input
    - Topics table with actions
    - Confirmation dialog for delete
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_

- [x] 7. Implement replies management
  - [x] 7.1 Create replies API routes
    - GET /api/admin/replies with pagination
    - DELETE /api/admin/replies/[id]

    - _Requirements: 4.1, 4.2, 4.3_

  - [x] 7.2 Write property test for reply delete
    - **Property 7: Reply delete removes only target**
    - **Validates: Requirements 4.3**

  - [x] 7.3 Create replies management page
    - Replies table with content preview, author, topic title, time
    - Delete action with confirmation
    - Link to associated topic
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [x] 8. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 9. Implement music management
  - [x] 9.1 Create music API routes
    - GET /api/admin/music - list all tracks
    - POST /api/admin/music - create track with file upload
    - PUT /api/admin/music/[id] - update track
    - DELETE /api/admin/music/[id] - delete track and files
    - PUT /api/admin/music/reorder - update display order
    - _Requirements: 5.1, 5.3, 5.4, 5.5, 5.6_

  - [x] 9.2 Create FileUpload component
    - Support image and audio file types
    - Preview for images
    - Upload progress indicator
    - _Requirements: 5.2, 5.3_

  - [x] 9.3 Create MusicForm component
    - Form fields: title, description
    - File upload for cover image and audio
    - Validation
    - _Requirements: 5.2, 5.3, 5.4_

  - [x] 9.4 Write property test for music track CRUD
    - **Property 8: Music track create and delete consistency**
    - **Validates: Requirements 5.3, 5.5**

  - [x] 9.5 Write property test for track reorder
    - **Property 9: Track reorder preserves all tracks**
    - **Validates: Requirements 5.6**

  - [x] 9.6 Create music management page
    - Track list with drag-and-drop reorder
    - Add/Edit track modal with form
    - Delete action with confirmation
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_

- [x] 10. Update homepage to use database music data
  - [x] 10.1 Create public music API route
    - GET /api/music - return tracks ordered by display_order
    - _Requirements: 5.7_

  - [x] 10.2 Update MusicCards component
    - Fetch tracks from API instead of hardcoded data
    - Handle loading and error states
    - _Requirements: 5.7_

- [x] 11. Add UI polish and feedback
  - [x] 11.1 Add toast notifications
    - Success/error feedback for all actions
    - _Requirements: 6.3_

  - [x] 11.2 Add loading states
    - Skeleton loaders for data tables
    - Button loading states during actions
    - _Requirements: 6.3_

  - [x] 11.3 Mobile responsive adjustments
    - Test and fix responsive issues
    - _Requirements: 6.2_

- [ ] 12. Final Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
