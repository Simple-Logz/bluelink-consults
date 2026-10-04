export const STAFF_DOMAIN = 'bluelinkconsults.com';
export const isStaffEmail = email => /^[^@\s]+@bluelinkconsults\.com$/i.test(String(email || '').trim());
export function validateScope(client) {
  const errors = {};
  for (const [key, label] of [['company','Organisation name'],['contact','Prepared for'],['scenario','Scenario name'],['scope','Assessment scope']]) {
    if (!String(client[key] || '').trim()) errors['scope.' + key] = label + ' is required.';
  }
  return errors;
}
