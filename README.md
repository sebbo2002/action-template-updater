# action-template-updater

[![License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](LICENSE)

Updates a fork of a template repository by creating pull requests for changes.
Used in my [JavaScript Template](https://github.com/sebbo2002/js-template).

## ⚡️ Quick Start

```
uses: sebbo2002/action-template-updater
with:
  token: ${{ secrets.GITHUB_TOKEN }}
  template: sebbo2002/js-template/typescript
  assignees:
    - sebbo2002
```

#### Or run via commandline:

```
npm run updater -- sebbo2002/js-template/typescript sebbo2002/my-repository-to-update
```

## 🙆🏼‍♂️ Copyright and license

Copyright (c) Sebastian Pekarek under the [MIT license](LICENSE).
