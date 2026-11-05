import { useEffect, useRef } from 'react'
import SvgGauge, {type GaugeOptions, type GaugeInstance } from 'svg-gauge'

const Gauge = ({ value }: Props) => {
  const gaugeEl = useRef<HTMLDivElement>(null)
  const gaugeRef = useRef<GaugeInstance | null>(null)
  useEffect(() => {
    if (!gaugeRef.current) {
      if (!gaugeEl.current) return
      const options: GaugeOptions = { color: value => (value < 30 ? 'green' : 'red') }
      gaugeRef.current = SvgGauge(gaugeEl.current, options)
      gaugeRef.current?.setValue(1)
    }
    gaugeRef.current?.setValueAnimated(value, 1)
  }, [value])

  return (
    <div style={{ width: '100px', height: '100px' }}>
      <div ref={gaugeEl} />
    </div>
  )
}

interface Props {
  value: number
}

export default Gauge