# payload-shape-id

Give a JSON payload a stable ID based only on its structure and value types, then diff that structure later.

```sh
payload-shape-id id webhook.json --shape
payload-shape-id diff yesterday.json today.json
```

Object keys are sorted, scalar values are discarded, and arrays retain the set of distinct item shapes. That makes IDs safe to put in logs without copying customer values, while still exposing field additions, removals, type changes, and new array variants. The ID is the first 16 hex characters of SHA-256 over the canonical shape.

This is not JSON Schema validation and does not infer business rules, required fields, string formats, or numeric ranges. Existing schema-diff packages compare authored schemas; this utility fingerprints raw payload structure before a schema exists—particularly useful for webhooks, fixtures, and API samples.

The CLI returns 1 when `diff` finds changes and 2 for invalid input. It has no runtime dependencies, requires Node.js 20+, and is MIT licensed.
