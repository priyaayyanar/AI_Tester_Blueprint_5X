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

## Chapter 01: LLM Basics

The [Chapter_01_LLM_Basics](./Chapter_01_LLM_Basics) folder covers how large language models work, in plain language.

- [LLM Fundamentals from Scratch](./Chapter_01_LLM_Basics/LLM_Fundamentals.html) — a self-contained HTML guide with 13 short lessons, hand-drawn diagrams, 9 interactive labs, quick checks, and a 97-term AI glossary.

## Chapter 02: Prompt Engineering

The [Chapter_02_Prompt_Engineering](./Chapter_02_Prompt_Engineering) folder covers prompt-engineering techniques for testing.

- [Anti-Hallucination Rules](./Chapter_02_Prompt_Engineering/anti-hallucination.rules.md) — strict verification rules for a QA assistant (no invented features, every assertion traceable, deterministic output).
- [RICE_POT](./Chapter_02_Prompt_Engineering/RICE_POT) — the Role, Instructions, Context, Example, Parameters, Output, Tone prompt framework:
  - [Real prompt example](./Chapter_02_Prompt_Engineering/RICE_POT/RealPrompt_RICE_POT.md) — RICE_POT applied to a Salesforce login-automation brief.
  - [Template](./Chapter_02_Prompt_Engineering/RICE_POT/Template_RICE_POT/Template.RICEPOT.md) — the reusable RICE_POT template.
  - [Selenium framework](./Chapter_02_Prompt_Engineering/RICE_POT/Selenium_Framework) — a Maven + TestNG + PageFactory + Allure project automating the Salesforce login page (valid and invalid cases).

## Resources

- [Chapter_00_SKILL_Basics/resources](./Chapter_00_SKILL_Basics/resources) — sample Jira ticket export (`VWO-49.doc`)
