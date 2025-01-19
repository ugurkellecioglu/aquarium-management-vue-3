import AngelfishIcon from './AngelfishIcon.vue'
import BettaIcon from './BettaIcon.vue'
import ClockIcon from './ClockIcon.vue'
import GaugeIcon from './GaugeIcon.vue'
import GoldfishIcon from './GoldfishIcon.vue'
import GuppyIcon from './GuppyIcon.vue'
import OscarIcon from './OscarIcon.vue'
import PauseIcon from './PauseIcon.vue'
import PlayIcon from './PlayIcon.vue'
import SeaMoss from './SeaMoss.vue'
import SeaMossSecond from './SeaMossSecond.vue'
import SeaMossThird from './SeaMossThird.vue'
export type IconNames =
  | 'Clock'
  | 'Gauge'
  | 'Pause'
  | 'Play'
  | 'SeaMoss'
  | 'SeaMossSecond'
  | 'SeaMossThird'
  | 'Angelfish'
  | 'Goldfish'
  | 'Guppy'
  | 'Oscar'
  | 'Betta'
// TODO: better type
const Icons: Record<IconNames, any> = {
  Clock: ClockIcon,
  Gauge: GaugeIcon,
  Pause: PauseIcon,
  Play: PlayIcon,
  SeaMoss: SeaMoss,
  SeaMossSecond: SeaMossSecond,
  SeaMossThird: SeaMossThird,
  Angelfish: AngelfishIcon,
  Goldfish: GoldfishIcon,
  Guppy: GuppyIcon,
  Oscar: OscarIcon,
  Betta: BettaIcon,
}

export default Icons
