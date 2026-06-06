/**
 * Custom Performance Tracking Composable
 * Uses the Web User Timing API to measure rendering and action latency.
 */
export type PerformanceMeasureResult = {
  name: string
  duration: number
  thresholdMs: number
  exceededThreshold: boolean
  createdAt: string
}

type TrackOptions = {
  thresholdMs?: number
  report?: boolean
}

export const usePerformanceMeasure = () => {
  const reportMeasure = (measure: PerformanceMeasureResult) => {
    if (!import.meta.client) {
      return
    }

    const payload = JSON.stringify(measure)

    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/telemetry/performance', payload)
      return
    }

    void $fetch('/api/telemetry/performance', {
      method: 'POST',
      body: measure
    })
  }

  const startMark = (name: string) => {
    if (import.meta.client) {
      performance.mark(`${name}-start`)
    }
  }

  const endMark = (name: string, thresholdMs = 300) => {
    if (!import.meta.client) {
      return null
    }

    const start = `${name}-start`
    const end = `${name}-end`
    performance.mark(end)

    try {
      const measure = performance.measure(name, start, end)
      const duration = measure.duration

      return {
        name,
        duration,
        thresholdMs,
        exceededThreshold: duration > thresholdMs,
        createdAt: new Date().toISOString()
      } satisfies PerformanceMeasureResult
    } catch {
      return null
    } finally {
      performance.clearMarks(start)
      performance.clearMarks(end)
      performance.clearMeasures(name)
    }
  }

  const trackAsync = async <T>(
    name: string,
    fn: () => Promise<T>,
    options: TrackOptions | number = {}
  ): Promise<T> => {
    const normalizedOptions = typeof options === 'number' ? { thresholdMs: options } : options
    const thresholdMs = normalizedOptions.thresholdMs ?? 500

    startMark(name)
    try {
      return await fn()
    } finally {
      const measure = endMark(name, thresholdMs)

      if (measure && normalizedOptions.report) {
        reportMeasure(measure)
      }
    }
  }

  return {
    startMark,
    endMark,
    reportMeasure,
    trackAsync
  }
}
