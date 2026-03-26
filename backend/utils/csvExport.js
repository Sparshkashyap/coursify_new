export const toCSV = (rows = []) => {
  if (!rows.length) return "";

  const headers = Object.keys(rows[0]);

  const escapeValue = (value) => {
    const str = String(value ?? "");
    if (str.includes(",") || str.includes('"') || str.includes("\n")) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const csv = [
    headers.join(","),
    ...rows.map((row) => headers.map((header) => escapeValue(row[header])).join(",")),
  ].join("\n");

  return csv;
};