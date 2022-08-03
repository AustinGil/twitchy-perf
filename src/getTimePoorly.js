import * as fs from 'node:fs/promises'

// This is supposed to be slow
export default async function getTime() {
  const date = new Date()
  await fs.writeFile("time.txt", date.toISOString())
  const fileTime = await fs.readFile('time.txt', 'utf8')
  await fs.rm('time.txt')
  return fileTime
}