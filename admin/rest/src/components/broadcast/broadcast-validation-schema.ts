import * as yup from 'yup';

export const broadcastValidationSchema = yup.object().shape({
    subject: yup
        .string()
        .required('Subject is required'),
    message: yup
        .string()
        .required('Message is required')
});
