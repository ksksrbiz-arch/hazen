# Brad's first two articles: interview and review kit

Private working material. Nothing here is an article attributed to Brad.

## 25-minute conversation

Ask Brad if recording is okay. Have him talk as if answering one client, not giving a presentation. Skip client names, exact addresses and identifying details.

### Article 1: Before you spend money getting your property ready to sell

- What do you ask a seller before recommending any work?
- Tell me about a repair or improvement that made sense, and one that did not. Why?
- What would change your advice: property type, condition, budget or timing?
- What are three questions the seller should ask before spending money?
- What should they bring to a first conversation with you?

### Article 2: What you look for when walking a property

- Walk me through what catches your attention first.
- What can you observe yourself, and what needs an inspector, surveyor or other specialist?
- Is there a land-related question people overlook? Explain without making a legal or permitting promise.
- Give an anonymized example and explain what you asked next.
- What can photos leave out that a visit helps clarify?

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
