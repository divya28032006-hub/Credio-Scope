import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Alert } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import AuthLayout from '../components/auth/AuthLayout';
import { useAuth } from '../hooks/useAuth';
import { getErrorMessage } from '../api/client';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm();

  const onSubmit = async (formData) => {
    setServerError('');
    try {
      await login(formData);
      navigate('/dashboard', { replace: true });
    } catch (error) {
      setServerError(getErrorMessage(error));
    }
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Log in to continue tracking your spending">
      {serverError && <Alert variant="danger">{serverError}</Alert>}

      <Form onSubmit={handleSubmit(onSubmit)}>
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

        <Form.Group className="mb-2">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="••••••••"
            isInvalid={!!errors.password}
            {...register('password', { required: 'Password is required' })}
          />
          <Form.Control.Feedback type="invalid">{errors.password?.message}</Form.Control.Feedback>
        </Form.Group>

        <div className="text-end mb-4">
          <Link to="/forgot-password" className="small text-decoration-none">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" variant="primary" className="w-100" disabled={isSubmitting}>
          {isSubmitting ? 'Logging in...' : 'Log in'}
        </Button>
      </Form>

      <p className="text-center small text-muted mt-4 mb-0">
        Don't have an account? <Link to="/signup">Sign up</Link>
      </p>
    </AuthLayout>
  );
};

export default Login;