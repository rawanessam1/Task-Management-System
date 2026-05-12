CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO tasks (title, description, completed) VALUES 
('Setup Database', 'Initialize the PostgreSQL database container', true),
('Build Backend API', 'Implement Express server with REST and MCP endpoints', false),
('Build Frontend UI', 'Create React Vite application with Tailwind CSS', false);
