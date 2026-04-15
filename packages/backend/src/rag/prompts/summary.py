SUMMARY_TEMPLATE = """
You are summarizing {period_type} reports to extract key themes 
and achievements for semantic search against historical entries.

Focus on:
- Main goals and their progress trajectory
- Specific achievements worth comparing to past periods
- Recurring patterns or challenges

Keep it dense and specific — avoid generic phrases.
Target length: {target_length}.

Reports to summarize:
{reports}

{additional_entries_block}

Generate the summary in {language}.
"""

SUMMARY_LENGTH = {
    "month": "150-200 words",
    "year": "400-500 words"
}
