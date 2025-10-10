export default function OrderCard({ order, onChange }) {
  const { id, cliente, direccion, status, assignedTo } = order;

  const handleReassign = async () => {
    const newDriver = prompt('ID del repartidor (vacío para quitar asignación):', assignedTo ?? '');
    if (newDriver === null) return;
    try {
      await onChange.reassign(id, newDriver || null);
      onChange.refresh();
    } catch (e) {
      alert('Error al reasignar');
    }
  };

  const handleStatus = async () => {
    const next = prompt('Nuevo estado (pendiente, asignado, en curso, entregado):', status);
    if (!next) return;
    try {
      await onChange.updateStatus(id, next);
      onChange.refresh();
    } catch {
      alert('Error al actualizar estado');
    }
  };

  return (
    <div style={{ border: '1px solid #ddd', padding: 12, borderRadius: 6 }}>
      <div><strong>{cliente}</strong></div>
      <div>{direccion}</div>
      <div>Estado: <em>{status}</em></div>
      <div>Asignado: <em>{assignedTo ?? '— sin asignar —'}</em></div>
      <div style={{ marginTop: 8 }}>
        <button onClick={handleReassign} style={{ marginRight: 8 }}>Reasignar</button>
        <button onClick={handleStatus}>Cambiar estado</button>
      </div>
    </div>
  );
}