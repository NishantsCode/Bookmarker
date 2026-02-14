# Bookmarker - Personal Bookmark Manager

A modern, real-time bookmark manager built with Next.js, Supabase, and Tailwind CSS.

🌐 Live Demo: https://bookmarkertask.vercel.app

✨ Features

- Google OAuth Authentication
- Real-time synchronization across tabs
- Private bookmarks with Row Level Security
- Add, edit, and delete bookmarks
- Light/Dark theme toggle
- Mobile responsive design
- URL auto-prefill with https://


 Tech Stack: Next.js 16, React 19, TypeScript, Supabase (Auth, Database, Realtime), Tailwind CSS v4

Quick Setup

1. Clone and install:
```bash
git clone <repo-url>
cd bookmark-manager
npm install
```

2. Create `.env`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

3. Set up Supabase:
   - Create project at [supabase.com](https://supabase.com)
   - Run SQL from `DATABASE_SETUP.sql`
   - Enable Google OAuth in Authentication settings

4. Configure Google OAuth at [console.cloud.google.com](https://console.cloud.google.com)

5. Run:
```bash
npm run dev
```


Problems Faced During the Project

1. Realtime INSERT Events Not Working

When I added a new bookmark, it wasn't showing up in real-time. I had to refresh the page to see it, which defeated the whole purpose of having real-time updates. After digging into the Supabase documentation, I realized the issue was with how I set up the subscription. The realtime listener wasn't filtering by the current user's ID, so it wasn't picking up the INSERT events properly. 

The fix was simple but crucial - I added a filter to the subscription: `filter: user_id=eq.${user.id}`. This tells Supabase to only listen for bookmarks that belong to the logged-in user. Once I added this, new bookmarks started appearing instantly without any page refresh!

2. Realtime DELETE Events Not Working

This one was tricky. When I deleted a bookmark in one tab, it stayed visible in other open tabs until I refreshed. I thought I could use the same filtering approach as INSERT events, but that didn't work. After some debugging, I discovered that when Supabase sends a DELETE event, the payload only contains the old record's ID - it doesn't include the user_id field. So my filter was actually blocking the DELETE events from coming through.

The solution was to remove the filter entirely from DELETE events. At first, I was worried about security, but then I realized that Row Level Security (RLS) policies already prevent users from deleting each other's bookmarks at the database level. So even without the filter, users can only receive DELETE events for their own bookmarks. Once I removed that filter, deletions started syncing perfectly across all tabs!

3. URL Input UX Issue

Typing "https://" every single time I wanted to add a bookmark was getting really annoying. I mean, almost every website uses HTTPS these days anyway, right?

So I made the input field smarter. Now when you click on it, it just puts "https://" there for you, and you can type "google.com" or whatever. But here's the thing - if you copy-paste a full URL that already has "https://" in it, the field won't add another one. That was actually the tricky part to figure out. I also made it so if you leave the field with just "https://" and nothing else, it clears itself because that's obviously not a valid URL. Works pretty well now - you can either paste full URLs or just type the domain name, whatever's easier.

---
