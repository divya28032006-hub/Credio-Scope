import { motion } from 'framer-motion';
import { RiFireLine } from 'react-icons/ri';

// Daily Logging Streak — NOT per-payment-app. See project decisions (Section 7 of handoff).
const StreakCard = ({ current = 0, longest = 0 }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.35 }}
    className="glass-card p-4 h-100 d-flex align-items-center gap-4"
  >
    <div className="stamp">
      <RiFireLine size={22} />
      <span className="fw-bold fs-5 lh-1">{current}</span>
      <span style={{ fontSize: '0.6rem' }}>DAYS</span>
    </div>
    <div>
      <div className="fw-semibold">Daily Logging Streak</div>
      <div className="small text-muted">
        Longest streak: <strong className="font-tabular">{longest}</strong> day{longest === 1 ? '' : 's'}
      </div>
      <div className="small text-muted mt-1">Log a transaction today to keep it going.</div>
    </div>
  </motion.div>
);

export default StreakCard;