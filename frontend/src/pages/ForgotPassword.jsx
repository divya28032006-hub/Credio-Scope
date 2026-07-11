import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Form, Button, Alert } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import AuthLayout from '../components/auth/AuthLayout';
import { api, getErrorMessage } from '../api/client';

const ForgotPassword = () => {
  const [status, setStatus] = useState(null); // { type: 'success' | 'danger', message }
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm();

  const onSubmit = async ({ email }) => {
    setStatus(null);
    try {
      const { data } = await api.post('/auth/forgot-password', { email });
      setStatus({ type: 'success', message: data.message });
    } catch (error) {
      setStatus({ type: 'danger', message: getErrorMessage(error) });
    }
  };

  return (
    <AuthLayout
      title="Forgot your password?"
      subtitle="Enter your email and we'll send you a reset link"
    >
      {status && <Alert variant={status.type}>{status.message}</Alert>}

      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group className="mb-4">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="you@example.com"
            isInvalid={!!errors.email}
            {...register('email', { required: 'Email is required' })}
          />
          <Form.Control.Feedback type="invalid">{errors.email?.message}</Form.Control.Feedback>
        </Form.Group>

        <Button type="submit" variant="primary" className="w-100" disabled={isSubmitting}>
          {isSubmitting ? 'Sending...' : 'Send reset link'}
        </Button>
      </Form>

      <p className="text-center small text-muted mt-4 mb-0">
        <Link to="/login">Back to login</Link>
      </p>
    </AuthLayout>
  );
};

export default ForgotPassword;