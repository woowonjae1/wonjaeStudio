# Requirements Document

## Introduction

本文档定义了音乐博客网站后台管理系统的需求。该系统为网站管理员提供社区内容管理、音乐内容管理和数据统计功能。后台管理系统将作为现有 Next.js 项目的一部分，部署在 Vercel 上，使用 Supabase 作为数据存储，UI 设计参照 shadcn-dashboard 的简洁风格。

## Glossary

- **Admin Dashboard（后台管理系统）**: 供管理员使用的网页界面，用于管理社区内容、音乐内容和查看统计数据
- **Topic（话题）**: 社区中用户发布的帖子，包含标题、内容、分类等信息
- **Reply（回复）**: 用户对话题的评论
- **Track（音乐曲目）**: 首页展示的音乐卡片，包含标题、描述、封面图和音频文件
- **Supabase**: 开源的 Firebase 替代品，提供数据库和认证服务
- **Supabase Storage**: Supabase 提供的文件存储服务，用于存储音频和图片文件
- **Admin（管理员）**: 拥有后台管理权限的用户
- **Pin（置顶）**: 将话题固定在列表顶部的操作

## Requirements

### Requirement 1

**User Story:** As an admin, I want to log in to the admin dashboard securely, so that I can access management features.

#### Acceptance Criteria

1. WHEN an admin visits the admin login page THEN the Admin Dashboard SHALL display a login form with username and password fields
2. WHEN an admin submits valid credentials THEN the Admin Dashboard SHALL authenticate the admin and redirect to the dashboard home
3. WHEN an admin submits invalid credentials THEN the Admin Dashboard SHALL display an error message and remain on the login page
4. WHILE an admin session is active THEN the Admin Dashboard SHALL maintain the authenticated state across page navigations
5. WHEN an admin clicks the logout button THEN the Admin Dashboard SHALL terminate the session and redirect to the login page

### Requirement 2

**User Story:** As an admin, I want to view community statistics on the dashboard, so that I can understand the community activity at a glance.

#### Acceptance Criteria

1. WHEN an admin accesses the dashboard home THEN the Admin Dashboard SHALL display total topic count
2. WHEN an admin accesses the dashboard home THEN the Admin Dashboard SHALL display total reply count
3. WHEN an admin accesses the dashboard home THEN the Admin Dashboard SHALL display total view count across all topics
4. WHEN an admin accesses the dashboard home THEN the Admin Dashboard SHALL display the count of topics created in the last 7 days
5. WHEN an admin accesses the dashboard home THEN the Admin Dashboard SHALL display a list of recent topics with title, author, and creation time

### Requirement 3

**User Story:** As an admin, I want to manage community topics, so that I can moderate content and maintain community quality.

#### Acceptance Criteria

1. WHEN an admin navigates to the topics management page THEN the Admin Dashboard SHALL display a paginated list of all topics
2. WHEN an admin views the topic list THEN the Admin Dashboard SHALL show topic title, author, category, views, replies count, and creation time for each topic
3. WHEN an admin clicks the delete button for a topic THEN the Admin Dashboard SHALL remove the topic and its associated replies from the database
4. WHEN an admin clicks the pin button for a topic THEN the Admin Dashboard SHALL toggle the pinned status of that topic
5. WHEN an admin uses the category filter THEN the Admin Dashboard SHALL display only topics matching the selected category
6. WHEN an admin uses the search input THEN the Admin Dashboard SHALL filter topics by title containing the search term

### Requirement 4

**User Story:** As an admin, I want to manage replies, so that I can remove inappropriate content.

#### Acceptance Criteria

1. WHEN an admin navigates to the replies management page THEN the Admin Dashboard SHALL display a paginated list of all replies
2. WHEN an admin views the reply list THEN the Admin Dashboard SHALL show reply content preview, author, associated topic title, and creation time
3. WHEN an admin clicks the delete button for a reply THEN the Admin Dashboard SHALL remove the reply from the database
4. WHEN an admin clicks on a reply THEN the Admin Dashboard SHALL navigate to the associated topic detail page

### Requirement 5

**User Story:** As an admin, I want to manage music tracks displayed on the homepage, so that I can update the music collection dynamically.

#### Acceptance Criteria

1. WHEN an admin navigates to the music management page THEN the Admin Dashboard SHALL display a list of all music tracks with title, description, cover image preview, and audio status
2. WHEN an admin clicks the add track button THEN the Admin Dashboard SHALL display a form to input track title, description, upload cover image, and upload audio file
3. WHEN an admin submits a new track with valid data THEN the Admin Dashboard SHALL upload files to Supabase Storage and create a track record in the database
4. WHEN an admin clicks the edit button for a track THEN the Admin Dashboard SHALL display a form pre-filled with the track data for modification
5. WHEN an admin clicks the delete button for a track THEN the Admin Dashboard SHALL remove the track record and associated files from storage
6. WHEN an admin drags a track in the list THEN the Admin Dashboard SHALL update the display order of tracks
7. WHEN the homepage loads THEN the system SHALL fetch track data from the database instead of using hardcoded data

### Requirement 6

**User Story:** As an admin, I want the dashboard to have a clean and responsive UI, so that I can manage content efficiently on any device.

#### Acceptance Criteria

1. WHEN the Admin Dashboard loads THEN the system SHALL render a sidebar navigation with links to Dashboard, Music, Topics, and Replies pages
2. WHEN the viewport width is less than 768 pixels THEN the Admin Dashboard SHALL collapse the sidebar into a mobile-friendly menu
3. WHEN an admin performs any action THEN the Admin Dashboard SHALL provide visual feedback through loading states or toast notifications
4. WHEN the Admin Dashboard displays data tables THEN the system SHALL support sorting by clicking column headers
