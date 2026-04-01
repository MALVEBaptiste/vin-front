import { useRef, type KeyboardEvent, type ClipboardEvent } from 'react';
import { Box, TextField } from '@mui/material';

interface PinInputProps {
  value: string;
  onChange: (pin: string) => void;
  error?: boolean;
}

export default function PinInput({ value, onChange, error }: PinInputProps) {
  const refs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const digits = value.padEnd(4, '').split('').slice(0, 4);

  const update = (index: number, digit: string) => {
    const next = [...digits];
    next[index] = digit;
    onChange(next.join(''));
  };

  const handleChange = (index: number, val: string) => {
    const d = val.replace(/\D/g, '').slice(-1);
    update(index, d);
    if (d && index < 3) refs[index + 1].current?.focus();
  };

  const handleKeyDown = (index: number, e: KeyboardEvent) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      refs[index - 1].current?.focus();
    }
    if (e.key === 'ArrowLeft' && index > 0) refs[index - 1].current?.focus();
    if (e.key === 'ArrowRight' && index < 3) refs[index + 1].current?.focus();
  };

  const handlePaste = (e: ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4);
    onChange(pasted.padEnd(4, '').slice(0, 4));
    const focusIdx = Math.min(pasted.length, 3);
    refs[focusIdx].current?.focus();
  };

  return (
    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
      {[0, 1, 2, 3].map((i) => (
        <TextField
          key={i}
          inputRef={refs[i]}
          value={digits[i] || ''}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e as KeyboardEvent)}
          onPaste={i === 0 ? handlePaste : undefined}
          onFocus={(e) => e.target.select()}
          error={error}
          slotProps={{
            htmlInput: {
              maxLength: 1,
              inputMode: 'numeric',
              style: { textAlign: 'center', fontSize: '1.5rem', width: 40 },
              'aria-label': `Chiffre ${i + 1} du PIN`,
            },
          }}
        />
      ))}
    </Box>
  );
}
