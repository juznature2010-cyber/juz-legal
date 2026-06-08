export function AdminStats({
  newContacts,
  totalContacts,
  totalBookings,
  pendingBookings,
}: {
  newContacts: number;
  totalContacts: number;
  totalBookings: number;
  pendingBookings: number;
}) {
  const items = [
    { label: "Liên hệ mới", value: newContacts },
    { label: "Tổng liên hệ", value: totalContacts },
    { label: "Đặt lịch", value: totalBookings },
    { label: "Chờ xác nhận", value: pendingBookings },
  ];

  return (
    <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-lg border border-navy/10 bg-white p-5 shadow-sm"
        >
          <p className="text-xs uppercase tracking-wider text-muted">{item.label}</p>
          <p className="mt-2 font-serif text-3xl text-navy">{item.value}</p>
        </div>
      ))}
    </div>
  );
}
