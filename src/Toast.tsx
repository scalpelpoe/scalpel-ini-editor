export function Toast({ visible, message }: { visible: boolean; message: string }): JSX.Element {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 3,
        padding: '10px 12px',
        background: 'var(--match)',
        color: '#fff',
        fontSize: 12,
        fontWeight: 600,
        textAlign: 'center',
        transition: 'transform .2s ease-out, opacity .2s ease-out',
        transform: visible ? 'translateY(0)' : 'translateY(-100%)',
        opacity: visible ? 1 : 0,
        pointerEvents: 'none',
      }}
    >
      {message}
    </div>
  )
}
