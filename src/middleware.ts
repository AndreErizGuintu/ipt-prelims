import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware(); // Middleware to handle Clerk authentication

// This middleware will run for all routes except those that are explicitly excluded
// You can customize the matcher to include or exclude specific routes as needed
// For example, you might want to skip certain API routes or static files

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};