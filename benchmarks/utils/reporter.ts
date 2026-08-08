/**
 * Prints a Markdown table to the console.
 */
export function printTable(title: string, headers: string[], data: Record<string, any>[]) {
  console.log(`${title}`);
  console.log('-'.repeat(title.length));

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

  console.log(headerLine);
  console.log(sepLine);

  data.forEach(row => {
    const rowLine = `| ${headers.map((h, i) => String(row[h] || '').padEnd(colWidths[i])).join(' | ')} |`;
    console.log(rowLine);
  });
}
