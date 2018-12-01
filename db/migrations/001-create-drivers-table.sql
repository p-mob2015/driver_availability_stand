-- Up
CREATE TABLE IF NOT EXISTS Drivers (
  id    BIGINT          PRIMARY KEY,
  name  VARCHAR(100),
  phone CHAR(12),
  plate VARCHAR(30)
);

-- Down
DROP TABLE Driver;
