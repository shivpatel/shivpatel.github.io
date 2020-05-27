---
layout: post
title:  "A brain dump on better code reviews"
date:   2020-05-19 12:00:00 -0500
categories: development
---

Here's what I've learned about improving your PRs and code reviews. This post will be updated as my process evolves.

# Before the PR

- **Talk** with fellow engineers. Implementations are **future proof** when more than one brain is involved before any code is touched.
- Each change or addition of code should be **meaningful**. If a new developer cannot decipher your intentions, you've likely made things too complicated or abstracted.
- **Add comments.** Comments should fill-in-the-blanks between lines of code; don't leave your reader with who/what/when/where/why questions. And remember what seems like an obvious choice today will confuse the hell out of you in 6 months.
- If you're reacing 100+ lines of code added/changed, you've crossed the threshold for a PR. It's impossible for others to give you detailed feedback on your work. Work with your team to **split your feature into smaller, bite-size portions** that can be introduced to the codebase.
- **Fully test your own code!** You'd be surprised how often developers overlook this. Don't waste your team's time on incomplete PRs. Test each acceptance criteria locally. If it's not possible to test locally, queue a branch build and test in an available environment.
- **Add unit tests** where you deem fit.

# Making the PR

- Can you explain everything your code change does in 5 minutes? If not, you've got too much going on. Go back and break things down.
- **Wait 24 hours before requesting reviews** on your PR. This gives you time to clear your head, re-review, and catch any obvious mistakes.

# During the code review

- **No more than 2-3 PRs** per code review session.
- Spend **up to 20 minutes per PR**. If it's taking longer than that, you need to schedule a meeting for further discussion. Trying to end a review abruply could result in the loss of valuable input from other team members that are waiting to share. 
- Let your CICD process automate linting and prettifying of your code so you can **avoid unproductive debates**.
- **Require approval from at least 2 engineers** (or 50% of the review group) before merging the PR.
- Questions to ask (yourself) as the reviewer:
    - Are you able to interpret the code without full context to the acceptance criteria? If not, the author may need to add more comments.
    - Are there any `TODO` comments? Do they need to be resolved ASAP?
    - Any opportunities for reasonable abstraction? Think about reusable business logic and utility functions.
    - Is there good seperation of concern?
    - Is there an existing framework/library you're using that can replace any custom code? This goes both ways depending on your team's desired practices.
    - Were new dependencies introduce? Are they well vetted? Are they truly needed?
    - Do the changes follow your team's architecture pattern (e.g. MVC)?
    - Will any of the changes cause backwards compatibility issues?
    - Should any unit tests be added?
    - Will this code need integration tests? Discuss with QA.
