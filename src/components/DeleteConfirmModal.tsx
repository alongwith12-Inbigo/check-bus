import { useState } from 'react';
import { Person } from '../types';

interface Props {
  isOpen: boolean;
  person: Person | null;
  onClose: () => void;
  onConfirm: (personId: string, personName: string) => Promise<void>;
}

export function DeleteConfirmModal({
  isOpen,
  person,
  onClose,
  onConfirm
}: Props) {
  const [deleting, setDeleting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen || !person) return null;

  const handleDelete = async () => {
    setDeleting(true);
    setErrorMsg(null);
    try {
      await onConfirm(person.id, person.name);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || '삭제 중 오류가 발생했습니다.');
      setDeleting(false);
    }
  };

  const assignedBus = person.out || person.back || 1;

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
        if (e.target === e.currentTarget && !deleting) onClose();
      }}
    >
      <div
        className="card"
        style={{
          width: '100%',
          maxWidth: '380px',
          margin: 0,
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
        }}
      >
        <div style={{ textAlign: 'center', padding: '6px 0 10px' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              background: '#fde9ee',
              color: '#d85f59',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '22px',
              marginBottom: '10px'
            }}
          >
            🗑️
          </div>
          <h2 style={{ fontSize: '17px', fontWeight: 800, color: '#1f344e', margin: '0 0 6px' }}>
            참가자 삭제 확인
          </h2>
          <p style={{ fontSize: '13px', color: '#68798b', margin: '0 0 14px', lineHeight: 1.5 }}>
            정말로 다음 참가자를 명단에서 삭제하시겠습니까?
          </p>

          <div
            style={{
              background: '#fbfaf8',
              border: '1px solid #eee8e4',
              borderRadius: '10px',
              padding: '12px',
              marginBottom: '16px',
              textAlign: 'left'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <strong style={{ fontSize: '15px', color: '#2b3d51' }}>{person.name}</strong>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: '6px',
                  background: assignedBus === 1 ? '#e7f5ff' : '#fff4e6',
                  color: assignedBus === 1 ? '#1864ab' : '#d9480f'
                }}
              >
                {assignedBus}호차
              </span>
            </div>
            <div style={{ fontSize: '12px', color: '#7a8b9e' }}>
              {person.dept || '소속 미지정'}
            </div>
            <div style={{ fontSize: '11px', color: '#b9534f', marginTop: '6px' }}>
              ※ 삭제 시 해당 참가자의 탑승 기록도 함께 정리됩니다.
            </div>
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

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              onClick={onClose}
              disabled={deleting}
              style={{
                flex: 1,
                height: '40px',
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
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              style={{
                flex: 1,
                height: '40px',
                background: '#fde9ee',
                border: '1.5px solid #f7c3cf',
                color: '#8f2545',
                borderRadius: '9px',
                fontWeight: 750
              }}
            >
              {deleting ? '삭제 중…' : '삭제하기'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
