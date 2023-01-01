## [1.0.3-develop.1](https://github.com/sebbo2002/action-template-updater/compare/v1.0.2...v1.0.3-develop.1) (2023-01-01)

## [1.0.2](https://github.com/sebbo2002/action-template-updater/compare/v1.0.1...v1.0.2) (2022-12-11)

## [1.0.2-develop.3](https://github.com/sebbo2002/action-template-updater/compare/v1.0.2-develop.2...v1.0.2-develop.3) (2022-12-09)

## [1.0.2-develop.2](https://github.com/sebbo2002/action-template-updater/compare/v1.0.2-develop.1...v1.0.2-develop.2) (2022-12-04)

## [1.0.2-develop.1](https://github.com/sebbo2002/action-template-updater/compare/v1.0.1...v1.0.2-develop.1) (2022-09-26)

## [1.0.1](https://github.com/sebbo2002/action-template-updater/compare/v1.0.0...v1.0.1) (2022-09-12)

## [1.0.1-develop.1](https://github.com/sebbo2002/action-template-updater/compare/v1.0.0...v1.0.1-develop.1) (2022-08-22)

# 1.0.0 (2022-07-25)


### Bug Fixes

* **CI:** Fix DockerHub container release ([01b7534](https://github.com/sebbo2002/action-template-updater/commit/01b753406d1f1ef24a949c7d7b946d99b779d013))
* Configure assignees with comma separated string ([6bd9733](https://github.com/sebbo2002/action-template-updater/commit/6bd97334a6e5f3bb211bce5516557cc8993ac3cb))
* Do not try to detect the branch ([9296fc9](https://github.com/sebbo2002/action-template-updater/commit/9296fc9a3db0dd13b81ebcacf677d9d3170ba8c0))
* Set git username after clone to allow local config ([522d403](https://github.com/sebbo2002/action-template-updater/commit/522d40328907cdb4c39835ae3121aaa8c5ba6e0a))
* Try to fix the push permission issue ([8460e70](https://github.com/sebbo2002/action-template-updater/commit/8460e70ff576cc8218f7ecf3babc375c723534d5))


### Build System

* Native ESM support ([7b86a4f](https://github.com/sebbo2002/action-template-updater/commit/7b86a4f1187c387a3a5792e1fb72d822b04e3631))


### chore

* Remove node.js 10 Support ([2b910c0](https://github.com/sebbo2002/action-template-updater/commit/2b910c09bc8a41085fc4472159494d8738d5521e))


* Merge branch 'typescript' into github-actions ([f4a742e](https://github.com/sebbo2002/action-template-updater/commit/f4a742ed013d172ff2c3e963987038113f8edcbb))


### Features

* allow to configure bot token ([a48e1f8](https://github.com/sebbo2002/action-template-updater/commit/a48e1f8d7a6360601e43c364e44382a5a4022988))
* Don't handle job tokens as warning ([a01b54a](https://github.com/sebbo2002/action-template-updater/commit/a01b54ad4f4086009beb8fb4b6963c7c9b7ae648))
* first commit ([c4734cd](https://github.com/sebbo2002/action-template-updater/commit/c4734cd7b69b4398ad46ed5118b9885492352e4a))
* Mini cli to run updater locally ([5d3dcd3](https://github.com/sebbo2002/action-template-updater/commit/5d3dcd30c182ebed27ab2dbb954714dfc2bf3b48))
* Stop if repo and template are the same ([5796ce8](https://github.com/sebbo2002/action-template-updater/commit/5796ce800ce9b8efe3169f8b2b56a12eb0598e88))


### BREAKING CHANGES

* Only Support for node.js >=14.13.1
* Only Support for node.js ^12.20.0 || >=14.13.1
* Removed support for node.js v10

# [1.0.0-develop.12](https://github.com/sebbo2002/action-template-updater/compare/v1.0.0-develop.11...v1.0.0-develop.12) (2022-07-19)


### Build System

* Native ESM support ([7b86a4f](https://github.com/sebbo2002/action-template-updater/commit/7b86a4f1187c387a3a5792e1fb72d822b04e3631))


* Merge branch 'typescript' into github-actions ([f4a742e](https://github.com/sebbo2002/action-template-updater/commit/f4a742ed013d172ff2c3e963987038113f8edcbb))


### BREAKING CHANGES

* Only Support for node.js >=14.13.1
* Only Support for node.js ^12.20.0 || >=14.13.1

# [1.0.0-develop.11](https://github.com/sebbo2002/action-template-updater/compare/v1.0.0-develop.10...v1.0.0-develop.11) (2022-06-22)

# [1.0.0-develop.10](https://github.com/sebbo2002/action-template-updater/compare/v1.0.0-develop.9...v1.0.0-develop.10) (2022-06-16)


### Features

* allow to configure bot token ([a48e1f8](https://github.com/sebbo2002/action-template-updater/commit/a48e1f8d7a6360601e43c364e44382a5a4022988))

# [1.0.0-develop.9](https://github.com/sebbo2002/action-template-updater/compare/v1.0.0-develop.8...v1.0.0-develop.9) (2022-06-10)

# [1.0.0-develop.8](https://github.com/sebbo2002/action-template-updater/compare/v1.0.0-develop.7...v1.0.0-develop.8) (2022-05-20)


### Bug Fixes

* Do not try to detect the branch ([9296fc9](https://github.com/sebbo2002/action-template-updater/commit/9296fc9a3db0dd13b81ebcacf677d9d3170ba8c0))


### Features

* Mini cli to run updater locally ([5d3dcd3](https://github.com/sebbo2002/action-template-updater/commit/5d3dcd30c182ebed27ab2dbb954714dfc2bf3b48))

# [1.0.0-develop.7](https://github.com/sebbo2002/action-template-updater/compare/v1.0.0-develop.6...v1.0.0-develop.7) (2022-05-20)


### Reverts

* Revert "ci: Remove GH_TOKEN and use GITHUB_TOKEN" ([b5c2eb6](https://github.com/sebbo2002/action-template-updater/commit/b5c2eb66170b38bda1e49ad5bb5cf02bd13eb8e4))

# [1.0.0-develop.6](https://github.com/sebbo2002/action-template-updater/compare/v1.0.0-develop.5...v1.0.0-develop.6) (2022-05-19)


### Bug Fixes

* Try to fix the push permission issue ([8460e70](https://github.com/sebbo2002/action-template-updater/commit/8460e70ff576cc8218f7ecf3babc375c723534d5))

# [1.0.0-develop.5](https://github.com/sebbo2002/action-template-updater/compare/v1.0.0-develop.4...v1.0.0-develop.5) (2022-05-14)

# [1.0.0-develop.4](https://github.com/sebbo2002/action-template-updater/compare/v1.0.0-develop.3...v1.0.0-develop.4) (2022-05-13)


### Bug Fixes

* Set git username after clone to allow local config ([522d403](https://github.com/sebbo2002/action-template-updater/commit/522d40328907cdb4c39835ae3121aaa8c5ba6e0a))


### Features

* Don't handle job tokens as warning ([a01b54a](https://github.com/sebbo2002/action-template-updater/commit/a01b54ad4f4086009beb8fb4b6963c7c9b7ae648))

# [1.0.0-develop.3](https://github.com/sebbo2002/action-template-updater/compare/v1.0.0-develop.2...v1.0.0-develop.3) (2022-05-13)


### Bug Fixes

* Configure assignees with comma separated string ([6bd9733](https://github.com/sebbo2002/action-template-updater/commit/6bd97334a6e5f3bb211bce5516557cc8993ac3cb))

# [1.0.0-develop.2](https://github.com/sebbo2002/action-template-updater/compare/v1.0.0-develop.1...v1.0.0-develop.2) (2022-05-13)


### Features

* Stop if repo and template are the same ([5796ce8](https://github.com/sebbo2002/action-template-updater/commit/5796ce800ce9b8efe3169f8b2b56a12eb0598e88))

# 1.0.0-develop.1 (2022-05-13)


### Bug Fixes

* **CI:** Fix DockerHub container release ([01b7534](https://github.com/sebbo2002/action-template-updater/commit/01b753406d1f1ef24a949c7d7b946d99b779d013))


### chore

* Remove node.js 10 Support ([2b910c0](https://github.com/sebbo2002/action-template-updater/commit/2b910c09bc8a41085fc4472159494d8738d5521e))


### Features

* first commit ([c4734cd](https://github.com/sebbo2002/action-template-updater/commit/c4734cd7b69b4398ad46ed5118b9885492352e4a))


### BREAKING CHANGES

* Removed support for node.js v10
