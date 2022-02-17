CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
DROP TABLE IF EXISTS task;
DROP TABLE IF EXISTS "list";
DROP TABLE IF EXISTS "user";

CREATE TABLE "user" (
	id 				    TEXT 		    NOT NULL,
	created_at 		TIMESTAMP 	NOT NULL 	DEFAULT timezone('utc', now()),
	PRIMARY KEY (id)
);

CREATE TABLE "list" (
	"user"			  TEXT		    NOT NULL,
	"uuid"			  UUID		    NOT NULL	DEFAULT uuid_generate_v4(),
	"name"			  TEXT		    NOT NULL,
	created_at		TIMESTAMP	  NOT NULL	DEFAULT timezone('utc', now()),
	PRIMARY KEY ("uuid"),
	FOREIGN KEY ("user")
		REFERENCES "user"(id) ON DELETE CASCADE
);

CREATE TABLE task (
	list			    UUID		    NOT NULL,
	"uuid"			  UUID		    NOT NULL	DEFAULT uuid_generate_v4(),
	"name"			  TEXT		    NOT NULL,
	complete		  BOOLEAN		  NOT NULL 	DEFAULT false,
	created_at		TIMESTAMP	  NOT NULL	DEFAULT timezone('utc', now()),
	PRIMARY KEY ("uuid"),
	FOREIGN KEY (list)
		REFERENCES list("uuid") ON DELETE CASCADE
);

