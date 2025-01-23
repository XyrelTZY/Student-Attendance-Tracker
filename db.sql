CREATE TABLE student (
  student_id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  fname VARCHAR(500) NOT NULL,
  birth_date DATE NOT NULL,
  section VARCHAR(500) NOT NULL,
  track VARCHAR(500) NOT NULL,
  phone_number VARCHAR(20) NOT NULL
);

CREATE TABLE report (
  report_id SERIAL PRIMARY KEY,
  student_id INTEGER NOT NULL,
);

CREATE TABLE status (
  status_id SERIAL PRIMARY KEY,
  present VARCHAR(500) NOT NULL,
  absent VARCHAR(500) NOT NULL
);

CREATE TABLE attendance (
  attendance_id SERIAL PRIMARY KEY,
  student_id INTEGER NOT NULL,
  status_id INTEGER NOT NULL,
  date DATE NOT NULL,
  late BOOLEAN NOT NULL
);

CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP
);

CREATE TABLE roles (
  role_id SERIAL PRIMARY KEY,
  role_name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE user_roles (
  user_id INTEGER NOT NULL,
  role_id INTEGER NOT NULL,
  PRIMARY KEY (user_id, role_id)
);

CREATE TABLE classes (
  class_id SERIAL PRIMARY KEY,
  class_name VARCHAR(255) NOT NULL,
  description TEXT,
  teacher_id INTEGER NOT NULL
);

CREATE TABLE student_classes (
  student_id INTEGER NOT NULL,
  class_id INTEGER NOT NULL,
  PRIMARY KEY (student_id, class_id)
);

ALTER TABLE student ADD FOREIGN KEY (user_id) REFERENCES users (user_id);
ALTER TABLE report ADD FOREIGN KEY (student_id) REFERENCES student (student_id);
ALTER TABLE attendance ADD FOREIGN KEY (student_id) REFERENCES student (student_id);
ALTER TABLE attendance ADD FOREIGN KEY (status_id) REFERENCES status (status_id);
ALTER TABLE user_roles ADD FOREIGN KEY (user_id) REFERENCES users (user_id);
ALTER TABLE user_roles ADD FOREIGN KEY (role_id) REFERENCES roles (role_id);
ALTER TABLE classes ADD FOREIGN KEY (teacher_id) REFERENCES users (user_id);
ALTER TABLE student_classes ADD FOREIGN KEY (student_id) REFERENCES student (student_id);
ALTER TABLE student_classes ADD FOREIGN KEY (class_id) REFERENCES classes (class_id);