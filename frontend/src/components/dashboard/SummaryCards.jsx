import { Row, Col } from 'react-bootstrap';
import { RiArrowUpLine, RiArrowDownLine, RiWallet3Line } from 'react-icons/ri';
import { motion } from 'framer-motion';
import { formatCurrency } from '../../utils/formatCurrency';

const Tile = ({ icon: Icon, label, value, tone, delay }) => (
  <Col xs={12} sm={4}>
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      className="glass-card p-4 h-100"
    >
      <div className="d-flex align-items-center gap-2 mb-2">
        <Icon className={`text-${tone}`} size={20} />
        <span className="small text-muted fw-semibold">{label}</span>
      </div>
      <div className="fs-3 fw-bold font-tabular">{formatCurrency(value)}</div>
    </motion.div>
  </Col>
);

const SummaryCards = ({ income = 0, expense = 0, savings = 0 }) => (
  <Row className="g-3 mb-4">
    <Tile icon={RiArrowUpLine} label="Income this month" value={income} tone="success" delay={0} />
    <Tile icon={RiArrowDownLine} label="Expense this month" value={expense} tone="danger" delay={0.05} />
    <Tile icon={RiWallet3Line} label="Savings this month" value={savings} tone="primary" delay={0.1} />
  </Row>
);

export default SummaryCards;