'use client';

import { useState } from 'react';
import { StepShell } from './StepShell';
import { PrimaryButton, GhostButton } from '@/components/ui/buttons';
import type { Gender } from '@/lib/types';

function GenderToggle({
  value,
  gender,
  onToggle,
}: {
  value: Gender;
  gender: 'male' | 'female';
  onToggle: () => void;
}) {
  const selected = value === gender;
  const grad =
    gender === 'female'
      ? 'linear-gradient(145deg, #9A47B0, #C8478C)'
      : 'linear-gradient(145deg, #2FA06F, #2C73B4)';
  return (
    <button
      type="button"
      aria-label={gender === 'female' ? 'נקבה' : 'זכר'}
      aria-pressed={selected}
      onClick={onToggle}
      className="appearance-none w-12 min-h-[56px] rounded-xl text-[22px] cursor-pointer flex items-center justify-center transition-all leading-none"
      style={{
        border: selected ? '1px solid transparent' : '1px solid #2C2440',
        background: selected ? grad : '#171327',
        color: selected ? '#fff' : '#6f6685',
        boxShadow: selected ? '0 6px 16px -6px rgba(0,0,0,.5)' : 'none',
      }}
    >
      {gender === 'female' ? '♀' : '♂'}
    </button>
  );
}

function NameRow({
  placeholder,
  value,
  onChange,
  gender,
  onGender,
}: {
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  gender: Gender;
  onGender: (g: 'male' | 'female') => void;
}) {
  return (
    <div className="flex gap-2.5 items-stretch">
      <input
        type="text"
        placeholder={placeholder}
        maxLength={14}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        dir="rtl"
        className="flex-1 min-w-0 appearance-none border border-line bg-surface text-ink rounded-[14px] p-[18px] text-[17px] text-right min-h-[56px] focus:outline-none focus:border-gold"
      />
      <div className="flex gap-1.5 flex-none">
        <GenderToggle value={gender} gender="male" onToggle={() => onGender('male')} />
        <GenderToggle value={gender} gender="female" onToggle={() => onGender('female')} />
      </div>
    </div>
  );
}

export function NamesStep({
  genders,
  onSetGender,
  onStart,
}: {
  genders: [Gender, Gender];
  onSetGender: (index: 0 | 1, gender: Gender) => void;
  onStart: (a: string, b: string) => void;
}) {
  const [a, setA] = useState('');
  const [b, setB] = useState('');

  return (
    <StepShell
      screen="names"
      footer={
        <div className="flex flex-col gap-2.5">
          <PrimaryButton onClick={() => onStart(a, b)}>להתחיל</PrimaryButton>
          <GhostButton className="self-center" onClick={() => onStart('', '')}>
            דלגו
          </GhostButton>
        </div>
      }
    >
      <div className="text-center flex flex-col gap-2">
        <h1 className="font-serif font-bold text-[27px] leading-[1.3] m-0">
          איך קוראים לכם?
        </h1>
        <p className="m-0 text-sm text-muted">
          לסימון תורות. אפשר לדלג — נשמר רק אצלכם במכשיר.
        </p>
      </div>
      <div className="flex flex-col gap-[18px]">
        <NameRow
          placeholder="שם ראשון"
          value={a}
          onChange={setA}
          gender={genders[0]}
          onGender={(g) => onSetGender(0, g)}
        />
        <NameRow
          placeholder="שם שני"
          value={b}
          onChange={setB}
          gender={genders[1]}
          onGender={(g) => onSetGender(1, g)}
        />
      </div>
    </StepShell>
  );
}
