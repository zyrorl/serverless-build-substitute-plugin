# Serverless Build Substitute Plugin

A [Serverless Build Plugin](https://github.com/nfour/serverless-build-plugin) to substitute files into a build (eg. AWS binaries into node_modules) prior to deployment.

**NOTE:** currently works on Serverless 0.5.x only.

Support for Serverless 1.0.x is coming once it has reached RC/Stable.

To use simply add `serverless-substitute-plugin` to your `"plugins"` section in your `s-project.json` file.

Then to use you can simply add it as an entry in your `serverless.build.yml` file in your project root.

This can be used for deploying AWS compatible binaries into the package before deployment.

## Configuration

```yml
# ./serverless.build.yml

method: "bundle"

sourceMaps : true
babel      : true # Will use ./.babelrc
uglify     : true # Will use defaults

exclude:
  - "*" # Ignores the root directory

modules:
  exclude: # excluded from the root node_modules
    - aws-sdk

  deepExclude: # excluded from nested node_modules
    - aws-sdk

## Global Substitute File (will run on all functions deployed)
substitute:
  - from: "bin/somefile.bin" # Rel path to your project for the file to substitute from
    to: "somefile.bin" # One or more destinations for the file to be copied to

functions:
  one:
    include:
      - "functions/one/**"
      - "lib/one/**"

    exclude:
      - "**/*.json"
    
    # Substitute Files (per function)
    substitute:
      - from: "bin/iconv.node" # Rel path to your project for the file to substitute from
        to: # One or more destinations for the file to be copied to
          - "node_modules/iconv/build/Release/iconv.node"
          - "node_modules/iconv/build/Release/obj.target/iconv.node"
          - "node_modules/iconv/build/Debug/iconv.node"
          - "node_modules/iconv/build/Debug/obj.target/iconv.node"

      - from: "bin/somefile.bin" # Rel path to your project for the file to substitute from
        to: "somefile.bin" # One or more destinations for the file to be copied to

```