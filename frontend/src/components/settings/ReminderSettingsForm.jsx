import { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { api, getErrorMessage } from '../../api/client';
import { useAuth } from '../../hooks/useAuth';

const ReminderSettingsForm = () => {
  const { user, setUser } = useAuth();
  const [status, setStatus] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting }
  } = useForm({
    defaultValues: {
      reminderTime: user?.reminderTime || '20:00',
      reminderEnabled: user?.reminderEnabled ?? true
    }
  });

  const onSubmit = async (formData) => {
    setStatus(null);
    try {
      const { data } = await api.put('/auth/reminder', formData);
      setUser(data.user);
      setStatus({ type: 'success', message: 'Reminder settings updated.' });
    } catch (error) {
      setStatus({ type: 'danger', message: getErrorMessage(error) });
    }
  };

  return (
    <div className="glass-card p-4" style={{ maxWidth: '480px' }}>
      <h3 className="fs-6 fw-semibold mb-3">Email Reminder Settings</h3>
      {status && <Alert variant={status.type}>{status.message}</Alert>}

      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group className="mb-3">
          <Form.Check
            type="switch"
            id="reminderEnabled"
            label="Send me a daily reminder email"
            {...register('reminderEnabled')}
          />
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label>Reminder time</Form.Label>
          <Form.Control type="time" {...register('reminderTime')} />
          <Form.Text className="text-muted">
            We'll email you at this time if you haven't logged anything that day.
          </Form.Text>
        </Form.Group>

        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save settings'}
        </Button>
      </Form>
    </div>
  );
};

export default ReminderSettingsForm;