import ChatWorkspace from '@/components/ChatWorkspace';

export const dynamic = 'force-dynamic';

export default function ChatPage() {
  const schoolAppointmentUrl = process.env.SCHOOL_APPOINTMENT_URL || 'http://10.168.198.170/ConsultPlatformOut/default.html';

  return (
    <main className="container page-shell">
      <ChatWorkspace schoolAppointmentUrl={schoolAppointmentUrl} />
    </main>
  );
}
