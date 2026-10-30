# Brad's first three articles: interview and review kit

Private editorial material. Use the current drafts and three questions per article in [the October 30 review packet](FIRST-THREE-ARTICLES-2026-10-30.md). Earlier article outlines are superseded.

## A 20-minute conversation

Ask permission before recording. Have Brad answer as if talking to one client. Preserve his exact phrases; do not invent anecdotes or identify clients.

1. Acreage: what he asks first, the assumption he most often corrects, and one anonymous example.
2. Community comparison: how he narrows a search, everyday details buyers overlook, and how he explains priorities.
3. Seller preparation: what he asks before recommending work, projects he wants to discuss before money is spent, and what to bring to the first meeting.

Use his answers to revise the draft, then ask him to approve the exact version. No quotations or first-person experience should be attributed to him until captured and checked.

## Capture sheet — repeat for each article

Date / recording permission:
Source file or private notes reference:
Reader's question:
Brad's answer in his own words:
Exact phrases to preserve:
Concrete example / permission to use it:
When the advice would be different:
Facts to verify / authoritative sources:
Three useful next steps:
One invitation to contact Brad:

## Readable proof checklist

1. Does this sound like something you would say?
2. Is the advice accurate, including when it would not apply?
3. Are the story and any photos okay to share publicly?
4. Is anything exaggerated, too personal or missing?
5. Do you approve this exact version for the website?

Record approval date and the approved version. Material revisions need another review. No publishing date until the source and approval are available.

## Publishing procedure

Add the article to src/posts.json using the schema below. Draft status may contain incomplete material and never generates a route. Only published entries with a source reference, Brad approval, valid dates and complete sections can build. Future publish dates stay excluded. No posts means no public blog index, empty blog or navigation link.

```json
{
  "slug": "before-you-prepare-to-sell",
  "status": "draft",
  "title": "",
  "summary": "",
  "approvedByBrad": false,
  "approvedOn": "",
  "publishedOn": "",
  "sourceReference": "",
  "privateNotes": "",
  "sections": [{"heading": "", "paragraphs": [""]}]
}
```

sourceReference and privateNotes are not rendered. Keep sensitive interview recordings outside the repository. Article content is plain text with headings and paragraphs; HTML is escaped. Run npm run verify before review. The site remains noindex until launch is authorized. No new subscription or CMS is needed for this workflow.
