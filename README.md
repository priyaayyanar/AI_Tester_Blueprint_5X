# AI Tester Blueprint 5X

This repository contains example skills and learning materials for AI-assisted software testing.

## Chapter 00: Skill Basics

The [Chapter_00_SKILL_Basics](./Chapter_00_SKILL_Basics) folder demonstrates basic and advanced testing skills.

### Basic skills (`00_basics_skills`)

- [API test case response validator](./Chapter_00_SKILL_Basics/00_basics_skills/apitestcase-response-validator-skill/SKILL.md)
- [Test case creator](./Chapter_00_SKILL_Basics/00_basics_skills/testcase-creator-skill/SKILL.md)
- [Test plan creator](./Chapter_00_SKILL_Basics/00_basics_skills/testplan-creator-skill/SKILL.md)

### Advanced skills (`01_advance-skills`)

- [Advanced test plan creator](./Chapter_00_SKILL_Basics/01_advance-skills/testplan-creator-skill/SKILL.md) — turns a Jira ticket into a review-ready test plan. It fetches the ticket over the JIRA REST API, analyzes it for gaps and ambiguities, fills the standard test plan template (scope, gaps, P0/P1/P2 scenarios, test data/environment, risks, entry/exit criteria), and always stops for human review before anything is treated as final.

  Supporting material:
  - [`references/`](./Chapter_00_SKILL_Basics/01_advance-skills/testplan-creator-skill/references) — the gap-analysis checklist and the test plan template
  - [`scripts/`](./Chapter_00_SKILL_Basics/01_advance-skills/testplan-creator-skill/scripts) — `fetch-jira.sh` to pull a ticket from JIRA
  - [`misc/`](./Chapter_00_SKILL_Basics/01_advance-skills/testplan-creator-skill/misc) — company details and logo used in the output
  - [`output/`](./Chapter_00_SKILL_Basics/01_advance-skills/testplan-creator-skill/output) — sample generated deliverable (`VWO-7` test plan PDF)

## Resources

- [Chapter_00_SKILL_Basics/resources](./Chapter_00_SKILL_Basics/resources) — sample Jira ticket export (`VWO-49.doc`)
