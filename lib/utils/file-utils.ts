import type { PayrollFile } from "@/components/custom/payroll/PayrollFileList";

interface FileInfo {
  branch: string;
  year: string;
  month: string;
  filename: string;
}

// More flexible date pattern that handles various formats
const DATE_PATTERN = /([A-Za-z]{3,9})(\d{1,2})-?(\d{4})/i;

function normalizeBranchName(branch: string): string {
  return branch
    .trim()                           // Remove leading/trailing spaces
    .replace(/\s+/g, ' ')            // Replace multiple spaces with single space
    .replace(/\s*\(\s*/g, ' (')      // Normalize parentheses spacing
    .replace(/\s*\)\s*/g, ') ')      // Normalize parentheses spacing
    .replace(/\s*&\s*/g, ' & ')      // Normalize ampersand spacing
    .replace(/\s+$/, '')             // Remove trailing spaces again
    .toLowerCase()                    // Convert to lowercase for consistent grouping
    .replace(/^(.)/g, (match) => match.toUpperCase()); // Capitalize first letter
}

export function parseFile(file: PayrollFile): FileInfo | null {
  const filename = file.filename;
  
  // Remove file extension for cleaner parsing
  const nameWithoutExt = filename.replace(/\.[^/.]+$/, '');
  
  // Determine separator (underscore or hyphen)
  const separator = nameWithoutExt.includes('_') ? '_' : '-';
  const parts = nameWithoutExt.split(separator);
  
  if (parts.length < 3) return null;
  
  // Find date pattern (should be in last few parts)
  let dateMatch = null;
  
  // Check last 3 parts for date pattern
  for (let i = Math.max(0, parts.length - 3); i < parts.length; i++) {
    const part = parts[i];
    const match = part.match(DATE_PATTERN);
    if (match) {
      dateMatch = match;
      break;
    }
  }
  
  // If no date in individual parts, try combining last two parts
  if (!dateMatch && parts.length >= 2) {
    const lastTwo = `${parts[parts.length - 2]}-${parts[parts.length - 1]}`;
    const match = lastTwo.match(DATE_PATTERN);
    if (match) {
      dateMatch = match;
    }
  }
  
  if (!dateMatch) return null;
  
  const [, month, day, year] = dateMatch;
  
  // Use branch from file.branch and normalize it
  const rawBranch = file.branch || 'Unknown Branch';
  const branch = normalizeBranchName(rawBranch);
  
  return {
    branch,
    year,
    month: month.charAt(0).toUpperCase() + month.slice(1).toLowerCase(),
    filename
  };
}

export function groupFilesByDate(files: PayrollFile[]) {
  const grouped = new Map<string, Map<string, Map<string, PayrollFile[]>>>();
  const uniqueBranches = new Set<string>();
  
  for (const file of files) {
    const info = parseFile(file);
    if (!info) {
      console.warn(`Failed to parse file: ${file.filename}`);
      continue;
    }
    
    // Track unique branch names
    uniqueBranches.add(info.branch);
    
    // Use optional chaining and nullish coalescing for cleaner code
    const yearGroup = grouped.get(info.year) ?? grouped.set(info.year, new Map()).get(info.year)!;
    const monthGroup = yearGroup.get(info.month) ?? yearGroup.set(info.month, new Map()).get(info.month)!;
    const branchArray = monthGroup.get(info.branch) ?? monthGroup.set(info.branch, []).get(info.branch)!;
    
    branchArray.push(file);
  }
  
  // Log all unique branch names
  console.log('Unique branches:', Array.from(uniqueBranches).sort());
  
  return grouped;
}