import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import AuthLayout from '../components/auth/AuthLayout';
import { useAuth } from '../hooks/useAuth';
import { getErrorMessage } from '../api/client';

const Signup = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({ defaultValues: { reminderTime: '20:00' } });

  const onSubmit = async (formData) => {
    setServerError('');
    try {
      await registerUser(formData);
      navigate('/dashboard', { replace: true });
    } catch (error) {
      setServerError(getErrorMessage(error));
    }
  };

  return (
    <AuthLayout title="Create your account" subtitle="Start tracking in under a minute">
      {serverError && <Alert variant="danger">{serverError}</Alert>}

      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group className="mb-3">
          <Form.Label>Full name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Divya Sharma"
            isInvalid={!!errors.name}
            {...register('name', {
              required: 'Name is required',
              minLength: { value: 2, message: 'Name must be at least 2 characters' }
            })}
          />
          <Form.Control.Feedback type="invalid">{errors.name?.message}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="you@example.com"
            isInvalid={!!errors.email}
            {...register('email', { required: 'Email is required' })}
          />
          <Form.Control.Feedback type="invalid">{errors.email?.message}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="At least 8 characters"
            isInvalid={!!errors.password}
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 8, message: 'Password must be at least 8 characters' }
            })}
          />
          <Form.Control.Feedback type="invalid">{errors.password?.message}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label>Daily reminder time</Form.Label>
          <Row className="g-2 align-items-center">
            <Col>
              <Form.Control type="time" {...register('reminderTime')} />
            </Col>
            <Col xs="auto">
              <span className="small text-muted">We'll nudge you if you haven't logged anything yet</span>
            </Col>
          </Row>
        </Form.Group>

        <Button type="submit" variant="primary" className="w-100" disabled={isSubmitting}>
          {isSubmitting ? 'Creating account...' : 'Create account'}
        </Button>
      </Form>

      <p className="text-center small text-muted mt-4 mb-0">
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </AuthLayout>
  );
};

export default Signup;