let local_config = {};
try {
  local_config = require('./.huskyrc.local');
} catch (e) { }
/**

You can customize hooks by creating .huskryrc.local.js in this directory.

# Example

module.exports = {
  hooks:
    //  null disables the hook
    'pre-commit': null,

    //  custom script overrides default script
    'post-merge': './tools/install_all_node_modules.js --ci',
  },
};

*/
const hooks = {
  'pre-commit': 'lint-staged --shell true',
  // 'post-merge': './tools/install_all_node_modules.js',
};

const local_hooks = local_config.hooks || {};

for (const hook of Object.keys(local_hooks)) {
  const local_script = local_hooks[hook];
  if (local_script === null) {
    delete hooks[hook];
  } else {
    hooks[hook] = local_script;
  }
}


module.exports = { hooks };
