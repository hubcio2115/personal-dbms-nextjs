export const capitalize = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1);

export const splitCamelCaseAndCapitalize = (str: string) => {
  const split = str.replace(/([a-z])([A-Z])/g, '$1 $2').split(' ');

  if (split.length === 1) return capitalize(split[0] ?? '');
  if (split.length === 2) return `${capitalize(split[0] ?? '')} ${split[1]}`;

  return str;
};
