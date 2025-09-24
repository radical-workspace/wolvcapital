# Migration Guide: Laravel-first, Sanctum, Admin Approvals

## Summary

This project has fully migrated from Supabase-first to Laravel-first architecture:
- All authentication and session flows use Laravel Sanctum
- All admin approval logic is handled by Laravel backend
- No Supabase code remains in backend, frontend, or documentation

## Changes

- Replaced Supabase hooks and API calls with Laravel API client in `src/lib/laravel-api.ts`
- Refactored authentication flows to use `useAuth-laravel.tsx` and Sanctum
- All admin approval requests are stored in `admin_approvals` table and reviewed via backend API
- Documentation and environment variables updated

## Testing

- Register and login at `/auth/register` and `/auth/login`
- Access dashboard at `/dashboard`
- Submit approval requests as user
- Review and update approval status as admin at `/admin/approvals`

## API Reference

See `/backend/routes/api.php` for complete endpoint list.