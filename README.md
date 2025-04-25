# template

[![License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](LICENSE)

Here would be a very short description of the project. So in this example it would be a short information that this is
a template that I use to start new projects and services.

## 🚨 Template Usage Checklist

- [ ] Update project name in `package.json`
- [ ] Create `main` and `develop` branches
- [ ] Set `develop` as default branch
- [ ] Update `action.yml` ([Branding Cheat Sheet](https://actions-cool.github.io/github-action-branding/))
- [ ] Go through repo settings
    - [ ] Add `main` protected branch
        - Require a pull request before merging
        - Require `Release` status checks to pass before merging
        - Lock branch

## ⚡️ Quick Start

```
uses: sebbo2002/action-foo-bar
with:
  token: ${{ secrets.GITHUB_TOKEN }}
```

## 🙆🏼‍♂️ Copyright and license

Copyright (c) Sebastian Pekarek under the [MIT license](LICENSE).
