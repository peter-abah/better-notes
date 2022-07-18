// Lowercase camelCase and add seprators between the words
// e.g camelCase => camel_case
// CaseCamel => c_ase_camel
export const decamelize = (str: string, sep = "_") =>
  str.replace(
    /(\p{Lu}\P{Lu})|(\P{Lu}\p{Lu})/gu,
    (m) => `${m[0].toLowerCase()}${sep}${m[1].toLowerCase()}`
  );

// Converts snake case or camel case to better human form
// Strips underscore and separate words
// e.g snake_case => Snake case
// camelCase => Camel case
export const humanizeString = (str: string) => {
  let snakeCase = decamelize(str);
  snakeCase = snakeCase.replace("_", " ");
  return snakeCase[0].toUpperCase() + snakeCase.slice(1);
};

// Check response has json content
export const isJSON = (res: Response) =>
  res.headers.get("Content-Type")?.includes("application/json") || false;
