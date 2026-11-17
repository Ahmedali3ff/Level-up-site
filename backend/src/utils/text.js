// Removes ASCII control characters except tab and newline.
export function removeControl(value) {
  return [...value]
    .filter((ch) => {
      const code = ch.charCodeAt(0);
      return code >= 32 || code === 9 || code === 10;
    })
    .join('');
}

export const stripTags = (value) => value.replace(/<[^>]*>/g, '');

export const clean = (value) => removeControl(value).trim();

// Escapes LIKE wildcards; use with: ILIKE '%' || $1 || '%' ESCAPE '!'
export const escapeLike = (value) => value.split('!').join('!!').split('%').join('!%').split('_').join('!_');

export function slugify(value) {
  let out = '';
  for (const ch of value.toLowerCase()) {
    if ((ch >= 'a' && ch <= 'z') || (ch >= '0' && ch <= '9')) out += ch;
    else if (out && !out.endsWith('-')) out += '-';
  }
  return out.replace(/-+$/, '').slice(0, 100);
}
