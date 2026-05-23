CREATE TABLE IF NOT EXISTS modules (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  prerequisites TEXT,
  icon VARCHAR(64) DEFAULT 'book',
  image_url LONGTEXT,
  background_color CHAR(7) DEFAULT '#EAF2FF',
  order_index INT DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS lessons (
  id INT AUTO_INCREMENT PRIMARY KEY,
  module_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  content LONGTEXT,
  read_time INT DEFAULT 5,
  lesson_order INT DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE,
  INDEX idx_module_order (module_id, lesson_order)
);

CREATE TABLE IF NOT EXISTS app_content (
  id INT PRIMARY KEY,
  welcome_title VARCHAR(255) NOT NULL,
  welcome_description TEXT NOT NULL,
  motivation_text TEXT NOT NULL,
  motivation_quote TEXT NOT NULL,
  welcome_subtitle TEXT,
  welcome_footer TEXT,
  app_description TEXT,
  terms_url VARCHAR(500),
  privacy_url VARCHAR(500),
  featured_module_id INT,
  premium_title VARCHAR(255),
  premium_description TEXT,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  icon VARCHAR(64) DEFAULT 'book',
  color CHAR(7) DEFAULT '#F26A4A',
  order_index INT DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS category_modules (
  category_id INT NOT NULL,
  module_id INT NOT NULL,
  PRIMARY KEY (category_id, module_id),
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
  FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(120),
  bio VARCHAR(300),
  password_hash VARCHAR(255),
  github_id VARCHAR(64) UNIQUE,
  email_verified TINYINT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS legal_content (
  `key` VARCHAR(40) PRIMARY KEY,
  body TEXT,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS otp_codes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  code VARCHAR(6) NOT NULL,
  purpose VARCHAR(20) NOT NULL,
  expires_at DATETIME NOT NULL,
  consumed TINYINT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_email_purpose (email, purpose, consumed)
);

CREATE TABLE IF NOT EXISTS problem_reports (
  id INT AUTO_INCREMENT PRIMARY KEY,
  message TEXT,
  category VARCHAR(40),
  app_version VARCHAR(40),
  platform VARCHAR(40),
  user_email VARCHAR(190),
  status VARCHAR(20) DEFAULT 'new',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS admin_users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(80) UNIQUE,
  password_hash VARCHAR(255),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Expo push tokens, one row per device (token is unique so re-registration
-- updates the existing row rather than duplicating it).
CREATE TABLE IF NOT EXISTS device_tokens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  token VARCHAR(255) UNIQUE,
  platform VARCHAR(20),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Broadcast notifications composed in the admin panel; also the source for
-- the app's in-app bell list.
CREATE TABLE IF NOT EXISTS notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255),
  body TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
