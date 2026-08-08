export function printTable(title: string, headers: string[], data: Record<string, any>[]) {
  const tableContent = `${title}\n${'-'.repeat(title.length)}\n`;

  const colWidths = headers.map(h => {
    let max = h.length;
    data.forEach(row => {
      const val = String(row[h] || '');
      if (val.length > max) max = val.length;
    });
    return max;
  });

  const headerLine = `| ${headers.map((h, i) => h.padEnd(colWidths[i])).join(' | ')} |`;
  const sepLine = `| ${colWidths.map(w => '-'.repeat(w)).join(' | ')} |`;

  let rows = '';
  data.forEach(row => {
    rows += `| ${headers.map((h, i) => String(row[h] || '').padEnd(colWidths[i])).join(' | ')} |\n`;
  });

  const fullTable = tableContent + headerLine + '\n' + sepLine + '\n' + rows;
  console.log(fullTable);
  return fullTable;
}
