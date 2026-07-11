import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Alert } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import AuthLayout from '../components/auth/AuthLayout';
import { api, getErrorMessage } from '../api/client';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm();

  const onSubmit = async ({ password }) => {
    setServerError('');
    try {
      await api.post(`/auth/reset-password/${token}`, { password });
      navigate('/login', { replace: true, state: { justReset: true } });
    } catch (error) {
      setServerError(getErrorMessage(error));
    }
  };

  return (
    <AuthLayout title="Set a new password" subtitle="Choose a strong password you haven't used before">
      {serverError && <Alert variant="danger">{serverError}</Alert>}

      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group className="mb-3">
          <Form.Label>New password</Form.Label>
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
          <Form.Label>Confirm password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Re-enter password"
            isInvalid={!!errors.confirmPassword}
            {...register('confirmPassword', {
              required: 'Please confirm your password',
              validate: (value) => value === watch('password') || 'Passwords do not match'
            })}
          />
          <Form.Control.Feedback type="invalid">{errors.confirmPassword?.message}</Form.Control.Feedback>
        </Form.Group>

        <Button type="submit" variant="primary" className="w-100" disabled={isSubmitting}>
          {isSubmitting ? 'Updating...' : 'Update password'}
        </Button>
      </Form>

      <p className="text-center small text-muted mt-4 mb-0">
        <Link to="/login">Back to login</Link>
      </p>
    </AuthLayout>
  );
};

export default ResetPassword;