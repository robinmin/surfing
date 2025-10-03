# Article Metadata Completion Prompt

Use this prompt to process markdown article files and ensure they have complete metadata according to the articles template specification.

## Your Task

Analyze the provided markdown file(s) and pad any missing frontmatter fields according to the articles template specification (`scripts/postsurfing/templates/articles.yaml`).

## Required Field

- **title**: Must be present (if missing, extract from filename or first heading)

## Optional Fields to Auto-Generate

When padding metadata, intelligently generate these fields based on content analysis:

### Basic Metadata

- **description**: SEO-friendly summary (50-160 characters) of the article content
- **slug**: URL-friendly version of the title (lowercase, hyphenated)
- **publishDate**: Use current date if not specified
- **excerpt**: First 2-3 sentences or a compelling summary of the content

### Content Analysis

- **tags**: Array of relevant tags based on content keywords and topics
- **category**: Choose from: `ai`, `research`, `technical`, `tutorial`, `analysis`, `opinion`
- **readingTime**: Calculate based on word count (avg 200-250 words/minute)
- **wordCount**: Count all words in the markdown content

### Optional Fields (Preserve if Present)

- **updateDate**: Only set if article was modified
- **aliases**: Alternative titles (for Obsidian compatibility)
- **cssclass**: Custom CSS class (for Obsidian)
- **draft**: Default to `false` if not specified
- **featured**: Default to `false` if not specified
- **author**: Leave empty unless specified
- **image**: Featured image path (should be in `/public/images/`)

## Guidelines

1. **Preserve existing fields**: Never overwrite fields that already exist
2. **Content-aware generation**: Analyze the actual content to generate relevant tags, category, and descriptions
3. **Consistency**: Use consistent date format (ISO 8601: YYYY-MM-DD)
4. **SEO optimization**: Ensure description is compelling and within character limits
5. **Tag relevance**: Generate 3-7 relevant tags based on content analysis
6. **Category accuracy**: Choose the most appropriate single category

## Output Format

Return the complete frontmatter block with all fields properly formatted:

```yaml
---
title: 'Article Title'
description: 'Concise SEO-friendly description (50-160 chars)'
slug: 'article-title'
publishDate: 2025-10-02
tags: ['tag1', 'tag2', 'tag3']
category: 'technical'
featured: false
draft: false
author: ''
excerpt: 'First few sentences of the article...'
readingTime: 8
wordCount: 1850
---
```

## Example Usage

**Input**: Markdown file with minimal frontmatter

```yaml
---
title: 'Understanding Neural Networks'
---
```

**Output**: Complete frontmatter with generated fields

```yaml
---
title: 'Understanding Neural Networks'
description: 'A comprehensive guide to neural network architectures, training, and applications in modern AI systems.'
slug: 'understanding-neural-networks'
publishDate: 2025-10-02
tags: ['ai', 'neural-networks', 'machine-learning', 'deep-learning']
category: 'tutorial'
featured: false
draft: false
author: ''
excerpt: 'Neural networks are the foundation of modern AI. This guide explores their architecture, training process, and real-world applications.'
readingTime: 12
wordCount: 2800
---
```

## Processing Instructions

1. Read the markdown file content
2. Parse existing frontmatter
3. Analyze content to understand topic, complexity, and keywords
4. Generate missing fields intelligently
5. Preserve all existing fields
6. Return complete frontmatter block
7. Ensure all required fields are present
