const configuration = {
    'branches': [
        'main',
        {
            'name': 'develop',
            'channel': 'next',
            'prerelease': true
        }
    ],
    'plugins': []
};

configuration.plugins.push(['@semantic-release/commit-analyzer', {
    'releaseRules': [
        {'type': 'chore', 'scope': 'deps', 'release': 'patch'},
        {'type': 'chore', 'scope': 'package', 'release': 'patch'},
        {'type': 'build', 'scope': 'deps', 'release': 'patch'},
        {'type': 'docs', 'release': 'patch'}
    ]
}]);

configuration.plugins.push('@semantic-release/release-notes-generator');

configuration.plugins.push('@semantic-release/changelog');

configuration.plugins.push('semantic-release-license');

configuration.plugins.push(['@semantic-release/exec', {
    'prepareCmd': './.github/workflows/build.sh'
}]);

configuration.plugins.push(['@semantic-release/github', {
    'labels': false,
    'assignees': process.env.GH_OWNER
}]);

configuration.plugins.push(['@semantic-release/git', {
    'assets': ['CHANGELOG.md', 'LICENSE', 'dist/**/*'],
    'message': 'chore(release): :bookmark: ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}'
}]);

module.exports = configuration;
