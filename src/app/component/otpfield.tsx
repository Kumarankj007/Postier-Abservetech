import { OTPInputProps } from '@/interface';
import React, { useState, useRef, useEffect, FocusEvent, ChangeEvent, KeyboardEvent, ClipboardEvent, ReactElement } from 'react';


const isStyleObject = (obj: unknown): obj is React.CSSProperties => typeof obj === 'object' && obj !== null;

const OTPInput: React.FC<OTPInputProps> = ({
  value = '',
  numInputs = 4,
  onChange,
  onPaste,
  renderInput,
  shouldAutoFocus = false,
  inputType = 'text',
  renderSeparator,
  placeholder,
  containerStyle,
  inputStyle,
  skipDefaultStyles = false,
}) => {
  const [activeInput, setActiveInput] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const getOTPValue = () => (value ? value.toString().split('') : []);

  const isInputNum = inputType === 'number' || inputType === 'tel';

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, numInputs);
  }, [numInputs]);

  useEffect(() => {
    if (shouldAutoFocus) {
      inputRefs.current[0]?.focus();
    }
  }, [shouldAutoFocus]);

  const getPlaceholderValue = () => {
    if (typeof placeholder === 'string') {
      if (placeholder.length === numInputs) {
        return placeholder;
      }

      if (placeholder.length > 0) {
        console.error('Length of the placeholder should be equal to the number of inputs.');
      }
    }
    return undefined;
  };

  const isInputValueValid = (value: string) => {
    const isTypeValid = isInputNum ? !isNaN(Number(value)) : typeof value === 'string';
    return isTypeValid && value.trim().length === 1;
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    if (isInputValueValid(value)) {
      changeCodeAtFocus(value);
      focusInput(activeInput + 1);
    }
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { nativeEvent } = event;
    const value = event.target.value;

    if (!isInputValueValid(value)) {
      if (value.length === numInputs) {
        const hasInvalidInput = value.split('').some((cellInput) => !isInputValueValid(cellInput));
        if (!hasInvalidInput) {
          handleOTPChange(value.split(''));
          focusInput(numInputs - 1);
        }
      }

      if ((nativeEvent as InputEvent).data === null && (nativeEvent as InputEvent).inputType === 'deleteContentBackward') {
        event.preventDefault();
        changeCodeAtFocus('');
        focusInput(activeInput - 1);
      }

      event.target.value = '';
    }
  };

  const handleFocus = (index: number) => (event: FocusEvent<HTMLInputElement>) => {
    setActiveInput(index);
    event.target.select();
  };

  const handleBlur = () => {
    setActiveInput(activeInput - 1);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    const otp = getOTPValue();
    if (['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', ' '].includes(event.key)) {
      event.preventDefault();
      if (event.key === 'Backspace') {
        changeCodeAtFocus('');
        focusInput(activeInput - 1);
      } else if (event.key === 'Delete') {
        changeCodeAtFocus('');
      } else if (event.key === 'ArrowLeft') {
        focusInput(activeInput - 1);
      } else if (event.key === 'ArrowRight') {
        focusInput(activeInput + 1);
      } else if (event.key === otp[activeInput]) {
        focusInput(activeInput + 1);
      }
    }
  };

  const focusInput = (index: number) => {
    const newIndex = Math.max(Math.min(numInputs - 1, index), 0);

    if (inputRefs.current[newIndex]) {
      inputRefs.current[newIndex]?.focus();
      inputRefs.current[newIndex]?.select();
      setActiveInput(newIndex);
    }
  };

  const changeCodeAtFocus = (value: string) => {
    const otp = getOTPValue();
    otp[activeInput] = value[0];
    handleOTPChange(otp);
  };

  const handleOTPChange = (otp: string[]) => {
    const otpValue = otp.join('');
    onChange(otpValue);
  };

  const handlePaste = (event: ClipboardEvent<HTMLDivElement>) => {
    event.preventDefault();

    const otp = getOTPValue();
    let nextActiveInput = activeInput;

    const pastedData = event.clipboardData
      .getData('text/plain')
      .slice(0, numInputs - activeInput)
      .split('');

    if (isInputNum && pastedData.some((value) => isNaN(Number(value)))) {
      return;
    }

    for (let pos = 0; pos < numInputs; ++pos) {
      if (pos >= activeInput && pastedData.length > 0) {
        otp[pos] = pastedData.shift() ?? '';
        nextActiveInput++;
      }
    }

    focusInput(nextActiveInput);
    handleOTPChange(otp);
  };

  return (
    <div
      style={Object.assign({ display: 'flex', alignItems: 'center', gap: '10px' }, isStyleObject(containerStyle) && containerStyle)}
      className={typeof containerStyle === 'string' ? containerStyle : undefined}
      onPaste={onPaste}
    >
      {Array.from({ length: numInputs }, (_, index) => index).map((index) => (
        <React.Fragment key={index}>
          {renderInput(
            {
              value: getOTPValue()[index] ?? '',
              placeholder: getPlaceholderValue()?.[index] ?? undefined,
              // @ts-ignore
              ref: (element:any) => (inputRefs.current[index] = element),
              onChange: handleChange,
              onFocus: handleFocus(index),
              onBlur: handleBlur,
              onKeyDown: handleKeyDown,
              onPaste: handlePaste,
              autoComplete: 'off',
              'aria-label': `Please enter OTP character ${index + 1}`,
              style: Object.assign(
                !skipDefaultStyles ? { textAlign: 'center' } : {},
                isStyleObject(inputStyle) ? inputStyle : {}
              ),
              className: typeof inputStyle === 'string' ? inputStyle : undefined,
              type: inputType,
              inputMode: isInputNum ? 'numeric' : 'text',
              onInput: handleInputChange,
            },
            index
          )}
          {index < numInputs - 1 && (typeof renderSeparator === 'function' ? renderSeparator(index) : renderSeparator)}
        </React.Fragment>
      ))}
    </div>
  );
};

export default OTPInput;
