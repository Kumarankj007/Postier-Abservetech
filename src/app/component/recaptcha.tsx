// RecaptchaComponent.tsx
import React from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

interface RecaptchaComponentProps {
  onVerify: (token: string | null) => void;
}

const RecaptchaComponent: React.FC<RecaptchaComponentProps> = ({ onVerify }) => {
  const CAPTCHA_id:any = process.env.NEXT_PUBLIC_RECAPTCHA_ID;
  const handleVerify = (response: string | null) => {
    onVerify(response);
  };

  return (
    <div>
      <ReCAPTCHA
        sitekey={CAPTCHA_id}
        onChange={handleVerify}
      />
    </div>
  );
};

export default RecaptchaComponent;
