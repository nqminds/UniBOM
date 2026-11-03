-- Index for prefix searches on cve.cpe_id.
--
-- getCVEsByCPE and getCPEVersions filter with `cpe_id LIKE 'prefix%'`. With a
-- non-C collation (e.g. en_GB.UTF-8) the primary key btree cannot serve LIKE,
-- so every lookup falls back to a sequential scan of the whole cve table.
-- text_pattern_ops compares character by character, which lets the planner use
-- the index for prefix matches.
--
-- CONCURRENTLY keeps the table readable and writable during the build. It
-- cannot run inside a transaction block, so run this file with plain psql:
--   psql -h <host> -U <user> -d cve_database -f 001_cve_cpe_id_pattern_index.sql
--
-- If the build is interrupted it leaves an INVALID index; drop it and rerun:
--   DROP INDEX CONCURRENTLY IF EXISTS cve_cpe_id_pattern_idx;

SET maintenance_work_mem = '1GB';

CREATE INDEX CONCURRENTLY IF NOT EXISTS cve_cpe_id_pattern_idx
  ON cve (cpe_id text_pattern_ops);

ANALYZE cve;
