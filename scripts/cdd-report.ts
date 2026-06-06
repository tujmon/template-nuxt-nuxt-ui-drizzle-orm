/* eslint-disable no-console */
import { spawnSync } from 'node:child_process'

type FallowFileScore = {
  path: string
  total_cyclomatic: number
  total_cognitive: number
  fan_out: number
  crap_above_threshold: number
}

type FallowLargeFunction = {
  path: string
}

type FallowHealth = {
  file_scores: FallowFileScore[]
  large_functions?: FallowLargeFunction[]
}

type IcpScore = {
  decisionPoints: number
  cognitiveLoad: number
  coupling: number
  largeUnits: number
  untestedRisk: number
  total: number
}

type IcpFile = {
  path: string
  icp: IcpScore
}

const options = {
  limit: Number.parseInt(process.env.CDD_ICP_LIMIT || '20', 10),
  failOnLimit: process.argv.includes('--fail-on-limit'),
  top: Number.parseInt(process.env.CDD_TOP || '10', 10)
}

const runFallowHealth = (): FallowHealth => {
  const result = spawnSync('npx', ['fallow', 'health', '--report-only', '--format', 'json', '--quiet'], {
    encoding: 'utf8'
  })

  if (result.status !== 0) {
    throw new Error(result.stderr || result.stdout || 'Failed to run fallow health.')
  }

  return JSON.parse(result.stdout) as FallowHealth
}

const groupLargeFunctionsByFile = (largeFunctions: FallowLargeFunction[] = []) => {
  const counts = new Map<string, number>()

  for (const fn of largeFunctions) {
    counts.set(fn.path, (counts.get(fn.path) || 0) + 1)
  }

  return counts
}

const calculateIcp = (fileScore: FallowFileScore, largeFunctionCount: number): IcpScore => {
  const decisionPoints = Math.ceil(fileScore.total_cyclomatic / 3)
  const cognitiveLoad = Math.ceil(fileScore.total_cognitive / 3)
  const coupling = fileScore.fan_out
  const largeUnits = largeFunctionCount * 2
  const untestedRisk = fileScore.crap_above_threshold * 2

  return {
    decisionPoints,
    cognitiveLoad,
    coupling,
    largeUnits,
    untestedRisk,
    total: decisionPoints + cognitiveLoad + coupling + largeUnits + untestedRisk
  }
}

const formatRow = (item: IcpFile) => {
  const marker = item.icp.total > options.limit ? '!' : ' '
  return [
    marker,
    String(item.icp.total).padStart(3),
    String(item.icp.decisionPoints).padStart(2),
    String(item.icp.cognitiveLoad).padStart(2),
    String(item.icp.coupling).padStart(2),
    String(item.icp.largeUnits).padStart(2),
    String(item.icp.untestedRisk).padStart(2),
    item.path
  ].join('  ')
}

const health = runFallowHealth()
const largeFunctionsByFile = groupLargeFunctionsByFile(health.large_functions)
const files = health.file_scores
  .map((fileScore) => {
    const largeFunctionCount = largeFunctionsByFile.get(fileScore.path) || 0

    return {
      path: fileScore.path,
      icp: calculateIcp(fileScore, largeFunctionCount)
    }
  })
  .sort((left, right) => right.icp.total - left.icp.total)

const aboveLimit = files.filter(file => file.icp.total > options.limit)

console.log('CDD report from fallow health')
console.log(`ICP limit per file: ${options.limit}`)
console.log('ICP = decisions + cognitive + coupling + large units + untested risk')
console.log('')
console.log('    ICP  De  Co  Cp  Lg  Ri  File')
console.log('    ---  --  --  --  --  --  ----')

for (const file of files.slice(0, options.top)) {
  console.log(formatRow(file))
}

console.log('')
console.log(`Files above limit: ${aboveLimit.length}`)

if (aboveLimit.length) {
  console.log('Suggested first actions:')
  for (const file of aboveLimit.slice(0, 5)) {
    console.log(`- ${file.path}: reduce branches/coupling or add tests before expanding it.`)
  }
}

if (options.failOnLimit && aboveLimit.length) {
  process.exitCode = 1
}
