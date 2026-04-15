
PRECISION_PROMPT = """
You are evaluating whether a past journal entry is useful for generating
a personal progress report for a behavioral change journal app.

Current period summary:
\"\"\"{current_summary}\"\"\"

Retrieved past entry:
\"\"\"{chunk_text}\"\"\"

Task: Rate how useful this past entry is for enriching the progress report.
A useful entry enables meaningful comparison with the past — it contains
a similar task, goal, or situation that shows growth, regression, or pattern.

Scoring:
  0 = not useful: unrelated goal, too vague, or adds no comparison value
  1 = partially useful: related context but weak or indirect comparison value
  2 = useful: directly comparable situation or achievement, clear value for report

Respond with JSON: {{"score": 0, 1, or 2}}

Only output the JSON, nothing else.
"""
