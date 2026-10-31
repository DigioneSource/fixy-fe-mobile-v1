/**
 * Tên hiển thị cho danh mục dịch vụ.
 *
 * Backend có thể trả về tên danh mục cũ chứa chữ "Massage". Theo định vị
 * "chăm sóc phục hồi tại nhà", app gọi dịch vụ theo vùng chăm sóc và mục đích.
 * Chỉ dùng cho CHỮ HIỂN THỊ — không dùng để so sánh với dữ liệu backend.
 */

const normalize = (value: string) => value.trim().toLowerCase().replace(/\s+/g, ' ');

// Bảng map tên phổ biến (khoá đã chuẩn hoá: chữ thường, một khoảng trắng).
const CATEGORY_NAME_MAP: Record<string, string> = {
  massage: 'Chăm sóc thư giãn',
  'massage body': 'Chăm sóc toàn thân thư giãn',
  'massage toàn thân': 'Chăm sóc toàn thân thư giãn',
  'massage thư giãn': 'Chăm sóc toàn thân thư giãn',
  'massage trị liệu': 'Chăm sóc giảm mỏi',
  'massage trị liệu thư giãn': 'Chăm sóc giảm mỏi',
  'massage cổ vai gáy': 'Chăm sóc vai gáy',
  'massage vai gáy': 'Chăm sóc vai gáy',
  'massage lưng': 'Chăm sóc lưng',
  'massage chân': 'Chăm sóc chân',
  'massage foot': 'Chăm sóc chân',
  'foot massage': 'Chăm sóc chân',
  'massage mặt': 'Chăm sóc da mặt',
  'massage đầu': 'Gội đầu dưỡng sinh',
};

const SENSITIVE_WORD = /m[aá]t[\s-]?xa|massage|xoa b[oó]p/i;
const SENSITIVE_WORD_ALL = new RegExp(SENSITIVE_WORD.source, 'gi');

export function displayCategoryName(name?: string | null): string {
  if (!name) return '';
  const mapped = CATEGORY_NAME_MAP[normalize(name)];
  if (mapped) return mapped;
  if (!SENSITIVE_WORD.test(name)) return name;
  const replaced = name.replace(SENSITIVE_WORD_ALL, 'chăm sóc').replace(/chăm sóc\s+chăm sóc/gi, 'chăm sóc')
    .replace(/\s+/g, ' ')
    .trim();
  return replaced.charAt(0).toUpperCase() + replaced.slice(1);
}
