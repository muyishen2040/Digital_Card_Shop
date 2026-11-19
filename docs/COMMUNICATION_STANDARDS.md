# Communication standards for project artifacts

## Principle

**Write for the reader of the artifact, not for the authoring conversation.** Repository documents, code comments, issues, PRs, and commit messages must remain useful to a new engineer or AI agent who has never seen the discussion that led to them.

## Required context

- **Purpose:** What problem or user need does this address? Identify the feature and its role in Digital Card Shop.
- **Decision and rationale:** What behavior or architecture is intended, and why? State assumptions and non-obvious trade-offs.
- **Scope:** What is included, intentionally excluded, or still only planned? Do not imply a placeholder is a shipped capability.
- **Evidence:** Where relevant, cite specific code paths, working URLs, tests, CI results, or reproducible steps.
- **Actionability:** A reviewer should know what to inspect, test, approve, or implement next.

Include only the sections appropriate to the artifact. A short code comment needs less context than a design specification.

## By artifact type

- **Design docs:** Describe the product scenario, recipient journey, interactions, accessibility, boundaries, and acceptance criteria. Prefer descriptive filenames for living specifications.
- **Implementation plans:** Identify actual files, dependencies, verification steps, and key edge cases. Avoid unexplained references to conversations, earlier drafts, or unspecified decisions.
- **PR descriptions:** Explain what and why, changed behavior, relevant links, testing, known limitations, and review focus. Write about the **resulting change**, not the discussion that prompted it.
- **Tickets/issues:** Explain the problem, expected outcome, acceptance criteria, dependencies, and explicit non-goals. No private background or conversational shorthand.
- **Code comments:** Explain **why** a non-obvious implementation choice exists, not that an agent changed it or that someone requested it. Keep comments accurate as code evolves.
- **Commit messages:** Name the meaningful change; do not narrate agent actions or refer to chat participants.

## Avoid

- Chat-dependent phrases: "as discussed," "you asked," "following our conversation," "based on feedback," "as mentioned earlier," or "we changed it again."
- Private reasoning, internal prompts, irrelevant experiment history, personal correspondence, or unverified assertions.
- Relative status that will become stale ("today," "latest," "currently building") without a meaningful source.
- Automatically inserted dates or date-prefixed filenames for living docs. Use dates for incident timelines, migrations, releases, meeting records, or real deadlines when chronology matters.

## Final reviewer check

Read each artifact as someone outside the chat. If a sentence requires missing context, rewrite it as a standalone statement or link a stable source. If a date or implementation-history detail has no durable value, remove it.
