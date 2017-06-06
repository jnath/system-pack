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