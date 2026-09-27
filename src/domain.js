// 读取并检查项目共享的领域资料。
const REQUIRED_LISTS = ['actors', 'content_types', 'facts', 'workflow', 'change_events', 'constraints'];

export function parseDomain(raw) {
  const value = JSON.parse(raw);
  if (!value.domain || !value.version || !value.sample_id) {
    throw new Error('共享资料缺少必要字段');
  }
  for (const key of REQUIRED_LISTS) {
    if (!Array.isArray(value[key]) || value[key].length < 2) {
      throw new Error('共享资料缺少必要字段');
    }
  }
  return value;
}
