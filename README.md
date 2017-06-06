# system-pack
systemjs tools for generate system.config.js with package.json dependencies and subdependencies

# install
`npm install system-pack --save-dev`

add this on your package.json
````
...
"scripts": {
  ...
  "config":"system-pack"
  ...
},
...
````

use system-pack
`npm run config`

override
````
"system": {
    "paths": {
      "core-js/library/fn/symbol": "core-js/library/fn/symbol/index.js"
    },
    "packages": {
      "/lib": {
        "defaultExtention": "js"
      },
      "react": {
        "main": "dist/react.js"
      },
      "react-dom": {
        "main": "dist/react-dom.js"
      }
    }
  }
````
