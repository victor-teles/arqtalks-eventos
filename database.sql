create table
  employee (
    id bigint primary key generated always as identity,
    name text not null,
    slug text not null,
    ticketColor text not null default('#252729')
  );

CREATE unique INDEX IF NOT EXISTS "slug_unique" ON "employee" ("slug");

create table
  metrics (
    version bigint primary key generated always as identity,
    users numeric not null default(0),
    colorChanges numeric not null default(0),
    happy numeric not null default(0)
  );

  create table
  poison_director (
    name text,
    count int
  );


INSERT INTO poison_director values('usuario.criado', 0);
INSERT INTO poison_director values('usuario.cor-ticket-alterada', 0);
INSERT INTO poison_director values('usuario.ficou-feliz', 0);

CREATE OR REPLACE FUNCTION poison_count(event_name text)
  RETURNS TABLE (poison_count int)
  LANGUAGE plpgsql AS
$func$
BEGIN
   RETURN QUERY
    SELECT
        count
    FROM
        poison_director
    WHERE
        name = event_name;
END
$func$;

CREATE OR REPLACE FUNCTION poison(event_name text)
  RETURNS TABLE (poison_count int)
  LANGUAGE plpgsql AS
$func$
BEGIN
   UPDATE poison_director
    SET count = count + 1
    WHERE name = event_name;

    RETURN QUERY SELECT public.poison_count(event_name);
END
$func$;
