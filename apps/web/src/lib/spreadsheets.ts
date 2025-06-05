import z from 'zod';

const spreadsheetRowsSchema = z
  .object({
    c: z.array(z.any().nullable()),
  })
  .array();

export const fetchSpreadsheets = async (
  spreadsheetId: string,
  sheetName: string
) => {
  const url = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:json&sheet=${sheetName}`;
  const res = await fetch(url, { next: { revalidate: 3600 } }); // Cache for 1 hour
  let text = await res.text();

  text = text.replace('/*O_o*/\ngoogle.visualization.Query.setResponse(', '');
  text = text.slice(0, -2);

  const json = JSON.parse(text);
  const data = spreadsheetRowsSchema.parse(json.table.rows);

  return data;
};

export const parseDate = (dateString: string | null): Date | null => {
  if (!dateString) return null;

  const match = dateString.match(/Date\((\d+),(\d+),(\d+)\)/);
  if (!match) return null;

  return new Date(Number(match[1]), Number(match[2]), Number(match[3]));
};
