import type { ExecutionContext } from 'hono'
import type { ClientOptions } from 'openai'
import { GoogleGenAI } from '@google/genai'
import { Hono } from 'hono'
import ky from 'ky'
import MarkdownIt from 'markdown-it'
// import { OpenAI } from 'openai'
import { Resend } from 'resend'

interface Bindings {
  RESEND_KEY: string
  OPENAI_KEY: string
  EMAIL_LIST: string[]
}

const app = new Hono<{ Bindings: Bindings }>()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

// app.get('/send_news', async (c) => {
//   await task(c.env)
//   return c.json({
//     message: 'success',
//   })
// })

const FEED_URL = 'https://36kr.com/feed' // 综合资讯

async function fetchNews() {
  const res = await ky.get(FEED_URL).text()
  // 使用正则移除所有class="image-wrapper"的p标签
  const regex = /<p class="image-wrapper">.*?<\/p>/g
  const content = res.replace(regex, '').replace(/\s+/g, ' ')
  return content
}

async function analyzeNews(content: string, options: ClientOptions) {
  const MODEL = 'gemini-2.5-flash-preview-05-20'

  // const openai = new OpenAI({
  //   apiKey: options.apiKey,
  //   baseURL: options.baseURL,
  // })

  // const completion = await openai.chat.completions.create({
  //   model: MODEL,
  //   temperature: 1.5,
  //   messages: [
  //     {
  //       role: 'user',
  //       content: `总结并分析一下近期热点: 「${content}」`,
  //     },
  //   ],
  // })
  // return completion.choices[0].message.content

  const ai = new GoogleGenAI({ apiKey: options.apiKey })
  const response = await ai.models.generateContent({
    model: MODEL,
    contents: `总结一下近期热点: 「${content}」`,
  })
  return response.text
}

async function sendEmail(report: string, emailList: string, key: string) {
  const resend = new Resend(key)

  const md = new MarkdownIt()
  const html = md.render(report)

  const { error } = await resend.emails.send({
    from: 'news@news.onex.email',
    to: emailList.split(',').filter(Boolean),
    subject: '新闻速递',
    html,
  })
  if (error) {
    console.log(error)
  }
}

async function task(env: any) {
  console.log('scheduled')
  const content = await fetchNews()
  const report = await analyzeNews(content, {
    apiKey: env.OPENAI_KEY,
    baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
  })
  console.log(report)
  if (report) {
    return sendEmail(report, env.EMAIL_LIST, env.RESEND_KEY)
  }
}

export default {
  fetch: app.fetch,
  scheduled: async (controller: any, env: any, ctx: ExecutionContext) => {
    ctx.waitUntil(task(env))
  },
}
