# Contributing

## Branch naming

- `feature/<short-description>` for new work
- `fix/<short-description>` for bug fixes
- `hotfix/<short-description>` for urgent production fixes
- `docs/<short-description>` for documentation only

## Commit messages

Use Conventional Commits:

- `feat: add hero section`
- `fix: correct mobile menu overlap`
- `docs: update setup steps`
- `chore: update dependencies`

## Reducing merge conflicts

- Keep branches short-lived and focused on one task.
- Pull the latest `develop` into your branch often (`git pull origin develop`).
- Avoid editing the same file as someone else at the same time; agree on ownership first.
- Never force-push to `main` or `develop`.

## Pull requests

- Target `develop` (except hotfixes, which target `main`).
- Fill in the PR template.
- Make sure the site builds and runs before requesting review.
