# Jsonnet-cli
*a wrapper around [node-jsonnet](https://github.com/rbicker/node-jsonnet) for the cli*

## Installation
```
npm i -g jsonnet-cli
```

## Usage
```
jsonnet --src ./demo1.jsonnet --output ./dist
jsonnet -i ./demo1.jsonnet -o ./ --yaml 
```

All arguments argument are optional
```
-i, --input     input file or dir to search for files, default is ./
-o, --output    output file or dir, deafult is ./
-y, --yaml      output as yaml instead of json
-h, --heml      display usage instructions
```