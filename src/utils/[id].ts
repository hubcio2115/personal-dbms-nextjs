export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function splitCamelCaseAndCapitalize(str: string) {
  const split = str.replace(/([a-z])([A-Z])/g, '$1 $2').split(' ');

  if (!!split[1]) return `${capitalize(split[0] ?? '')} ${split[1]}`;
  if (!!split[0]) return capitalize(split[0] ?? '');

  return str;
}
