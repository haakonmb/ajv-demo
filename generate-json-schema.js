// original source: https://github.com/vega/ts-json-schema-generator

const tsj = require('ts-json-schema-generator');
const fs = require('fs');

/** @type {import('ts-json-schema-generator/dist/src/Config').Config} */
const config = {
  path: 'types.ts',
  tsconfig: 'tsconfig.json',
  type: 'Query', // Or <type-name> if you want to generate schema for that one type only
};

const output_path = 'json-schema/';
const output_file = 'QuerySchema.json';

const schema = tsj.createGenerator(config).createSchema(config.type);
const schemaString = JSON.stringify(schema, null, 2);
// create the folder if it doesnt exist
if (!fs.existsSync(output_path)) {
  fs.mkdirSync(output_path);
}
fs.writeFile(output_path + output_file, schemaString, (err) => {
  if (err) throw err;
});
