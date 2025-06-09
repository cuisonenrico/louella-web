interface FileInfo {
  branch: string;
  year: string;
  month: string;
  filename: string;
}

export function parseFileName(filename: string): FileInfo | null {
  try {
    // Split by underscore first to handle complex branch names
    const parts = filename.split('_');
    if (parts.length < 4) return null;

    // Get branch name from first part
    const branch = parts[0]
      .replace(/([a-z])([A-Z])/g, '$1 $2') // Add space between camelCase
      .replace(/&/g, ' & ') // Add spaces around &
      .replace(/([a-zA-Z])([0-9])/g, '$1 $2'); // Add space between letters and numbers

    // Parse date parts - format: Month##YYYY
    const dateMatch = parts[2].match(/([A-Za-z]+)(\d{2})(\d{4})/i);
    if (!dateMatch) return null;

    const [_, month, __, year] = dateMatch;

    return {
      branch: branch.trim(),
      year,
      month: month.charAt(0).toUpperCase() + month.slice(1).toLowerCase(), // Capitalize month
      filename
    };
  } catch (error) {
    console.error('Error parsing filename:', error);
    return null;
  }
}

export function groupFilesByDate(files: { id: string; filename: string }[]) {
  const grouped = new Map<string, Map<string, Map<string, Array<{ id: string; filename: string }>>>>();
  
  files.forEach(file => {
    const info = parseFileName(file.filename);
    if (!info) return;
    
    // Year level
    if (!grouped.has(info.year)) {
      grouped.set(info.year, new Map());
    }
    const yearGroup = grouped.get(info.year)!;
    
    // Month level
    if (!yearGroup.has(info.month)) {
      yearGroup.set(info.month, new Map());
    }
    const monthGroup = yearGroup.get(info.month)!;
    
    // Branch level
    if (!monthGroup.has(info.branch)) {
      monthGroup.set(info.branch, []);
    }
    monthGroup.get(info.branch)!.push(file);
  });
  
  return grouped;
}