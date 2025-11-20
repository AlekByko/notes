// JSYK:
// - dir of these files is listed in docker file at `/docker-entrypoint-initdb.d`
// - scripts get executed only if database is empty
// - scripts get executed in lexical order of their names
// - `db` variable is pre-set already

db.createCollection("workspaces");
db.createCollection("notes");
