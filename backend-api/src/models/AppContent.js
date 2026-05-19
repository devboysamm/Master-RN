const pool = require('../config/db');

const SELECT_COLS = [
  'id',
  'welcome_title',
  'welcome_description',
  'motivation_text',
  'motivation_quote',
  'welcome_subtitle',
  'welcome_footer',
  'app_description',
  'terms_url',
  'privacy_url',
  'featured_module_id',
  'premium_title',
  'premium_description',
  'support_email',
  'contact_url',
  'help_content',
  'updated_at',
].join(', ');

async function get() {
  const [rows] = await pool.query(
    `SELECT ${SELECT_COLS} FROM app_content WHERE id = 1 LIMIT 1`
  );
  return rows[0] || null;
}

async function upsert(data) {
  const {
    welcome_title,
    welcome_description,
    motivation_text,
    motivation_quote,
    welcome_subtitle = null,
    welcome_footer = null,
    app_description = null,
    terms_url = null,
    privacy_url = null,
    featured_module_id = null,
    premium_title = null,
    premium_description = null,
    support_email = null,
    contact_url = null,
    help_content = null,
  } = data;
  await pool.query(
    `INSERT INTO app_content (
       id, welcome_title, welcome_description, motivation_text, motivation_quote,
       welcome_subtitle, welcome_footer, app_description, terms_url, privacy_url,
       featured_module_id, premium_title, premium_description,
       support_email, contact_url, help_content
     )
     VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       welcome_title = VALUES(welcome_title),
       welcome_description = VALUES(welcome_description),
       motivation_text = VALUES(motivation_text),
       motivation_quote = VALUES(motivation_quote),
       welcome_subtitle = VALUES(welcome_subtitle),
       welcome_footer = VALUES(welcome_footer),
       app_description = VALUES(app_description),
       terms_url = VALUES(terms_url),
       privacy_url = VALUES(privacy_url),
       featured_module_id = VALUES(featured_module_id),
       premium_title = VALUES(premium_title),
       premium_description = VALUES(premium_description),
       support_email = VALUES(support_email),
       contact_url = VALUES(contact_url),
       help_content = VALUES(help_content)`,
    [
      welcome_title,
      welcome_description,
      motivation_text,
      motivation_quote,
      welcome_subtitle,
      welcome_footer,
      app_description,
      terms_url,
      privacy_url,
      featured_module_id,
      premium_title,
      premium_description,
      support_email,
      contact_url,
      help_content,
    ]
  );
  return get();
}

module.exports = { get, upsert };
