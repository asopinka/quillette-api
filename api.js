const request = require('request-promise')
const cheerio = require('cheerio')
const Entities = require('html-entities').AllHtmlEntities
const entities = new Entities()

exports.getSpotlight = async () => {
	try {
		const rsp = await request('https://quillette.com/')
		const $ = cheerio.load(rsp)

		let article = parseArticle($,$('#front-fullwidth-top').find('.rp-medium-two'))
		return article
	}
	catch(err) {
		return null
	}
}

exports.getTopStories = async () => {
	try {
		const articles = []

		const rsp = await request('https://quillette.com/')
		const $ = cheerio.load(rsp)

		$('#front-content-one').find('.rp-medium-two').each((idx,div) => {
			let article = parseArticle($,div)
			if (article) {
				articles.push(article)
			}
		})

		return articles
	}
	catch(err) {
		return null
	}
}

exports.getRecent = async () => {
	try {
		const articles = []

		const rsp = await request('https://quillette.com/')
		const $ = cheerio.load(rsp)

		$('#front-content-two').find('.rp-color').each((idx,div) => {
			let article = parseArticle($,div)
			if (article) {
				articles.push(article)
			}
		})

		return articles
	}
	catch(err) {
		return null
	}
}

exports.getMustRead = async () => {
	try {
		const rsp = await request('https://quillette.com/')
		const $ = cheerio.load(rsp)

		let article = parseArticle($,$('#front-fullwidth-center').find('.rp-big-one'))
		return article
	}
	catch(err) {
		return null
	}
}

exports.getCategory = async (category, page) => {
	try {
		const articles = []

		const rsp = await request(`https://quillette.com/category/${category}/page/${page}`)
		const $ = cheerio.load(rsp)

		$('#primary').find('.post').each((idx,div) => {
			let article = parseArticle($,div)
			if (article) {
				articles.push(article)
			}
		})

		return articles
	}
	catch(err) {
		return null
	}
}

exports.getArticle = async (link) => {
	try {
		const rsp = await request(link)
		const $ = cheerio.load(rsp)

		let article = {}

		// details
		article.title = $('.post').find('.entry-title').text().trim()
		article.link = link
		article.image = $('.post').find('.entry-thumbnail').find('img').attr('src')
		article.date = $('.post').find('.entry-date').find('a').text().trim()

		// author
		let authorDiv = $('.post').find('.entry-author')
		if (authorDiv.length > 0) {
			article.author = {}
			article.author.name = authorDiv.find('a').text().trim()
			article.author.link = authorDiv.find('a').attr('href')
		}

		// comments
		let commentCount = $('.post').find('.entry-comments').find('a').text().trim().replace('comments ', '')
		article.comment_count = parseInt(commentCount)

		// categories
		article.categories = []
		$('.post').find('.entry-cats').first().find('a').each((cidx,cat) => {
			article.categories.push($(cat).text().trim())
		})

		// content
		$('.post').find('.entry-content').find('[class*="ad"]').remove()
		$('.post').find('.entry-content').find('[class*="mailmunch"]').remove()
		$('.post').find('.entry-content').find('[class*="share"]').remove()
		$('.post').find('.entry-content').contents().each((idx, item) => {
			if (item.type === 'comment') {
				$(item).remove()
			}
		})
		article.html = sanitizeHtml($('.post').find('.entry-content').html())

		// comments
		// if (includeComments) {
		// 	article.comments = []
		// 	$('#comments').find('.commentlist').children('li').each((idx,commentDiv) => {
		// 		let initialDiv = $(commentDiv).children('article')

		// 		let comment = {}
		// 		comment.author = initialDiv.find('.comment-author').find('a').text().trim()
		// 		comment.date = initialDiv.find('.comment-time').text().trim()
		// 		comment.html = sanitizeHtml(initialDiv.find('.comment-text').html())

		// 		// replies
		// 		let repliesDiv = initialDiv.find('li')
		// 		if (repliesDiv.length > 0) {
		// 			comment.replies = []
		// 			repliesDiv.each((ridx,replyDiv) => {
		// 				let reply = {}
		// 				reply.author = $(replyDiv).find('.comment-author').find('a').text().trim()
		// 				reply.date = $(replyDiv).find('.comment-time').text().trim()
		// 				reply.html = sanitizeHtml($(replyDiv).find('.comment-text').html())

		// 				comment.replies.push(reply)
		// 			})
		// 		}

		// 		article.comments.push(comment)
		// 	})
		// }

		return article
	}
	catch(err) {
		return null
	}
}

const parseArticle = ($,div) => {
	let article = {}

	try {
		// details
		article.title = $(div).find('.entry-title').text().trim()
		article.link = $(div).find('a').attr('href')
		article.image = $(div).find('img').attr('src')

		if ($(div).find('.summary').length > 0) {
			article.summary = $(div).find('.summary').text().trim()
		}
		else if ($(div).find('.entry-summary').length > 0) {
			article.summary = $(div).find('.entry-summary').text().trim()
		}
		article.date = $(div).find('.entry-date').find('a').text().trim()

		// author
		let authorDiv = $(div).find('.entry-author')
		if (authorDiv.length > 0) {
			article.author = {}
			article.author.name = authorDiv.find('a').text().trim()
			article.author.link = authorDiv.find('a').attr('href')
		}

		// comments
		if ($(div).find('.entry-comments').length > 0) {
			let commentCount = $(div).find('.entry-comments').find('a').text().trim().replace('comments ', '')
			article.comment_count = parseInt(commentCount)
		}

		// categories
		article.categories = []
		$(div).find('.entry-cats').find('a').each((cidx,cat) => {
			article.categories.push($(cat).text().trim())
		})
	}
	catch(err) {}

	return article
}

const sanitizeHtml = (input) => {
	if (input) {
		return entities.decode(input.trim().replace(/\n/g, '').replace(/\t/g, ''))
	}

	return ''
}
