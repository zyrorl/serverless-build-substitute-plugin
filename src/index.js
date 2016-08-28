import path from 'path';
import fs from 'fs';
import Promise from 'bluebird';
import Yaml from 'js-yaml';

export default function (S) {
  const SCli = require(S.getServerlessPath('utils/cli')); // eslint-disable-line

  class ServerlessBuildSubstitutes extends S.classes.Plugin {

    config = {
      substitute: [],
      functions: [],
    }

    constructor() {
      super();
      this.name = 'ServerlessBuildSubstitutes';

      // PLUGIN CONFIG GENERATION

      const servicePath = S.config.projectPath;
      const buildConfigPath = path.join(servicePath, './serverless.build.yml');

      const buildConfig = fs.existsSync(buildConfigPath)
        ? Yaml.load(fs.readFileSync(buildConfigPath))
        : {};

      // The config inherits from multiple sources
      this.config = {
        ...this.config,
        ...buildConfig,
      };
    }

    async registerHooks() {
      S.addHook(this.substitute.bind(this), {
        action: 'buildCompleteArtifact',
        event: 'pre',
      });
      return;
    }

    async substitute(e) {
      let substitutes = [...this.config.substitute];
      if (
        this.config.functions &&
        this.config.functions[e.options.name] &&
        this.config.functions[e.options.name].substitute
      ) {
        substitutes = [...this.config.functions[e.options.name].substitute, ...substitutes];
      }

      if (substitutes.length > 0) {
        SCli.log(`Substituting files for ${e.options.name}...`);
        for (const substitute of substitutes) {
          fs.accessSync(`${S.config.projectPath}/${substitute.from}`, fs.R_OK);
          substitute.to = Array.isArray(substitute.to) ? substitute.to : [substitute.to];
          for (const substituteFile of substitute.to) {
            SCli.log(`${substitute.from} => ${substituteFile}`);
            e.options.artifact.addFile(
              `${S.config.projectPath}/${substitute.from}`,
              substituteFile
            );
          }
        }
      }

      return e;
    }
  }

  return ServerlessBuildSubstitutes;
}
