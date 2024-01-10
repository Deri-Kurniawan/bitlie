const data = [
  ["github", "https://github.com/deri-kurniawan"],
  ["instagram", "https://instagram.com/deri561/"],
  ["stackoverflow", "https://stackoverflow.com/users/19716588/deri-kurniawan"],
  ["linkedin", "https://linkedin.com/in/deri-kurniawan/"],
  ["devto", "https://dev.to/deri_kurniawan"],
  ["uiverse", "https://uiverse.io/profile/Deri-Kurniawan"],
  ["dribbble", "https://dribbble.com/deri-kurniawan"],
  ["buymeacoffee", "https://www.buymeacoffee.com/derikurniawan"],
  ["ko-fi", "https://ko-fi.com/derikurniawan"],
  ["portfolio", "https://deri.my.id/"],
].map((item) => ({
  alias: item[0],
  targetUrl: item[1],
}));

/**
 * Check for duplicate alias in data
 */
const aliases = data.map((item) => item.alias);
const uniqueAliases = new Set(aliases);
if (aliases.length !== uniqueAliases.size) {
  throw new Error(
    `Duplicate id found in data for: ${JSON.stringify(
      aliases.filter(
        (alias) => aliases.indexOf(alias) !== aliases.lastIndexOf(alias)
      )[0]
    )}`
  );
}

module.exports = {
  data,
};
