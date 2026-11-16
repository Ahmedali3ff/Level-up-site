# Level Up Site

The official codebase for the Level Up site.

## Branching Strategy

| Branch | Purpose |
| --- | --- |
| `main` | Production-ready code only. Never commit directly. |
| `develop` | Integration branch. All features merge here first. |
| `feature/*` | New features or pages (e.g. `feature/home-page`). |
| `fix/*` | Bug fixes (e.g. `fix/navbar-overflow`). |
| `hotfix/*` | Urgent production fixes, branched from `main`. |

## Workflow

1. Branch from `develop`: `git checkout develop && git pull && git checkout -b feature/your-feature`
2. Commit small, focused changes using [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `docs:`, `chore:`).
3. Push and open a Pull Request into `develop`.
4. After review, merge. When `develop` is stable, open a PR from `develop` into `main`.

See [CONTRIBUTING.md](CONTRIBUTING.md) for details.
