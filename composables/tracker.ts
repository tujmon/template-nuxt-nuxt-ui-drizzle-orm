/**
 * Custom Performance Tracking Composable
 * Uses the Web User Timing API to measure rendering and action latency.
 */
export const useTracker = () => {
  const startMark = (name: string) => {
    if (import.meta.client) {
      performance.mark(`${name}-start`)
    }
  }

  const endMark = (name: string, thresholdMs = 300) => {
    if (import.meta.client) {
      const start = `${name}-start`
      const end = `${name}-end`
      performance.mark(end)

      try {
        const measure = performance.measure(name, start, end)
        const duration = measure.duration

        // Log performance warnings if it exceeds threshold
        if (duration > thresholdMs) {
          console.warn(`[Perf Alert] "${name}" took ${duration.toFixed(2)}ms (Threshold: ${thresholdMs}ms)`)
        } else {
          console.log(`[Perf Log] "${name}" completed in ${duration.toFixed(2)}ms`)
        }
      } catch (e) {
        // Handle cases where the start mark does not exist
        console.error(`Failed to measure performance for ${name}`, e)
      } finally {
        // Clean up marks
        performance.clearMarks(start)
        performance.clearMarks(end)
        performance.clearMeasures(name)
      }
    }
  }

  const trackAsync = async <T>(name: string, fn: () => Promise<T>, thresholdMs = 500): Promise<T> => {
    startMark(name)
    try {
      return await fn()
    } finally {
      endMark(name, thresholdMs)
    }
  }

  return {
    startMark,
    endMark,
    trackAsync
  }
}
