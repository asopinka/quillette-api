# Quillette API
Quillette is a platform for free thought. This API aims to enable developers to bring their articles to new applications.

# Requirements

- Node v8+
- Understanding of async/await (no callbacks)

# Install

`npm install quillette-api --save` or `yarn add quillette-api`

# Usage

Include the quillette api:
```
const quillette = require('quillette-api')
```

There's various calls to get various stories on Quillette.

- Get full story by passing the link to the story
```
const story = await quillette.getArticle(link)
```

- Get spotlight story
```
const story = await quillette.getSpotlight()
```

- Get top stories
```
const stories = await quillette.getTopStories()
```

- Get recent stories
```
const stories = await quillette.getRecent()
```

- Get must-read story
```
const story = await quillette.getMustRead()
```

- Get a category, with page number
```
const stories = await quillette.getCategory(category, pageNumber)
```
