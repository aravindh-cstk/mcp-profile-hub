# get_job_data returns "200 Job active" for an Analytics job

**Applies to:** Contentstack MCP Server

**Root cause**

The Analytics job is still processing. Every Analytics tool runs asynchronously: it returns a `jobId`, and `get_job_data` returns the results only after the job completes.

**Resolution**

Wait a few seconds, then call `get_job_data` again with the same `jobId`.
