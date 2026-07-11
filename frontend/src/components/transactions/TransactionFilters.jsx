import { Row, Col, Form, InputGroup } from 'react-bootstrap';
import { RiSearchLine } from 'react-icons/ri';
import { CATEGORIES, TRANSACTION_TYPES } from '../../utils/categories';

const TransactionFilters = ({ filters, onChange }) => {
  const update = (key, value) => onChange({ ...filters, [key]: value });

  return (
    <Row className="g-2 mb-3">
      <Col xs={12} md={4}>
        <InputGroup>
          <InputGroup.Text className="bg-transparent">
            <RiSearchLine />
          </InputGroup.Text>
          <Form.Control
            placeholder="Search merchant..."
            value={filters.search}
            onChange={(e) => update('search', e.target.value)}
          />
        </InputGroup>
      </Col>
      <Col xs={6} md={2}>
        <Form.Select value={filters.type} onChange={(e) => update('type', e.target.value)}>
          <option value="">All types</option>
          {TRANSACTION_TYPES.map((t) => (
            <option key={t} value={t}>
              {t[0].toUpperCase() + t.slice(1)}
            </option>
          ))}
        </Form.Select>
      </Col>
      <Col xs={6} md={3}>
        <Form.Select value={filters.category} onChange={(e) => update('category', e.target.value)}>
          <option value="">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Form.Select>
      </Col>
      <Col xs={6} md={3}>
        <Form.Control
          type="month"
          value={filters.month}
          onChange={(e) => update('month', e.target.value)}
        />
      </Col>
    </Row>
  );
};

export default TransactionFilters;