export default function OrderCard({ order, onReassign }) {
  const { id, cliente, direccion, status, assignedTo } = order;

  const handleReassign = async () => {
    const newDriver = prompt(
      'ID del repartidor (vacío para quitar asignación):',
      assignedTo ?? ''
    );
    if (newDriver === null) return; // usuario canceló

    const driverId = Number(newDriver);
    if (isNaN(driverId) || driverId <= 0) {
      alert('Debe ingresar un ID válido de repartidor.');
      return;
    }

    try {
      await onReassign(id, driverId);
    } catch (e) {
      alert(e.message || 'Error al reasignar');
    }
  };

  return (
    <div style={{ border: '1px solid #ddd', padding: 12, borderRadius: 6 }}>
      <div><strong>{cliente}</strong></div>
      <div>{direccion}</div>
      <div>Estado: <em>{status}</em></div>
      <div>Asignado: <em>{assignedTo ?? '— sin asignar —'}</em></div>
      <div style={{ marginTop: 8 }}>
        <button onClick={handleReassign}>Reasignar repartidor</button>
      </div>
    </div>
  );
}