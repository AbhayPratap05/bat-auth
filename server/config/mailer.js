import transporter from './nodemailer.js';

const brevoApiUrl = process.env.BREVO_API_URL || 'https://api.brevo.com/v3/smtp/email';

const getFromEmail = () => process.env.SENDER_EMAIL || process.env.SMTP_USER;
const getFromName = () => process.env.SENDER_NAME || 'Bat Auth';

const normalizeRecipients = (to) => {
    if (Array.isArray(to)) {
        return to.map((email) => ({ email }));
    }

    return [{ email: to }];
};

const sendWithBrevoApi = async ({ to, subject, html }) => {
    const apiKey = process.env.BREVO_API_KEY;

    if (!apiKey) {
        throw new Error('BREVO_API_KEY is missing');
    }

    const response = await fetch(brevoApiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'api-key': apiKey,
        },
        body: JSON.stringify({
            sender: {
                email: getFromEmail(),
                name: getFromName(),
            },
            to: normalizeRecipients(to),
            subject,
            htmlContent: html,
        }),
    });

    if (!response.ok) {
        const responseText = await response.text();
        const error = new Error(`Brevo API request failed with status ${response.status}`);

        error.code = `BREVO_${response.status}`;
        error.response = responseText;
        error.command = 'BREVO_API';

        throw error;
    }

    return response.json();
};

const sendWithSmtp = async ({ to, subject, html }) => {
    return transporter.sendMail({
        from: getFromEmail(),
        to,
        subject,
        html,
    });
};

export const sendEmail = async ({ to, subject, html }) => {
    if (process.env.BREVO_API_KEY) {
        return sendWithBrevoApi({ to, subject, html });
    }

    return sendWithSmtp({ to, subject, html });
};

export const verifyMailProvider = async () => {
    if (process.env.BREVO_API_KEY) {
        console.log(`Mail provider ready: Brevo API (${brevoApiUrl})`);
        return;
    }

    try {
        await transporter.verify();
        console.log('Mail provider ready: SMTP');
    } catch (error) {
        console.error('SMTP verification failed:', {
            message: error.message,
            code: error.code,
            response: error.response,
            command: error.command,
        });
    }
};

export { getFromEmail };