import ExcelJS from 'exceljs';
import { Warning, Store, Enseigne } from '@/types';

const IMAGE_WIDTH = 160;
const IMAGE_HEIGHT = 110;

function getExtension(contentType: string): 'jpeg' | 'png' | 'gif' {
  if (contentType.includes('png')) return 'png';
  if (contentType.includes('gif')) return 'gif';
  return 'jpeg';
}

async function fetchImageBuffer(url: string): Promise<{ buffer: ArrayBuffer; extension: 'jpeg' | 'png' | 'gif' } | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const contentType = res.headers.get('content-type') || '';
    const buffer = await res.arrayBuffer();
    return { buffer, extension: getExtension(contentType) };
  } catch {
    return null;
  }
}

export async function exportWarningsToExcel(
  warnings: Warning[],
  store: Store,
  enseigneName: string
): Promise<void> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Warning Tracker';
  workbook.created = new Date();

  const ws = workbook.addWorksheet('Avertissements');

  // --- Title row ---
  ws.mergeCells('A1:F1');
  const titleCell = ws.getCell('A1');
  titleCell.value = `Avertissements — ${store.name} (${enseigneName})`;
  titleCell.font = { bold: true, size: 14, color: { argb: 'FFFFFF' } };
  titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1E3A5F' } };
  titleCell.alignment = { vertical: 'middle', horizontal: 'center' };
  ws.getRow(1).height = 28;

  // --- Header row ---
  const headers = ['N°', 'Type', 'Date', 'Commentaire', 'Créé par', 'Images'];
  const headerRow = ws.getRow(2);
  headers.forEach((h, i) => {
    const cell = headerRow.getCell(i + 1);
    cell.value = h;
    cell.font = { bold: true, color: { argb: 'FFFFFF' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '2E6DA4' } };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
    cell.border = {
      bottom: { style: 'thin', color: { argb: 'FFFFFF' } },
    };
  });
  headerRow.height = 22;

  // --- Column widths ---
  ws.getColumn(1).width = 5;   // N°
  ws.getColumn(2).width = 14;  // Type
  ws.getColumn(3).width = 14;  // Date
  ws.getColumn(4).width = 42;  // Commentaire
  ws.getColumn(5).width = 20;  // Créé par

  // Find max number of images across all warnings
  let maxImages = 0;
  for (const w of warnings) {
    const count = w.imageUrls?.length || (w.imageUrl ? 1 : 0);
    if (count > maxImages) maxImages = count;
  }

  // Set image column widths (columns 6, 7, 8 … up to maxImages)
  const colWidthPixels = IMAGE_WIDTH + 10;
  for (let c = 0; c < maxImages; c++) {
    ws.getColumn(6 + c).width = colWidthPixels / 7; // approx px → Excel units
    // Update header for each image column
    const cell = headerRow.getCell(6 + c);
    cell.value = maxImages === 1 ? 'Image' : `Image ${c + 1}`;
    cell.font = { bold: true, color: { argb: 'FFFFFF' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '2E6DA4' } };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
  }
  // If no images, keep default column F header as "Images"
  if (maxImages === 0) {
    ws.getColumn(6).width = 20;
  }

  // --- Data rows (starting at row 3, 0-based index 2) ---
  for (let i = 0; i < warnings.length; i++) {
    const warning = warnings[i];
    const excelRow = 3 + i;        // 1-based row number
    const rowIndex = excelRow - 1; // 0-based for image positioning

    const imageUrls = warning.imageUrls?.length
      ? warning.imageUrls
      : warning.imageUrl
      ? [warning.imageUrl]
      : [];

    const rowHeight = imageUrls.length > 0 ? IMAGE_HEIGHT + 8 : 22;
    const row = ws.getRow(excelRow);
    row.height = rowHeight;

    // N°
    const numCell = row.getCell(1);
    numCell.value = i + 1;
    numCell.alignment = { vertical: 'middle', horizontal: 'center' };

    // Type
    const typeCell = row.getCell(2);
    if (warning.type === 'yellow') {
      typeCell.value = 'Carte Jaune';
      typeCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF3CD' } };
      typeCell.font = { color: { argb: '856404' }, bold: true };
    } else {
      typeCell.value = 'Carte Rouge';
      typeCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FDECEA' } };
      typeCell.font = { color: { argb: 'C0392B' }, bold: true };
    }
    typeCell.alignment = { vertical: 'middle', horizontal: 'center' };

    // Date
    const dateCell = row.getCell(3);
    dateCell.value = new Date(warning.createdAt).toLocaleDateString('fr-FR');
    dateCell.alignment = { vertical: 'middle', horizontal: 'center' };

    // Comment
    const commentCell = row.getCell(4);
    commentCell.value = warning.comment;
    commentCell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };

    // Created by
    const byCell = row.getCell(5);
    byCell.value = warning.createdBy;
    byCell.alignment = { vertical: 'middle', horizontal: 'center' };

    // Alternating row background for non-image cells
    const bgColor = i % 2 === 0 ? 'F8F9FA' : 'FFFFFF';
    [numCell, dateCell, commentCell, byCell].forEach(cell => {
      if (!cell.fill || (cell.fill as ExcelJS.FillPattern).fgColor?.argb === undefined) {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bgColor } };
      }
    });

    // Border for all data cells
    for (let c = 1; c <= Math.max(5, 5 + imageUrls.length); c++) {
      const cell = row.getCell(c);
      cell.border = {
        top: { style: 'thin', color: { argb: 'DEE2E6' } },
        bottom: { style: 'thin', color: { argb: 'DEE2E6' } },
        left: { style: 'thin', color: { argb: 'DEE2E6' } },
        right: { style: 'thin', color: { argb: 'DEE2E6' } },
      };
    }

    // Embed images
    for (let j = 0; j < imageUrls.length; j++) {
      const result = await fetchImageBuffer(imageUrls[j]);
      if (!result) continue;

      const imageId = workbook.addImage({
        buffer: result.buffer,
        extension: result.extension,
      });

      const col = 5 + j; // 0-based: column 5 = F (6th column)
      ws.addImage(imageId, {
        tl: { col: col + 0.1, row: rowIndex + 0.1 } as ExcelJS.Anchor,
        ext: { width: IMAGE_WIDTH, height: IMAGE_HEIGHT },
        editAs: 'oneCell',
      });
    }

    // If no images, show placeholder text in column F
    if (imageUrls.length === 0) {
      const imgCell = row.getCell(6);
      imgCell.value = '—';
      imgCell.alignment = { vertical: 'middle', horizontal: 'center' };
      imgCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bgColor } };
    }

    row.commit();
  }

  // Freeze title + header rows
  ws.views = [{ state: 'frozen', xSplit: 0, ySplit: 2 }];

  // --- Generate and trigger download ---
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const date = new Date().toISOString().split('T')[0];
  a.download = `avertissements_${store.name.replace(/\s+/g, '_')}_${date}.xlsx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function exportAllWarningsToExcel(
  warnings: Warning[],
  stores: Store[],
  enseignes: Enseigne[]
): Promise<void> {
  const storeMap = new Map(stores.map(s => [s.id, s]));
  const enseigneMap = new Map(enseignes.map(e => [e.id, e]));

  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Warning Tracker';
  workbook.created = new Date();

  const ws = workbook.addWorksheet('Tous les Avertissements');

  // --- Title row ---
  ws.mergeCells('A1:H1');
  const titleCell = ws.getCell('A1');
  const exportDate = new Date().toLocaleDateString('fr-FR');
  titleCell.value = `Rapport Avertissements — Exporté le ${exportDate}`;
  titleCell.font = { bold: true, size: 14, color: { argb: 'FFFFFF' } };
  titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1E3A5F' } };
  titleCell.alignment = { vertical: 'middle', horizontal: 'center' };
  ws.getRow(1).height = 28;

  // --- Header row ---
  const headers = ['N°', 'Enseigne', 'Magasin', 'Type', 'Date', 'Commentaire', 'Créé par', 'Images'];
  const headerRow = ws.getRow(2);
  headers.forEach((h, i) => {
    const cell = headerRow.getCell(i + 1);
    cell.value = h;
    cell.font = { bold: true, color: { argb: 'FFFFFF' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '2E6DA4' } };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
  });
  headerRow.height = 22;

  // --- Column widths ---
  ws.getColumn(1).width = 5;   // N°
  ws.getColumn(2).width = 18;  // Enseigne
  ws.getColumn(3).width = 22;  // Magasin
  ws.getColumn(4).width = 14;  // Type
  ws.getColumn(5).width = 14;  // Date
  ws.getColumn(6).width = 40;  // Commentaire
  ws.getColumn(7).width = 20;  // Créé par

  // Find max images
  let maxImages = 0;
  for (const w of warnings) {
    const count = w.imageUrls?.length || (w.imageUrl ? 1 : 0);
    if (count > maxImages) maxImages = count;
  }

  const colWidthPixels = IMAGE_WIDTH + 10;
  for (let c = 0; c < maxImages; c++) {
    ws.getColumn(8 + c).width = colWidthPixels / 7;
    const cell = headerRow.getCell(8 + c);
    cell.value = maxImages === 1 ? 'Image' : `Image ${c + 1}`;
    cell.font = { bold: true, color: { argb: 'FFFFFF' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '2E6DA4' } };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
  }
  if (maxImages === 0) ws.getColumn(8).width = 20;

  // --- Data rows ---
  for (let i = 0; i < warnings.length; i++) {
    const warning = warnings[i];
    const excelRow = 3 + i;
    const rowIndex = excelRow - 1; // 0-based

    const store = storeMap.get(warning.storeId);
    const enseigne = store ? enseigneMap.get(store.enseigneId) : undefined;

    const imageUrls = warning.imageUrls?.length
      ? warning.imageUrls
      : warning.imageUrl
      ? [warning.imageUrl]
      : [];

    const rowHeight = imageUrls.length > 0 ? IMAGE_HEIGHT + 8 : 22;
    const row = ws.getRow(excelRow);
    row.height = rowHeight;

    const bgColor = i % 2 === 0 ? 'F8F9FA' : 'FFFFFF';

    // N°
    row.getCell(1).value = i + 1;
    row.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };

    // Enseigne
    row.getCell(2).value = enseigne?.name || '—';
    row.getCell(2).alignment = { vertical: 'middle', horizontal: 'left' };

    // Magasin
    row.getCell(3).value = store?.name || '—';
    row.getCell(3).alignment = { vertical: 'middle', horizontal: 'left' };

    // Type
    const typeCell = row.getCell(4);
    if (warning.type === 'yellow') {
      typeCell.value = 'Carte Jaune';
      typeCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF3CD' } };
      typeCell.font = { color: { argb: '856404' }, bold: true };
    } else {
      typeCell.value = 'Carte Rouge';
      typeCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FDECEA' } };
      typeCell.font = { color: { argb: 'C0392B' }, bold: true };
    }
    typeCell.alignment = { vertical: 'middle', horizontal: 'center' };

    // Date
    row.getCell(5).value = new Date(warning.createdAt).toLocaleDateString('fr-FR');
    row.getCell(5).alignment = { vertical: 'middle', horizontal: 'center' };

    // Comment
    row.getCell(6).value = warning.comment;
    row.getCell(6).alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };

    // Created by
    row.getCell(7).value = warning.createdBy;
    row.getCell(7).alignment = { vertical: 'middle', horizontal: 'center' };

    // Apply alternating background to non-colored cells
    [1, 2, 3, 5, 6, 7].forEach(col => {
      const cell = row.getCell(col);
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bgColor } };
    });

    // Borders
    for (let c = 1; c <= Math.max(7, 7 + imageUrls.length); c++) {
      row.getCell(c).border = {
        top: { style: 'thin', color: { argb: 'DEE2E6' } },
        bottom: { style: 'thin', color: { argb: 'DEE2E6' } },
        left: { style: 'thin', color: { argb: 'DEE2E6' } },
        right: { style: 'thin', color: { argb: 'DEE2E6' } },
      };
    }

    // Embed images (starting at column H = index 7)
    for (let j = 0; j < imageUrls.length; j++) {
      const result = await fetchImageBuffer(imageUrls[j]);
      if (!result) continue;

      const imageId = workbook.addImage({
        buffer: result.buffer,
        extension: result.extension,
      });

      const col = 7 + j; // 0-based: column 7 = H
      ws.addImage(imageId, {
        tl: { col: col + 0.1, row: rowIndex + 0.1 } as ExcelJS.Anchor,
        ext: { width: IMAGE_WIDTH, height: IMAGE_HEIGHT },
        editAs: 'oneCell',
      });
    }

    if (imageUrls.length === 0) {
      const imgCell = row.getCell(8);
      imgCell.value = '—';
      imgCell.alignment = { vertical: 'middle', horizontal: 'center' };
      imgCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bgColor } };
    }

    row.commit();
  }

  ws.views = [{ state: 'frozen', xSplit: 0, ySplit: 2 }];

  // --- Download ---
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const date = new Date().toISOString().split('T')[0];
  a.download = `rapport_avertissements_${date}.xlsx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
