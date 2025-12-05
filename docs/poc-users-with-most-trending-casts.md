# Users with most trending casts

Proof of Concept

## implementation

- add a trigger for a scheduled Cloudflare cron job
  - call Naynar API to fetch trending casts from the global feed for the previous week (can be scoped down to channels), need to drain paginated response
  - store the list of trending casts in DB table trending_cast
  - aggregate a week trending casts and find users that got most trending casts
- job must be idempotent to be able to rerun failed jobs or handle accidental extra redundant runs

