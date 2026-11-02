import React, { useState, useEffect } from 'react';
import { Person } from '../types';

interface Props {
  isOpen: boolean;
  mode: 'add' | 'edit';
  person?: Person | null;
  defaultBus: number;
  onClose: () => void;
  onSave: (data: { id?: string; name: string; dept: string; bus: number }) => Promise<void>;
}

export function ParticipantModal({
  isOpen,
  mode,
  person,
  defaultBus,
  onClose,
  onSave
}: Props) {
  const [name, setName] = useState('');
  const [dept, setDept] = useState('');
  const [bus, setBus] = useState<number>(defaultBus);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && person) {
        setName(person.name || '');
        setDept(person.dept || '');
        setBus(person.out || person.back || defaultBus);
      } else {
        setName('');
        setDept('');
        setBus(defaultBus);
      }
      setErrorMsg(null);
      setSaving(false);
    }
  }, [isOpen, mode, person, defaultBus]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = name.trim();
    if (!cleanName) {
      setErrorMsg('참가자 이름을 입력해 주세요.');
      return;
    }

    setSaving(true);
    setErrorMsg(null);
    try {
      await onSave({
        id: person?.id,
        name: cleanName,
        dept: dept.trim() || '소속 미지정',
        bus
      });
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || '저장 중 오류가 발생했습니다.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(24, 42, 70, 0.45)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '14px'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !saving) onClose();
      }}
    >
      <div
        className="card"
        style={{
          width: '100%',
          maxWidth: '420px',
          margin: 0,
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
        }}
      >
        <div className="row" style={{ marginBottom: '14px' }}>
          <h2 style={{ margin: 0, fontSize: '17px', fontWeight: 800, color: '#1f344e' }}>
            {mode === 'add' ? '👤 참가자 신규 추가' : '✏️ 참가자 정보 수정'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            style={{ padding: '4px 10px', fontSize: '13px' }}
          >
            ✕ 닫기
          </button>
        </div>

        {errorMsg && (
          <div
            style={{
              padding: '8px 10px',
              backgroundColor: '#fff0ef',
              color: '#a12828',
              borderRadius: '8px',
              fontSize: '12px',
              marginBottom: '12px'
            }}
          >
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '5px', color: '#334357' }}>
              성명 (이름) <span style={{ color: '#d85f59' }}>*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="예: 홍길동"
              autoFocus
              disabled={saving}
              required
            />
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '5px', color: '#334357' }}>
              소속 학교 / 기관
            </label>
            <input
              type="text"
              value={dept}
              onChange={(e) => setDept(e.target.value)}
              placeholder="예: 인천마이스터고등학교"
              disabled={saving}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px', color: '#334357' }}>
              배정 호차
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setBus(1)}
                disabled={saving}
                style={{
                  flex: 1,
                  height: '40px',
                  borderRadius: '9px',
                  fontSize: '13px',
                  fontWeight: 700,
                  background: bus === 1 ? '#e7f5ff' : '#f8f9fa',
                  border: bus === 1 ? '1.5px solid #74c0fc' : '1px solid #dee2e6',
                  color: bus === 1 ? '#1864ab' : '#6c757d',
                  transition: 'all 0.15s ease'
                }}
              >
                1호차 {bus === 1 && '✓'}
              </button>
              <button
                type="button"
                onClick={() => setBus(2)}
                disabled={saving}
                style={{
                  flex: 1,
                  height: '40px',
                  borderRadius: '9px',
                  fontSize: '13px',
                  fontWeight: 700,
                  background: bus === 2 ? '#fff4e6' : '#f8f9fa',
                  border: bus === 2 ? '1.5px solid #ffa94d' : '1px solid #dee2e6',
                  color: bus === 2 ? '#d9480f' : '#6c757d',
                  transition: 'all 0.15s ease'
                }}
              >
                2호차 {bus === 2 && '✓'}
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              style={{
                flex: 1,
                height: '42px',
                background: '#f8f9fa',
                border: '1px solid #dee2e6',
                color: '#495057',
                borderRadius: '9px',
                fontWeight: 650
              }}
            >
              취소
            </button>
            <button
              type="submit"
              className="primary"
              disabled={saving || !name.trim()}
              style={{
                flex: 2,
                height: '42px',
                borderRadius: '9px',
                fontWeight: 750
              }}
            >
              {saving ? '저장 중…' : mode === 'add' ? '명단에 추가하기' : '수정 완료하기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
